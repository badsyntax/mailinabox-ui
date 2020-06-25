import { Middleware, MiddlewareAPI, Dispatch } from '@reduxjs/toolkit';
import { authUpdate } from '../features/authSlice';
import { updateApiConfig } from '../api';
import { storageAuth } from '../auth';

export const authMiddleware: Middleware = ({ getState }: MiddlewareAPI) => (
  next: Dispatch
) => (action) => {
  const returnValue = next(action);
  if (action.type === authUpdate.type) {
    const { username, password, isAuthenticated, remember } = action.payload;
    if (username && password) {
      updateApiConfig({
        username,
        password,
      });
    }
    if (isAuthenticated) {
      storageAuth.setUsername(username);
      storageAuth.setPassword(password);
      storageAuth.persistToStorage(remember);
    }
  }
  return returnValue;
};
