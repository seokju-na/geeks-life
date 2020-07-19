import React, { ComponentClass, FunctionComponent } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, Store } from 'redux';
import { Action } from './core';
import { loggingMiddleware } from './middlewares';
import { reducer } from './reducers';

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

export const withStore = withReduxStore(() => {
  const store = createStore(reducer, undefined, applyMiddleware(loggingMiddleware));

  console.debug('initial state', store.getState());

  return store;
});
