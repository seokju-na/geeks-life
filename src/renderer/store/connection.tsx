import React, { ComponentClass, FunctionComponent } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, Store } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Action } from './core';
import { epic } from './epics';
import { loggingMiddleware } from './middlewares';
import { reducer } from './reducers';
import { State } from './state';

function withReduxStore<State>(configureStore: () => Store<State, Action>) {
  const store = configureStore();

  return function <Props = Record<string, unknown>>(
    AppComponent: FunctionComponent<Props> | ComponentClass<Props>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function AppWithReduxStore({ ...props }: any) {
      return (
        <Provider store={store}>
          <AppComponent {...props} />
        </Provider>
      );
    }

    return AppWithReduxStore;
  };
}

const epicMiddleware = createEpicMiddleware<Action, Action, State>();

export const withStore = withReduxStore(() => {
  const store = createStore(reducer, undefined, applyMiddleware(loggingMiddleware, epicMiddleware));

  epicMiddleware.run(epic);

  console.debug('initial state', store.getState());

  return store;
});
