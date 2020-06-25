import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AuthState {
  username: string | null;
  password: string | null;
  isAuthenticated: boolean;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: null,
    password: null,
    isAuthenticated: false,
  } as AuthState,
  reducers: {
    authUpdate: (state, action) => {
      const { username, password, isAuthenticated } = action.payload;
      state.username = username;
      state.password = password;
      state.isAuthenticated = !!isAuthenticated;
    },
  },
});

export const { authUpdate } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;

export const { reducer: authReducer } = authSlice;
