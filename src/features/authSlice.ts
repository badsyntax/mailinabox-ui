import { createSlice } from '@reduxjs/toolkit';
import { storageAuth } from '../auth';

export interface AuthState {
  username: string;
  password: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: storageAuth.getUsername(),
  password: storageAuth.getPassword(),
  isAuthenticated: storageAuth.getIsAuthenticated(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuth: (state, action): void => {
      const { username, password, isAuthenticated } = action.payload;
      state.username = username;
      state.password = password;
      state.isAuthenticated = !!isAuthenticated;
    },
  },
});

export const { updateAuth } = authSlice.actions;

export const { reducer: authReducer } = authSlice;
