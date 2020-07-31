import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import { getRequestFailMessage, systemApi } from '../../api';
import { RootState } from '../../store';

export interface SystemRebootState {
  isGettingRebootStatus: boolean;
  status: boolean;
  getRebootStatusError: string | null;
}

const initialState: SystemRebootState = {
  isGettingRebootStatus: false,
  status: false,
  getRebootStatusError: null,
};

const systemReboot = createSlice({
  name: 'reboot',
  initialState,
  reducers: {
    getRebootStatusStart: (state): void => {
      state.getRebootStatusError = null;
      state.isGettingRebootStatus = true;
    },
    getRebootStatusSuccess: (state, action): void => {
      state.isGettingRebootStatus = false;
      state.status = action.payload;
    },
    getRebootStatusError: (state, action): void => {
      state.getRebootStatusError = action.payload;
      state.isGettingRebootStatus = false;
    },
  },
});

export const {
  getRebootStatusSuccess,
  getRebootStatusStart,
  getRebootStatusError,
} = systemReboot.actions;

export const { reducer: systemRebootReducer } = systemReboot;

export const systemRebootCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(getRebootStatusStart());
  try {
    const result = await systemApi.getSystemRebootStatus();
    dispatch(getRebootStatusSuccess(result));
  } catch (err) {
    dispatch(getRebootStatusError(await getRequestFailMessage(err)));
  }
};
