import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { storageAuth } from '../auth';

export interface AuthState {
  username: string;
  password: string;
  isAuthenticated: boolean;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: storageAuth.getUsername(),
    password: storageAuth.getPassword(),
    isAuthenticated: storageAuth.getIsAuthenticated(),
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
