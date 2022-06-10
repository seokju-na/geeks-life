import { getUnixTime, format } from 'date-fns';
import fc from 'fast-check';
import { DailyLife } from '../../models';
import { dummyDailyLog } from './dummyDailyLog';
import { dummyScore } from './dummyScore';

export const dummyDailyLifeId = fc.date().map(d => format(d, 'yyyy-MM-dd'));

export const dummyDailyLife = fc.record<DailyLife>({
  id: dummyDailyLifeId,
  score: fc.option(dummyScore),
  logs: fc.array(dummyDailyLog),
  createdAt: fc.date().map(getUnixTime),
  updatedAt: fc.date().map(getUnixTime),
});
