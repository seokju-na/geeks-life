import fc from 'fast-check';
import { DailyLog } from '../../models';

export const dummyDailyLog = fc.record<DailyLog>({
  id: fc.uuid(),
  emoji: fc.option(fc.string()),
  content: fc.option(fc.unicodeString()),
});
