import { Dispatch, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { updateApiConfig } from '../api';
import { storageAuth } from '../auth';
import { updateAuth } from '../features/authSlice';

export const authMiddleware: Middleware = ({ getState }: MiddlewareAPI) => (
  next: Dispatch
) => (action): void => {
  const prevState = getState();
  const returnValue = next(action);
  if (action.type === updateAuth.type) {
    const { username, password, isAuthenticated, remember } = action.payload;
    if (username && password) {
      updateApiConfig({
        username,
        password,
      });
    }
    if (prevState.auth.isAuthenticated !== isAuthenticated) {
      storageAuth.setUsername(username);
      storageAuth.setPassword(password);
      storageAuth.persistToStorage(remember);
    }
  }
  return returnValue;
};
