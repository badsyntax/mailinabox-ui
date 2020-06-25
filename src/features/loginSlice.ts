/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loginError: null,
    isLoggedIn: false,
    isLoggingIn: false,
  },
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
    // loginState: (state, action) => {
    //   state.isLoggingIn = false;
    //   state.isLoggedIn = action.payload;
    // },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginError,
  resetLoginError,
} = loginSlice.actions;

export const performLogin = () => (dispatch: any) => {
  dispatch(loginStart());
  setTimeout(() => {
    dispatch(loginError('Invalida credentials'));
  }, 1000);
};

export const selectIsLoggedIn = (state: any) => state.login.isLoggedIn;
export const selectIsLoggingIn = (state: any) => state.login.isLoggingIn;
export const selectLoginError = (state: any) => state.login.loginError;

export const { reducer: loginReducer } = loginSlice;
