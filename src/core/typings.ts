export type ValueOf<T> = T[keyof T];

/**
 * Create function that find enum key.
 *
 * @example
 * enum Sample {
 *   Key1 = 'val1',
 *   Key2 = 'val2,
 * }
 *
 * const find = createEnumKeyFind(Sample);
 * find(Sample.Key1); // 'Key1'
 * find('val2'); // 'Key2'
 */
export function createEnumKeyFind<T extends Record<string, unknown>>(obj: T) {
  const keys = Object.keys(obj) as Array<keyof T>;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (value: ValueOf<T>) => keys.find((key) => obj[key] === value)!;
}

export type Nullable<T> = T | null | undefined;
