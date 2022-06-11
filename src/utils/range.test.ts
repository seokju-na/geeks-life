import { test, it } from 'vitest';
import { range } from './range';

test('range', () => {
  it('create from start to end - 1.', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
  });

  it('If end is omitted, the range is created by setting start to 0 and end to start.', () => {
    expect(range(4)).toEqual([0, 1, 2, 3]);
  });

  it('step can be set.', () => {
    expect(range(1, 11, 3)).toEqual([1, 4, 7, 10]);
  });
});
