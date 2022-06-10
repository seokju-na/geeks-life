import * as Factory from 'factory.ts';
import { DailyLog } from '../../models';

export const dummyDailyLog = Factory.Sync.makeFactory<DailyLog>({
  id: Factory.each(x => `id-${x}`),
  content: Factory.each(x => `content-${x}`),
});
