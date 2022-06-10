import { getUnixTime, format, addDays } from 'date-fns';
import * as Factory from 'factory.ts';
import { DailyLife } from '../../models';

export const dummyDailyLife = Factory.Sync.makeFactory<DailyLife>({
  id: Factory.each(x => format(addDays(new Date(), x), 'yyyy-MM-dd')),
  logs: [],
  createdAt: Factory.each(x => getUnixTime(addDays(new Date(), x))),
  updatedAt: Factory.each(x => getUnixTime(addDays(new Date(), x))),
});
