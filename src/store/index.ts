import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { authReducer } from '../features/authSlice';
import { dnsReducer } from '../features/dnsSlice';
import { loginReducer } from '../features/loginSlice';
import { sslReducer } from '../features/sslSlice';
import { systemBackupsReducer } from '../features/system/backupsSlice';
import { systemPrivacyReducer } from '../features/system/privacySlice';
import { systemRebootReducer } from '../features/system/rebootSlice';
import { systemStatusReducer } from '../features/system/statusSlice';
import { authMiddleware } from '../middleware/authMiddleware';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    auth: authReducer,
    system: combineReducers({
      status: systemStatusReducer,
      reboot: systemRebootReducer,
      privacy: systemPrivacyReducer,
      backups: systemBackupsReducer,
    }),
    dns: dnsReducer,
    ssl: sslReducer,
  },
  middleware: getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
