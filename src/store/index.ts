import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { loginReducer } from '../features/loginSlice';
import { authReducer } from '../features/authSlice';
import { authMiddleware } from '../middleware/authMiddleware';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    auth: authReducer,
  },
  middleware: getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
