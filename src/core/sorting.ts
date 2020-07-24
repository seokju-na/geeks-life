export enum SortingType {
  Desc = 'desc',
  Asc = 'asc',
}

export type ComparableType = string | number;
export type SortingFn = (a: ComparableType, b: ComparableType) => -1 | 0 | 1;

export const sorting: Readonly<Record<SortingType, SortingFn>> = {
  [SortingType.Desc]: (a, b) => (a < b ? 1 : a < b ? -1 : 0),
  [SortingType.Asc]: (a, b) => (a < b ? -1 : a < b ? 1 : 0),
};

export function sort<T>(items: T[], type: SortingType, iteratee: (item: T) => ComparableType) {
  const sortFn = sorting[type];

  items.sort((a, b) => sortFn(iteratee(a), iteratee(b)));

  return items;
}
