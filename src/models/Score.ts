import * as z from 'zod';

export const Score = z.nativeEnum({
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Excellent: 'excellent',
} as const);
export type Score = z.infer<typeof Score>;

export function getScoreColor(score: Score): string {
  switch (score) {
    case 'low':
      return '#9be9a8';
    case 'medium':
      return '#40c463';
    case 'high':
      return '#30a14e';
    case 'excellent':
      return '#216e39';
  }
}
