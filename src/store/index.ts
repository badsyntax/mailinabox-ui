import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from '@reduxjs/toolkit';
import { loginReducer } from '../features/loginSlice';
import { authReducer } from '../features/authSlice';
import { authMiddleware } from '../middleware/authMiddleware';
import { systemStatusReducer } from '../features/system/statusSlice';
import { systemRebootReducer } from '../features/system/rebootSlice';
import { systemPrivacyReducer } from '../features/system/privacySlice';
import { sslReducer } from '../features/ssl/sslSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    auth: authReducer,
    system: combineReducers({
      status: systemStatusReducer,
      reboot: systemRebootReducer,
      privacy: systemPrivacyReducer,
    }),
    ssl: sslReducer,
  },
  middleware: getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
