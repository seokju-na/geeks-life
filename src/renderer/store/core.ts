/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
/**
 * Source are taken from ngrx library and modified a bit.
 * See: https://github.com/ngrx/platform/blob/8.3.0/modules/store/src/models.ts
 */

import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

export const $$TYPE = Symbol('$$type');

export interface Dispatchable {
  type: string;
}

// declare to make it property-renaming safe
export declare interface TypedDispatchable<T extends string> extends Dispatchable {
  readonly type: T;
}

export type DispatchableType<A> = A extends DispatchableCreator<infer T, infer C>
  ? ReturnType<C> & { type: T }
  : never;

export type TypeId<T> = () => T;

export type InitialState<T> = Partial<T> | TypeId<Partial<T>> | void;

/**
 * A function that takes an `Action` and a `State`, and returns a `State`.
 * See `createReducer`.
 */
export interface Reducer<T, V extends Dispatchable = Dispatchable> {
  (state: T | undefined, action: V): T;
}

export type DisallowTypeProperty<T> = T extends { type: any }
  ? TypePropertyIsNotAllowed
  : T extends { [$$TYPE]: any }
  ? TypePropertyIsNotAllowed
  : T;

export const typePropertyIsNotAllowedMsg =
  'type, $$type property is not allowed in action creators';
type TypePropertyIsNotAllowed = typeof typePropertyIsNotAllowedMsg;

export type Creator<P extends any[] = any[], R extends object = object> = R extends { type: any }
  ? TypePropertyIsNotAllowed
  : FunctionWithParametersType<P, R>;

export type PropsReturnType<T extends object> = T extends { type: any }
  ? TypePropertyIsNotAllowed
  : { _as: 'props'; _p: T };

export type DispatchableCreator<T extends string = string, C extends Creator = Creator> = C &
  TypedDispatchable<T>;

export type FunctionWithParametersType<P extends unknown[], R = void> = (...args: P) => R;

export type ParametersType<T> = T extends (...args: infer U) => unknown ? U : never;

export function createDispatchable<T extends string>(
  $$type: string,
  type: T,
): DispatchableCreator<T, () => TypedDispatchable<T>>;
export function createDispatchable<T extends string, P extends object>(
  $$type: string,
  type: T,
  config: { _as: 'props'; _p: P },
): DispatchableCreator<T, (props: P) => P & TypedDispatchable<T>>;
export function createDispatchable<T extends string, P extends any[], R extends object>(
  $$type: string,
  type: T,
  creator: Creator<P, DisallowTypeProperty<R>>,
): FunctionWithParametersType<P, R & TypedDispatchable<T>> & TypedDispatchable<T>;
export function createDispatchable<T extends string, C extends Creator>(
  $$type: string,
  type: T,
  config?: { _as: 'props' } | C,
): Creator {
  if (typeof config === 'function') {
    return defineType($$type, type, (...args: any[]) => ({
      ...config(...args),
      type,
    }));
  }
  const as = config ? config._as : 'empty';
  switch (as) {
    case 'empty':
      return defineType($$type, type, () => ({ type }));
    case 'props':
      return defineType($$type, type, (props: object) => ({
        ...props,
        type,
      }));
    default:
      throw new Error('Unexpected config.');
  }
}

export function props<P extends object>(): PropsReturnType<P> {
  // the return type does not match TypePropertyIsNotAllowed, so double casting
  // is used.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return ({ _as: 'props', _p: undefined! } as unknown) as PropsReturnType<P>;
}

export function union<
  C extends { [key: string]: DispatchableCreator<string, Creator> }
>(): ReturnType<C[keyof C]> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return undefined!;
}

function defineType($$type: any, type: string, creator: Creator): Creator {
  return Object.defineProperties(creator, {
    [$$TYPE]: {
      value: $$type,
      writable: false,
    },
    type: {
      value: type,
      writable: false,
    },
  });
}

export interface On<S> {
  reducer: Reducer<S>;
  types: string[];
}

// Specialized Reducer that is aware of the Action type it needs to handle
export interface OnReducer<S, C extends DispatchableCreator[]> {
  (state: S, action: DispatchableType<C[number]>): S;
}

export function on<C1 extends DispatchableCreator, S>(
  creator1: C1,
  reducer: OnReducer<S, [C1]>,
): On<S>;
export function on<C1 extends DispatchableCreator, C2 extends DispatchableCreator, S>(
  creator1: C1,
  creator2: C2,
  reducer: OnReducer<S, [C1, C2]>,
): On<S>;
export function on<
  C1 extends DispatchableCreator,
  C2 extends DispatchableCreator,
  C3 extends DispatchableCreator,
  S
>(creator1: C1, creator2: C2, creator3: C3, reducer: OnReducer<S, [C1, C2, C3]>): On<S>;
export function on<
  C1 extends DispatchableCreator,
  C2 extends DispatchableCreator,
  C3 extends DispatchableCreator,
  C4 extends DispatchableCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  reducer: OnReducer<S, [C1, C2, C3, C4]>,
): On<S>;
export function on<
  C1 extends DispatchableCreator,
  C2 extends DispatchableCreator,
  C3 extends DispatchableCreator,
  C4 extends DispatchableCreator,
  C5 extends DispatchableCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5]>,
): On<S>;
export function on<
  C1 extends DispatchableCreator,
  C2 extends DispatchableCreator,
  C3 extends DispatchableCreator,
  C4 extends DispatchableCreator,
  C5 extends DispatchableCreator,
  C6 extends DispatchableCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  creator6: C6,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5, C6]>,
): On<S>;
export function on<
  C1 extends DispatchableCreator,
  C2 extends DispatchableCreator,
  C3 extends DispatchableCreator,
  C4 extends DispatchableCreator,
  C5 extends DispatchableCreator,
  C6 extends DispatchableCreator,
  C7 extends DispatchableCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  creator6: C6,
  creator7: C7,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5, C6, C7]>,
): On<S>;
export function on<
  C1 extends DispatchableCreator,
  C2 extends DispatchableCreator,
  C3 extends DispatchableCreator,
  C4 extends DispatchableCreator,
  C5 extends DispatchableCreator,
  C6 extends DispatchableCreator,
  C7 extends DispatchableCreator,
  C8 extends DispatchableCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  creator6: C6,
  creator7: C7,
  creator8: C8,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8]>,
): On<S>;
export function on<
  C1 extends DispatchableCreator,
  C2 extends DispatchableCreator,
  C3 extends DispatchableCreator,
  C4 extends DispatchableCreator,
  C5 extends DispatchableCreator,
  C6 extends DispatchableCreator,
  C7 extends DispatchableCreator,
  C8 extends DispatchableCreator,
  C9 extends DispatchableCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  creator6: C6,
  creator7: C7,
  creator8: C8,
  creator9: C9,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8, C9]>,
): On<S>;
export function on<
  C1 extends DispatchableCreator,
  C2 extends DispatchableCreator,
  C3 extends DispatchableCreator,
  C4 extends DispatchableCreator,
  C5 extends DispatchableCreator,
  C6 extends DispatchableCreator,
  C7 extends DispatchableCreator,
  C8 extends DispatchableCreator,
  C9 extends DispatchableCreator,
  C10 extends DispatchableCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  creator6: C6,
  creator7: C7,
  creator8: C8,
  creator9: C9,
  creator10: C10,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]>,
): On<S>;
export function on<S>(
  creator: DispatchableCreator,
  ...rest: (DispatchableCreator | OnReducer<S, [DispatchableCreator]>)[]
): On<S>;
export function on(
  ...args: (DispatchableCreator | Function)[]
): { reducer: Function; types: string[] } {
  const reducer = args.pop() as Function;
  const types = args.reduce(
    (result, creator) => [...result, (creator as DispatchableCreator).type],
    [] as string[],
  );
  return { reducer, types };
}

export function createReducer<S, A extends Dispatchable = Dispatchable>(
  initialState: S,
  ...ons: On<S>[]
): Reducer<S, A> {
  const map = new Map<string, Reducer<S, A>>();
  for (const on of ons) {
    for (const type of on.types) {
      map.set(type, on.reducer);
    }
  }

  return function (state: S = initialState, action: A): S {
    const reducer = map.get(action.type);
    return reducer ? reducer(state, action) : state;
  };
}

export function matchType<T extends Dispatchable>(value: unknown, type: string): value is T {
  return typeof value === 'object' && value != null && (value as any)[$$TYPE] === type;
}

export const ACTION_TYPE = '@action';

export interface Action extends Dispatchable {}

export interface TypedAction<T extends string> extends Action {
  readonly type: T;
}

export type ActionTypeOf<T> = T extends Creator ? ReturnType<T> : never;

export function isAction(value: unknown): value is Action {
  return matchType(value, ACTION_TYPE);
}

export type ActionCreator<T extends string = string, C extends Creator = Creator> = C &
  TypedAction<T>;

export function ofType<
  AC extends ActionCreator[],
  U extends Action = Action,
  V = ReturnType<AC[number]>
>(...allowedTypes: AC): OperatorFunction<U, V>;
export function ofType<
  E extends Extract<U, { type: T1 }>,
  AC extends ActionCreator,
  T1 extends string | AC,
  U extends Action = Action,
  V = T1 extends string ? E : ReturnType<Extract<T1, AC>>
>(t1: T1): OperatorFunction<U, V>;
export function ofType<V extends Action>(
  ...allowedTypes: Array<string | ActionCreator>
): OperatorFunction<Action, V>;
export function ofType(
  ...allowedTypes: Array<string | ActionCreator>
): OperatorFunction<Action, Action> {
  return filter((action: Action) =>
    allowedTypes.some((typeOrActionCreator) => {
      if (typeof typeOrActionCreator === 'string') {
        // Comparing the string to type
        return typeOrActionCreator === action.type;
      }

      // We are filtering by ActionCreator
      return typeOrActionCreator.type === action.type;
    }),
  );
}

export function createAction<T extends string>(
  type: T,
): DispatchableCreator<T, () => TypedAction<T>>;
export function createAction<T extends string, P extends object>(
  type: T,
  config: { _as: 'props'; _p: P },
): DispatchableCreator<T, (props: P) => P & TypedAction<T>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAction<T extends string, P extends any[], R extends object>(
  type: T,
  creator: Creator<P, DisallowTypeProperty<R>>,
): FunctionWithParametersType<P, R & TypedAction<T>> & TypedAction<T>;
export function createAction<T extends string, C extends Creator>(
  type: T,
  config?: C,
): DispatchableCreator<T, (props: object) => object & TypedDispatchable<T>> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return createDispatchable(ACTION_TYPE, type, config!);
}
