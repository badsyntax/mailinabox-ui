import { createSlice, Action, ThunkAction } from '@reduxjs/toolkit';
import { MeResponseStatusEnum } from 'mailinabox-api';
import { userApi } from '../api';
import { RootState } from '../store';
import { authUpdate } from './authSlice';

export interface LoginState {
  loginError: string | null;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
}

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loginError: null,
    isLoggingIn: false,
  } as LoginState,
  reducers: {
    loginStart: (state) => {
      state.isLoggingIn = true;
    },
    loginError: (state, action) => {
      state.loginError = action.payload;
      state.isLoggingIn = false;
    },
    loginResetError: (state) => {
      state.loginError = null;
    },
  },
});

export const { loginStart, loginError, loginResetError } = loginSlice.actions;

export const loginCheck = (
  remember: boolean
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
) => {
  dispatch(loginStart());
  try {
    const result = await userApi.getMe();
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
          remember,
        })
      );
    }
  } catch (err) {
    const { statusText, status } = err as Response;
    dispatch(
      loginError(
        `Request error: ${statusText}${status ? ' (' + status + ')' : ''}`
      )
    );
  }
};

export const selectIsLoggingIn = (state: RootState): boolean =>
  state.login.isLoggingIn;
export const selectLoginError = (state: RootState): string | null =>
  state.login.loginError;

export const { reducer: loginReducer } = loginSlice;
