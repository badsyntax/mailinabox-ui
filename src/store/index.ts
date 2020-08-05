import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from '@reduxjs/toolkit';
import { authMiddleware } from '../middleware/auth';
import { rootReducer, RootState } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware().concat(authMiddleware),
});

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export type { RootState } from './rootReducer';
export type AppDispatch = typeof store.dispatch;
