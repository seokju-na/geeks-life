import { format } from 'date-fns';
import { createSelector } from 'reselect';
import { DateDisplayType, State } from './state';

const selectDate = (state: State) => state.date;
const selectDateDisplayType = (state: State) => state.dateDisplayType;

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
  dateDisplayType: selectDateDisplayType,
} as const;
