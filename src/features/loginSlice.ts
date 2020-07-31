import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import { MeAuthStatus } from 'mailinabox-api';
import { getRequestFailMessage, userApi } from '../api';
import { RootState } from '../store';
import { updateAuth } from './authSlice';

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
    loginStart: (state): void => {
      state.isLoggingIn = true;
    },
    loginSuccess: (state): void => {
      state.isLoggingIn = false;
    },
    loginError: (state, action): void => {
      state.loginError = action.payload;
      state.isLoggingIn = false;
    },
    loginResetError: (state): void => {
      state.loginError = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginError,
  loginResetError,
} = loginSlice.actions;

export const loginCheck = (
  remember: boolean
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(loginStart());
  try {
    const result = await userApi.getMe();
    if (result.status !== MeAuthStatus.Ok) {
      dispatch(loginError(result.reason));
    } else if (!result.apiKey) {
      dispatch(loginError('You are not an administrator on this system.'));
    } else {
      dispatch(loginSuccess());
      setTimeout(() => {
        dispatch(
          updateAuth({
            username: result.email,
            password: result.apiKey,
            isAuthenticated: true,
            remember,
          })
        );
      });
    }
  } catch (err) {
    dispatch(loginError(await getRequestFailMessage(err)));
  }
};

export const selectIsLoggingIn = (state: RootState): boolean =>
  state.login.isLoggingIn;
export const selectLoginError = (state: RootState): string | null =>
  state.login.loginError;

export const { reducer: loginReducer } = loginSlice;
