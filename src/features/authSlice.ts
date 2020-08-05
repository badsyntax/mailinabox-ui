import { createSlice } from '@reduxjs/toolkit';
import { storageAuth } from '../auth';

export interface AuthState {
  username: string;
  password: string;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: storageAuth.getUsername(),
  password: storageAuth.getPassword(),
  isAuthenticated: storageAuth.getIsAuthenticated(),
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuth: (state, action): void => {
      const {
        username,
        password,
        isAuthenticated,
        error = null,
      } = action.payload;
      state.username = username;
      state.password = password;
      state.isAuthenticated = !!isAuthenticated;
      state.error = error;
    },
  },
});

export const { updateAuth } = authSlice.actions;

export const { reducer: authReducer } = authSlice;
