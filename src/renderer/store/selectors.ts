import { format, getDay, getWeekOfMonth } from 'date-fns';
import { createSelector } from 'reselect';
import { dateParsing } from '../../core';
import { DateDisplayType, State } from './state';

const selectDate = (state: State) => state.date;
const selectDateDisplayType = (state: State) => state.dateDisplayType;
const selectModifiedAtDate = (state: State) => state.modifiedAtDate;
const selectWeeklyLives = (state: State) => state.weeklyLives;
const selectMonthlyLives = (state: State) => state.monthlyLives;
const selectCommitting = (state: State) => state.committing;
const selectCommitErrorCode = (state: State) => state.commitErrorCode;

export const selectors = {
  date: selectDate,
  dateAsFormatted: createSelector([selectDate, selectDateDisplayType], (date, displayType) => {
    switch (displayType) {
      case DateDisplayType.Weekly:
        return format(new Date(date), "wo 'Week of' yyyy");
      case DateDisplayType.Monthly:
        return format(new Date(date), 'MMM, yyyy');
    }
  }),
  modifiedAtDate: selectModifiedAtDate,
  dateDisplayType: selectDateDisplayType,
  weeklyLives: selectWeeklyLives,
  monthlyLives: selectMonthlyLives,
  currentDailyLife: createSelector(
    [selectDate, selectDateDisplayType, selectWeeklyLives, selectMonthlyLives],
    (dateStr, dateDisplayType, weeklyLives, monthlyLives) => {
      const date = dateParsing['yyyy-MM-dd'](dateStr);
      const dayOfWeek = getDay(date);
      const weekOfMonth = getWeekOfMonth(date);

      switch (dateDisplayType) {
        case DateDisplayType.Weekly:
          return weeklyLives?.[dayOfWeek];
        case DateDisplayType.Monthly:
          return monthlyLives?.[weekOfMonth - 1][dayOfWeek];
      }
    },
  ),
  committing: selectCommitting,
  commitErrorCode: selectCommitErrorCode,
} as const;
