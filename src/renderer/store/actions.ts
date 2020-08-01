import { CommitDailyLifeErrorCode, LoadDailyLifeResponse } from '../../core';
import { DailyLogCategory, DailyScore, Emoji } from '../../core/domain';
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
  requestDailyLife: createAction('requestDailyLife'),
  updateDailyLife: createAction(
    'updateDailyLife',
    props<{
      payload: LoadDailyLifeResponse;
    }>(),
  ),
  requestDailyLifeModifiedFlag: createAction('requestDailyLifeModifiedFlag'),
  updateDailyLifeModifiedFlag: createAction(
    'updateDailyLifeModifiedFlag',
    props<{ modified: boolean }>(),
  ),
  emojis: {
    request: createAction('emojis.request'),
    response: createAction('emojis.response', props<{ emojis: Emoji[] }>()),
  },
  dailyLogCategories: {
    request: createAction('dailyLogCategories.request'),
    response: createAction(
      'dailyLogCategories.response',
      props<{ categories: DailyLogCategory[] }>(),
    ),
  },
  changeDailyLifeScore: createAction('changeDailyLifeScore', props<{ score: DailyScore }>()),
  commitDailyLife: {
    request: createAction('commitDailyLife.request'),
    response: createAction('commitDailyLife.response', props<{ date: string }>()),
    error: createAction('commitDailyLife.error', props<{ errorCode: CommitDailyLifeErrorCode }>()),
  },
  gitUserConfigSetting: {
    request: createAction('gitUserConfigSetting.request', props<{ name: string; email: string }>()),
    response: createAction('gitUserConfigSetting.response'),
    error: createAction('gitUserConfigSetting.error', props<{ errorCode: string }>()),
  },
} as const;
