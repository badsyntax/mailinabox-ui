import { createSlice } from '@reduxjs/toolkit';
import { storageAuth } from '../auth';

export interface AuthState {
  username: string;
  password: string;
  isAuthenticated: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: storageAuth.getUsername(),
    password: storageAuth.getPassword(),
    isAuthenticated: storageAuth.getIsAuthenticated(),
  } as AuthState,
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

// export const selectIsAuthenticated = (state: RootState): boolean =>
//   state.auth.isAuthenticated;

// export const selectUsername = (state: RootState): string => state.auth.username;

export const { reducer: authReducer } = authSlice;
