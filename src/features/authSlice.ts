import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  username: string | null;
  password: string | null;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: null,
    password: null,
  } as AuthState,
  reducers: {
    authUpdate: (state, action) => {
      const { username, password } = action.payload;
      state.username = username;
      state.password = password;
    },
  },
});

export const { authUpdate } = authSlice.actions;

export const { reducer: authReducer } = authSlice;
