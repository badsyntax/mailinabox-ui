import { createSlice, Action, ThunkAction } from '@reduxjs/toolkit';
import { userApi } from '../api';

import { MeResponseStatusEnum } from 'mailinabox-api';
import { authUpdate } from './authSlice';
import { RootState } from '../store';

export interface LoginState {
  loginError: string | null;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
}

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loginError: null,
    isLoggedIn: false,
    isLoggingIn: false,
  } as LoginState,
  reducers: {
    loginStart: (state) => {
      state.isLoggingIn = true;
    },
    loginSuccess: (state) => {
      state.loginError = null;
      state.isLoggingIn = false;
      state.isLoggedIn = true;
    },
    loginError: (state, action) => {
      state.loginError = action.payload;
      state.isLoggingIn = false;
      state.isLoggedIn = false;
    },
    resetLoginError: (state) => {
      state.loginError = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginError,
  resetLoginError,
} = loginSlice.actions;

export const performLogin = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch) => {
  dispatch(loginStart());
  try {
    const result = await userApi.me();
    if (result.status !== MeResponseStatusEnum.Ok) {
      dispatch(loginError(result.reason));
    } else if (!result.apiKey) {
      dispatch(loginError('You are not an administrator on this system.'));
    } else {
      dispatch(
        authUpdate({
          username: result.email,
          password: result.apiKey,
          isAuthenticated: true,
        })
      );
      dispatch(loginSuccess());
    }
  } catch (err) {
    dispatch(loginError(`Request error: ${err.message}`));
  }
};

export const selectIsLoggingIn = (state: RootState): boolean =>
  state.login.isLoggingIn;
export const selectLoginError = (state: RootState): string | null =>
  state.login.loginError;

export const { reducer: loginReducer } = loginSlice;
