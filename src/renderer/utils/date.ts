import { format, parse } from 'date-fns';

export const dateFormattings = {
  'yyyy-MM-dd': (date: Date) => format(date, 'yyyy-MM-dd'),
} as const;

export const dateParsing = {
  'yyyy-MM-dd': (date: string) => parse(date, 'yyyy-MM-dd', new Date()),
} as const;
