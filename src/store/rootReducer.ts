import { combineReducers } from '@reduxjs/toolkit';
import { aliasesReducer } from '../features/aliasesSlice';
import { authReducer } from '../features/authSlice';
import { dnsReducer } from '../features/dnsSlice';
import { sslReducer } from '../features/sslSlice';
import { systemBackupsReducer } from '../features/system/backupsSlice';
import { systemPrivacyReducer } from '../features/system/privacySlice';
import { systemRebootReducer } from '../features/system/rebootSlice';
import { systemStatusReducer } from '../features/system/statusSlice';
import { usersReducer } from '../features/usersSlice';
import { webReducer } from '../features/webSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  system: combineReducers({
    status: systemStatusReducer,
    reboot: systemRebootReducer,
    privacy: systemPrivacyReducer,
    backups: systemBackupsReducer,
  }),
  dns: dnsReducer,
  ssl: sslReducer,
  users: usersReducer,
  aliases: aliasesReducer,
  web: webReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
