import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import { SystemBackupStatusResponse } from 'mailinabox-api';
import { getRequestFailMessage, systemApi } from '../../api';
import { RootState } from '../../store';

export interface SystemBackupsState {
  isChecking: boolean;
  status: SystemBackupStatusResponse;
  error: string | null;
}

const initialState: SystemBackupsState = {
  isChecking: false,
  status: {
    backups: [],
    unmatchedFileSize: 0,
  },
  error: null,
};

const systemBackups = createSlice({
  name: 'backups',
  initialState,
  reducers: {
    systemBackupsStatusGetStart: (state): void => {
      state.error = null;
      state.isChecking = true;
    },
    systemBackupsStatusGetSuccess: (state, action): void => {
      state.isChecking = false;
      state.status = action.payload;
    },
    systemBackupsStatusError: (state, action): void => {
      state.error = action.payload;
      state.isChecking = false;
    },
  },
});

export const {
  systemBackupsStatusGetSuccess,
  systemBackupsStatusGetStart,
  systemBackupsStatusError,
} = systemBackups.actions;

export const systemBackupsStatusCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(systemBackupsStatusGetStart());
  try {
    const result = await systemApi.getSystemBackupStatus();
    dispatch(systemBackupsStatusGetSuccess(result));
  } catch (err) {
    dispatch(
      systemBackupsStatusError(await getRequestFailMessage(err as Response))
    );
  }
};

export const { reducer: systemBackupsReducer } = systemBackups;

export const selectIsCheckingBackupsStatus = (state: RootState): boolean =>
  state.system.backups.isChecking;

export const selectBackupsStatusError = (state: RootState): string | null =>
  state.system.backups.error;

export const selectBackupsStatus = (
  state: RootState
): SystemBackupStatusResponse => state.system.backups.status;
