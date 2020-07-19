import { DailyLog } from '../../core/domain';
import { createAction, props } from './core';
import { DateDisplayType } from './state';

export const actions = {
  navigateToPrevWeek: createAction('navigateToPrevWeek'),
  navigateToNextWeek: createAction('navigateToNextWeek'),
  changeDate: createAction('changeDate', props<{ date: Date }>()),
  changeDateDisplayType: createAction(
    'changeDateDisplayType',
    props<{
      value: DateDisplayType;
    }>(),
  ),
  loadDayLogs: {
    request: createAction(
      'loadDayLogs.request',
      props<{
        date: Date;
      }>(),
    ),
    complete: createAction(
      'loadDayLogs.complete',
      props<{
        logs: DailyLog[];
      }>(),
    ),
    error: createAction('loadDayLogs.error', props<{ error: Error }>()),
  },
} as const;
