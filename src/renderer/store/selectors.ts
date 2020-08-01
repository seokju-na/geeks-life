import { format, getDay, getWeekOfMonth, isToday } from 'date-fns';
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
const selectEmojis = (state: State) => state.emojis;
const selectDailyLogCategories = (state: State) => state.dailyLogCategories;

const selectDateAsFormatted = createSelector(
  [selectDate, selectDateDisplayType],
  (date, displayType) => {
    switch (displayType) {
      case DateDisplayType.Weekly:
        return format(new Date(date), "wo 'Week of' yyyy");
      case DateDisplayType.Monthly:
        return format(new Date(date), 'MMM, yyyy');
    }
  },
);

const selectIsDateToday = createSelector([selectDate], (date) =>
  isToday(dateParsing['yyyy-MM-dd'](date)),
);

const selectCurrentDailyLife = createSelector(
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
);

const selectCurrentDailyLifeLogs = createSelector(
  [selectCurrentDailyLife, selectDailyLogCategories],
  (dailyLife, categories) =>
    dailyLife?.logs?.filter((log) =>
      categories.some((category) => category.id === log.categoryId),
    ) ?? [],
);

export const selectors = {
  date: selectDate,
  dateAsFormatted: selectDateAsFormatted,
  isDateToday: selectIsDateToday,
  modifiedAtDate: selectModifiedAtDate,
  dateDisplayType: selectDateDisplayType,
  weeklyLives: selectWeeklyLives,
  monthlyLives: selectMonthlyLives,
  currentDailyLife: selectCurrentDailyLife,
  currentDailyLifeLogs: selectCurrentDailyLifeLogs,
  committing: selectCommitting,
  commitErrorCode: selectCommitErrorCode,
  emojis: selectEmojis,
  dailyLogCategories: selectDailyLogCategories,
} as const;
