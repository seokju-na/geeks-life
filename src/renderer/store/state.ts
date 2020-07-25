import { createEnumKeyFind, dateFormattings } from '../../core';

export enum DateDisplayType {
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export const dateDisplayTypes = Object.values(DateDisplayType);

export const getDateDisplayTypeName = createEnumKeyFind(DateDisplayType);

export interface State {
  dateDisplayType: DateDisplayType;
  date: string;
}

// TODO: get initial state from storage (can save for next)
export const initialState: Readonly<State> = {
  dateDisplayType: DateDisplayType.Weekly,
  date: dateFormattings['yyyy-MM-dd'](new Date()),
};
