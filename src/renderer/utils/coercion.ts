// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function coerceCssPixelValue(value: any) {
  if (value == null) {
    return '';
  }

  return typeof value === 'string' ? value : `${value}px`;
}
