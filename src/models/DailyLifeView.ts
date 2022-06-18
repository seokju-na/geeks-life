import * as z from 'zod';

export const DailyLifeView = z.nativeEnum({
  Weekly: 'week',
  Monthly: 'month',
} as const);
export type DailyLifeView = z.infer<typeof DailyLifeView>;
