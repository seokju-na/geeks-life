import { addWeeks, getDay, getWeekOfMonth, subWeeks } from 'date-fns';
import produce from 'immer';
import { CommitDailyLifeErrorCode, dateFormattings, dateParsing } from '../../core';
import { createUniqueId, DailyLife } from '../../core/domain';
import { actions } from './actions';
import { Action, createReducer, on } from './core';
import { createDailyLifeAt, DateDisplayType, initialState, State } from './state';

function updateCurrentDailyLife(draft: State, patch: (draft: DailyLife) => void) {
  const date = dateParsing['yyyy-MM-dd'](draft.date);
  const dayOfWeek = getDay(date);
  const weekOfMonth = getWeekOfMonth(date);

  if (draft.dateDisplayType === DateDisplayType.Weekly && draft.weeklyLives != null) {
    if (draft.weeklyLives[dayOfWeek] === null) {
      draft.weeklyLives[dayOfWeek] = createDailyLifeAt(draft.date);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    patch(draft.weeklyLives[dayOfWeek]!);
  }

  if (draft.dateDisplayType === DateDisplayType.Monthly && draft.monthlyLives != null) {
    if (draft.monthlyLives[weekOfMonth - 1][dayOfWeek] === null) {
      draft.monthlyLives[weekOfMonth - 1][dayOfWeek] = createDailyLifeAt(draft.date);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    patch(draft.monthlyLives[weekOfMonth - 1][dayOfWeek]!);
  }
}

export const reducer = createReducer<Readonly<State>, Action>(
  initialState,
  on(actions.navigateToPrevWeek, (state) =>
    produce(state, (draft) => {
      draft.date = dateFormattings['yyyy-MM-dd'](
        subWeeks(dateParsing['yyyy-MM-dd'](draft.date), 1),
      );
      draft.modifiedAtDate = null;
    }),
  ),
  on(actions.navigateToNextWeek, (state) =>
    produce(state, (draft) => {
      draft.date = dateFormattings['yyyy-MM-dd'](
        addWeeks(dateParsing['yyyy-MM-dd'](draft.date), 1),
      );
      draft.modifiedAtDate = null;
    }),
  ),
  on(actions.changeDateDisplayType, (state, action) =>
    produce(state, (draft) => {
      draft.dateDisplayType = action.value;
      draft.modifiedAtDate = null;
    }),
  ),
  on(actions.changeDate, (state, action) =>
    produce(state, (draft) => {
      const nextDate = dateFormattings['yyyy-MM-dd'](action.date);

      if (draft.date !== nextDate) {
        draft.date = nextDate;
      }
    }),
  ),
  on(actions.updateDailyLife, (state, action) =>
    produce(state, (draft) => {
      const { payload } = action;

      if (payload.type === 'week') {
        draft.weeklyLives = payload.dailyLives;
      } else if (payload.type === 'month') {
        draft.monthlyLives = payload.dailyLives;
      }
    }),
  ),
  on(actions.updateDailyLifeModifiedFlag, (state, action) =>
    produce(state, (draft) => {
      draft.modifiedAtDate = action.modified;
    }),
  ),
  on(actions.changeDailyLifeScore, (state, action) =>
    produce(state, (draft) => {
      updateCurrentDailyLife(draft, (dailyLife) => {
        dailyLife.score = action.score;
      });
    }),
  ),
  on(actions.commitDailyLife.request, (state) =>
    produce(state, (draft) => {
      if (draft.modifiedAtDate === true) {
        draft.committing = true;
      }
    }),
  ),
  on(actions.commitDailyLife.response, (state, action) =>
    produce(state, (draft) => {
      if (draft.date === action.date) {
        draft.committing = false;
        draft.modifiedAtDate = false;
        draft.commitErrorCode = null;
      }
    }),
  ),
  on(actions.commitDailyLife.error, (state, action) =>
    produce(state, (draft) => {
      draft.committing = false;
      draft.commitErrorCode = action.errorCode;
    }),
  ),
  on(actions.gitUserConfigSetting.response, (state) =>
    produce(state, (draft) => {
      if (draft.commitErrorCode === CommitDailyLifeErrorCode.MissingNameError) {
        draft.commitErrorCode = null;
      }
    }),
  ),
  on(actions.gitUserConfigSetting.dismiss, (state) =>
    produce(state, (draft) => {
      draft.commitErrorCode = null;
    }),
  ),
  on(actions.emojis.response, (state, action) =>
    produce(state, (draft) => {
      draft.emojis = action.emojis;
    }),
  ),
  on(actions.dailyLogCategories.response, (state, action) =>
    produce(state, (draft) => {
      draft.dailyLogCategories = action.categories;
    }),
  ),
  on(actions.dailyLifeLogs.add, (state, action) =>
    produce(state, (draft) => {
      updateCurrentDailyLife(draft, (dailyLife) => {
        if (dailyLife.logs == null) {
          dailyLife.logs = [];
        }

        dailyLife.logs.push({
          id: createUniqueId(),
          ...action.payload,
        });
      });
    }),
  ),
  on(actions.dailyLifeLogs.edit, (state, action) =>
    produce(state, (draft) => {
      updateCurrentDailyLife(draft, (dailyLife) => {
        const index = dailyLife.logs?.findIndex((log) => log.id === action.id) ?? -1;

        if (dailyLife.logs != null && index > -1) {
          dailyLife.logs[index] = {
            ...dailyLife.logs[index],
            ...action.payload,
          };
        }
      });
    }),
  ),
  on(actions.dailyLifeLogs.delete, actions.dailyLifeLogs.deleteFocused, (state, action) =>
    produce(state, (draft) => {
      updateCurrentDailyLife(draft, (dailyLife) => {
        const id =
          action.type === actions.dailyLifeLogs.delete.type ? action.id : draft.focusedDailyLogId;
        const index = dailyLife.logs?.findIndex((log) => log.id === id) ?? -1;

        if (index > -1) {
          dailyLife.logs?.splice(index, 1);
        }
      });
    }),
  ),
  on(actions.dailyLifeLogs.focus, (state, action) =>
    produce(state, (draft) => {
      draft.focusedDailyLogId = action.id;
    }),
  ),
  on(actions.dailyLifeLogs.blur, (state, action) =>
    produce(state, (draft) => {
      if (draft.focusedDailyLogId === action.id) {
        draft.focusedDailyLogId = null;
      }
    }),
  ),
  on(actions.addDailyLifeLogPopover.show, (state) =>
    produce(state, (draft) => {
      draft.showAddDailyLifeLogPopover = true;
    }),
  ),
  on(actions.addDailyLifeLogPopover.hide, (state) =>
    produce(state, (draft) => {
      draft.showAddDailyLifeLogPopover = false;
    }),
  ),
  on(actions.editDailyLifeLogPopover.show, (state) =>
    produce(state, (draft) => {
      draft.showEditDailyLifeLogPopover = true;
    }),
  ),
  on(actions.editDailyLifeLogPopover.hide, (state) =>
    produce(state, (draft) => {
      draft.showEditDailyLifeLogPopover = false;
    }),
  ),
);
