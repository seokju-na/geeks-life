import { combineEpics, Epic as EpicType } from 'redux-observable';
import { exhaustMap, filter, ignoreElements, map, tap, withLatestFrom } from 'rxjs/operators';
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
  MenuOnCommitChangesFlagChangePayload,
  SaveDailyLifeRequest,
} from '../../core';
import { sendIpcMessage } from '../hooks/useIpcListener';
import { actions } from './actions';
import { Action, ofType } from './core';
import { selectors } from './selectors';
import { DateDisplayType, State } from './state';
import { createIpcRequestAndResponse } from './utils';

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
    ofType(
      actions.changeDailyLifeScore,
      actions.dailyLifeLogs.add,
      actions.dailyLifeLogs.edit,
      actions.dailyLifeLogs.delete,
    ),
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

const requestDailyLife = createIpcRequestAndResponse<
  CommitDailyLifeRequest,
  CommitDailyLifeResponse
>(ipcChannels.commitDailyLifeRequest, ipcChannels.commitDailyLifeResponse);

const commitDailyLifeEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(actions.commitDailyLife.request),
    withLatestFrom(state$),
    map(([, state]) => state),
    filter((state) => state.modifiedAtDate === true),
    exhaustMap((state) =>
      requestDailyLife({
        date: state.date,
      }).pipe(
        map((payload) => {
          if (payload.errorCode != null) {
            return actions.commitDailyLife.error({ errorCode: payload.errorCode });
          }

          return actions.commitDailyLife.response({ date: payload.date });
        }),
      ),
    ),
  );

const requestGitUserConfigSet = createIpcRequestAndResponse<
  GitUserConfigSetRequest,
  GitUserConfigSetResponse
>(ipcChannels.gitUserConfigSetRequest, ipcChannels.gitUserConfigSetResponse);

const gitUserConfigSettingEpic: Epic = (action$) =>
  action$.pipe(
    ofType(actions.gitUserConfigSetting.request),
    exhaustMap((action) =>
      requestGitUserConfigSet({
        name: action.name,
        email: action.email,
      }).pipe(
        map((payload) => {
          if (payload.errorCode != null) {
            return actions.gitUserConfigSetting.error({ errorCode: payload.errorCode });
          }

          return actions.gitUserConfigSetting.response();
        }),
      ),
    ),
  );

const requestEmojis = createIpcRequestAndResponse<void, EmojisResponse>(
  ipcChannels.emojiRequest,
  ipcChannels.emojiResponse,
);

const requestEmojiEpic: Epic = (action$) =>
  action$.pipe(
    ofType(actions.emojis.request),
    exhaustMap(() =>
      requestEmojis().pipe(
        map((payload) => ({ emojis: payload.emojis })),
        map(actions.emojis.response),
      ),
    ),
  );

const requestDailyLogCategories = createIpcRequestAndResponse<void, LoadDailyLogCategoriesResponse>(
  ipcChannels.loadDailyLogCategoriesRequest,
  ipcChannels.loadDailyLogCategoriesResponse,
);

const requestDailyLogCategoriesEpic: Epic = (action$) =>
  action$.pipe(
    ofType(actions.dailyLogCategories.request),
    exhaustMap(() =>
      requestDailyLogCategories().pipe(
        map((payload) => ({ categories: payload.categories })),
        map(actions.dailyLogCategories.response),
      ),
    ),
  );

const updateMenuWhenDateDisplayTypeChangeEpic: Epic = (action$) =>
  action$.pipe(
    ofType(actions.changeDateDisplayType),
    tap((action) => {
      switch (action.value) {
        case DateDisplayType.Weekly:
          sendIpcMessage(ipcChannels.menuOnWeeklyView);
          break;
        case DateDisplayType.Monthly:
          sendIpcMessage(ipcChannels.menuOnMonthlyView);
          break;
      }
    }),
    ignoreElements(),
  );

const updateMenuWhenDailyLifeModifiedFlagChangeEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(actions.updateDailyLifeModifiedFlag, actions.commitDailyLife.response),
    withLatestFrom(state$),
    map(([, state]) => state.modifiedAtDate),
    tap((enabled) => {
      if (enabled === null) {
        return;
      }

      sendIpcMessage<MenuOnCommitChangesFlagChangePayload>(
        ipcChannels.menuOnCommitChangesFlagChange,
        {
          enabled,
        },
      );
    }),
    ignoreElements(),
  );

const updateMenuWhenDailyLifeLogFocusEpic: Epic = (action$) =>
  action$.pipe(
    ofType(actions.dailyLifeLogs.focus),
    tap(() => {
      sendIpcMessage(ipcChannels.menuOnFocusLog);
    }),
    ignoreElements(),
  );

const updateMenuWhenDailyLifeLogBlurEpic: Epic = (action$) =>
  action$.pipe(
    ofType(actions.dailyLifeLogs.blur),
    tap(() => {
      sendIpcMessage(ipcChannels.menuOnBlurLog);
    }),
    ignoreElements(),
  );

export const epic = combineEpics(
  requestDailyLivesEpic,
  requestDailyLifeModifiedFlagEpic,
  saveDailyLifeEpic,
  commitDailyLifeEpic,
  gitUserConfigSettingEpic,
  requestEmojiEpic,
  requestDailyLogCategoriesEpic,
  updateMenuWhenDateDisplayTypeChangeEpic,
  updateMenuWhenDailyLifeModifiedFlagChangeEpic,
  updateMenuWhenDailyLifeLogFocusEpic,
  updateMenuWhenDailyLifeLogBlurEpic,
);
