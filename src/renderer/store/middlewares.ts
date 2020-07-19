import { Middleware } from 'redux';

export const loggingMiddleware: Middleware = (api) => (next) => (action) => {
  console.debug('dispatching', action);
  const result = next(action);
  console.debug('next state', api.getState());
  return result;
};
