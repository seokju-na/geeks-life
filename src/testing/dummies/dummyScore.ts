import fc from 'fast-check';
import { Score } from '../../models';

export const dummyScore = fc.constantFrom<Score>('low', 'medium', 'high', 'excellent');
