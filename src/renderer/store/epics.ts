import { combineEpics, Epic as EpicType } from 'redux-observable';
import { concat, EMPTY, of } from 'rxjs';
import {
  exhaustMap,
  filter,
  ignoreElements,
  map,
  mergeMap,
  share,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  CommitDailyLifeRequest,
  CommitDailyLifeResponse,
  EmojisResponse,
  GitUserConfigSetRequest,
  GitUserConfigSetResponse,
  ipcChannels,
  LoadDailyLifeModifiedFlagRequest,
  LoadDailyLifeRequest,
  LoadDailyLogCategoriesResponse,
  match,
  SaveDailyLifeRequest,
} from '../../core';
import { listenIpc, sendIpcMessage } from '../hooks/useIpcListener';
import { actions } from './actions';
import { Action, ofType } from './core';
import { selectors } from './selectors';
import { DateDisplayType, State } from './state';

export type Epic = EpicType<Action, Action, Readonly<State>>;

const matchDateDisplayType = match<DateDisplayType, LoadDailyLifeRequest['type']>({
  [DateDisplayType.Weekly]: 'week',
  [DateDisplayType.Monthly]: 'month',
});

const requestDailyLivesEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(
      actions.requestDailyLife,
      actions.changeDateDisplayType,
      actions.navigateToNextWeek,
      actions.navigateToPrevWeek,
    ),
    withLatestFrom(state$),
    map(([, state]) => state),
    tap((state) => {
      const { date, dateDisplayType } = state;

      sendIpcMessage<LoadDailyLifeRequest>(ipcChannels.loadDailyLifeRequest, {
        type: matchDateDisplayType(dateDisplayType),
        date,
      });
    }),
    ignoreElements(),
  );

const requestDailyLifeModifiedFlagEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(
      actions.requestDailyLifeModifiedFlag,
      actions.changeDate,
      actions.changeDateDisplayType,
      actions.navigateToNextWeek,
      actions.navigateToPrevWeek,
    ),
    withLatestFrom(state$),
    map(([, state]) => state),
    tap((state) => {
      const { date } = state;
      console.log('modified flag request', date);

      sendIpcMessage<LoadDailyLifeModifiedFlagRequest>(
        ipcChannels.loadDailyLifeModifiedFlagRequest,
        {
          date,
        },
      );
    }),
    ignoreElements(),
  );

const saveDailyLifeEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(actions.changeDailyLifeScore),
    withLatestFrom(state$),
    map(([, state]) => state),
    tap((state) => {
      const { date } = state;
      const dailyLife = selectors.currentDailyLife(state);

      if (dailyLife == null) {
        return;
      }

      sendIpcMessage<SaveDailyLifeRequest>(ipcChannels.saveDailyLifeRequest, {
        date,
        dailyLife,
      });
    }),
    ignoreElements(),
  );

const commitDailyLifeResponse$ = listenIpc<CommitDailyLifeResponse>(
  ipcChannels.commitDailyLifeResponse,
).pipe(share());

const commitDailyLifeEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(actions.commitDailyLife.request),
    withLatestFrom(state$),
    map(([, state]) => state),
    filter((state) => state.modifiedAtDate === true),
    exhaustMap((state) => {
      const request$ = of(null).pipe(
        tap(() => {
          sendIpcMessage<CommitDailyLifeRequest>(ipcChannels.commitDailyLifeRequest, {
            date: state.date,
          });
        }),
        ignoreElements(),
      );

      const response$ = commitDailyLifeResponse$.pipe(
        mergeMap((payload) => {
          if (payload == null) {
            return EMPTY;
          }

          if (payload.errorCode != null) {
            return of(actions.commitDailyLife.error({ errorCode: payload.errorCode }));
          }

          return of(actions.commitDailyLife.response({ date: payload.date }));
        }),
      );

      return concat(request$, response$);
    }),
  );

const gitUserConfigSetResponse$ = listenIpc<GitUserConfigSetResponse>(
  ipcChannels.gitUserConfigSetResponse,
).pipe(share());

const gitUserConfigSettingEpic: Epic = (action$) =>
  action$.pipe(
    ofType(actions.gitUserConfigSetting.request),
    exhaustMap((action) => {
      const request$ = of(null).pipe(
        tap(() => {
          sendIpcMessage<GitUserConfigSetRequest>(ipcChannels.gitUserConfigSetRequest, {
            name: action.name,
            email: action.email,
          });
        }),
        ignoreElements(),
      );

      const response$ = gitUserConfigSetResponse$.pipe(
        mergeMap((payload) => {
          if (payload == null) {
            return EMPTY;
          }

          if (payload.errorCode != null) {
            return of(actions.gitUserConfigSetting.error({ errorCode: payload.errorCode }));
          }

          return of(actions.gitUserConfigSetting.response());
        }),
      );

      return concat(request$, response$);
    }),
  );

const emojisResponse$ = listenIpc<EmojisResponse>(ipcChannels.emojiResponse).pipe(share());

const requestEmojiEpic: Epic = (action$) =>
  action$.pipe(
    ofType(actions.emojis.request),
    exhaustMap(() => {
      const request$ = of(null).pipe(
        tap(() => {
          sendIpcMessage(ipcChannels.emojiRequest);
        }),
        ignoreElements(),
      );

      const response$ = emojisResponse$.pipe(
        mergeMap((payload) => {
          if (payload == null) {
            return EMPTY;
          }

          return of(actions.emojis.response({ emojis: payload.emojis }));
        }),
      );

      return concat(request$, response$);
    }),
  );

const dailyLogCategoriesResponse$ = listenIpc<LoadDailyLogCategoriesResponse>(
  ipcChannels.loadDailyLogCategoriesResponse,
).pipe(share());

const requestDailyLogCategoriesEpic: Epic = (action$) =>
  action$.pipe(
    ofType(actions.dailyLogCategories.request),
    exhaustMap(() => {
      const request$ = of(null).pipe(
        tap(() => {
          sendIpcMessage(ipcChannels.loadDailyLogCategoriesRequest);
        }),
        ignoreElements(),
      );

      const response$ = dailyLogCategoriesResponse$.pipe(
        mergeMap((payload) => {
          if (payload == null) {
            return EMPTY;
          }

          return of(actions.dailyLogCategories.response({ categories: payload.categories }));
        }),
      );

      return concat(request$, response$);
    }),
  );

export const epic = combineEpics(
  requestDailyLivesEpic,
  requestDailyLifeModifiedFlagEpic,
  saveDailyLifeEpic,
  commitDailyLifeEpic,
  gitUserConfigSettingEpic,
  requestEmojiEpic,
  requestDailyLogCategoriesEpic,
);
