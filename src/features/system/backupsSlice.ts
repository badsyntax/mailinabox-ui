import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import {
  SystemBackupConfigResponse,
  SystemBackupConfigUpdateRequest,
  SystemBackupStatusResponse,
} from 'mailinabox-api';
import { handleRequestError, systemApi } from '../../api';
import { AppThunk, RootState } from '../../store';

export interface SystemBackupsState {
  isGettingStatus: boolean;
  isGettingConfig: boolean;
  isUpdatingConfig: boolean;
  status: SystemBackupStatusResponse;
  config: SystemBackupConfigResponse;
  updateConfigResponse: string | null;
  getStatusError: string | null;
  getConfigError: string | null;
  updateConfigError: string | null;
}

const initialState: SystemBackupsState = {
  isGettingStatus: false,
  isGettingConfig: false,
  isUpdatingConfig: false,
  status: {
    backups: [],
    unmatchedFileSize: 0,
  },
  config: {
    encPwFile: '',
    fileTargetDirectory: '',
    minAgeInDays: 1,
    sshPubKey: '',
    target: '',
  },
  updateConfigResponse: null,
  getStatusError: null,
  getConfigError: null,
  updateConfigError: null,
};

const systemBackups = createSlice({
  name: 'backups',
  initialState,
  reducers: {
    getStatusStart: (state): void => {
      state.getStatusError = null;
      state.isGettingStatus = true;
    },
    getStatusSuccess: (state, action): void => {
      state.isGettingStatus = false;
      state.status = action.payload;
    },
    getStatusError: (state, action): void => {
      state.getStatusError = action.payload;
      state.isGettingStatus = false;
    },
    getConfigStart: (state): void => {
      state.getConfigError = null;
      state.isGettingConfig = true;
    },
    getConfigSuccess: (state, action): void => {
      state.isGettingConfig = false;
      state.config = action.payload;
    },
    getConfigError: (state, action): void => {
      state.getConfigError = action.payload;
      state.isGettingConfig = false;
    },
    updateConfigStart: (state): void => {
      state.updateConfigError = null;
      state.isUpdatingConfig = true;
    },
    updateConfigSuccess: (state, action): void => {
      state.isUpdatingConfig = false;
      state.updateConfigResponse = action.payload;
    },
    updateConfigError: (state, action): void => {
      state.updateConfigError = action.payload;
      state.isUpdatingConfig = false;
    },
    updateConfigResetError: (state): void => {
      state.updateConfigError = null;
    },
    updateConfigReset: (state): void => {
      state.updateConfigError = null;
      state.isUpdatingConfig = false;
      state.updateConfigResponse = null;
    },
  },
});

export const {
  getStatusSuccess,
  getStatusStart,
  getStatusError,
  getConfigStart,
  getConfigSuccess,
  getConfigError,
  updateConfigStart,
  updateConfigSuccess,
  updateConfigError,
  updateConfigResetError,
  updateConfigReset,
} = systemBackups.actions;

export const { reducer: systemBackupsReducer } = systemBackups;

export const getStatus = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(getStatusStart());
  try {
    const result = await systemApi.getSystemBackupStatus();
    dispatch(getStatusSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, getStatusError);
  }
};

export const getConfig = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(getConfigStart());
  try {
    const result = await systemApi.getSystemBackupConfig();
    dispatch(getConfigSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, getConfigError);
  }
};

export const updateConfig = (
  config: SystemBackupConfigUpdateRequest
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(updateConfigStart());
  try {
    const result = await systemApi.updateSystemBackupConfig(config);
    dispatch(updateConfigSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, updateConfigError);
  }
};
