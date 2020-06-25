import {
  configureStore,
  MiddlewareAPI,
  Middleware,
  Dispatch,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { loginReducer } from '../features/loginSlice';
import { authReducer, authUpdate } from '../features/authSlice';
import { apiConfigParams } from '../api';

const authMiddleware: Middleware = ({ getState }: MiddlewareAPI) => (
  next: Dispatch
) => (action) => {
  const returnValue = next(action);
  if (action.type === authUpdate.type) {
    const { auth } = getState();
    const { username, password } = auth;
    if (username && password) {
      apiConfigParams.username = username;
      apiConfigParams.password = password;
    }
  }
  return returnValue;
};

export const store = configureStore({
  reducer: {
    login: loginReducer,
    auth: authReducer,
  },
  middleware: getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
