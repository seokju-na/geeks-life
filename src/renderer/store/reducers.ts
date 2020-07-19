import { addWeeks, subWeeks } from 'date-fns';
import produce from 'immer';
import { dateFormattings, dateParsing } from '../utils/date';
import { actions } from './actions';
import { Action, createReducer, on } from './core';
import { initialState, State } from './state';

export const reducer = createReducer<Readonly<State>, Action>(
  initialState,
  on(actions.navigateToPrevWeek, (state) =>
    produce(state, (draft) => {
      draft.date = dateFormattings['yyyy-MM-dd'](
        subWeeks(dateParsing['yyyy-MM-dd'](draft.date), 1),
      );
    }),
  ),
  on(actions.navigateToNextWeek, (state) =>
    produce(state, (draft) => {
      draft.date = dateFormattings['yyyy-MM-dd'](
        addWeeks(dateParsing['yyyy-MM-dd'](draft.date), 1),
      );
    }),
  ),
  on(actions.changeDateDisplayType, (state, action) =>
    produce(state, (draft) => {
      draft.dateDisplayType = action.value;
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
);
