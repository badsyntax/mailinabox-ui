import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { systemApi, getRequestFailMessage } from '../../api';

export interface SystemRebootState {
  isChecking: boolean;
  status: boolean;
  error: string | null;
}

const systemReboot = createSlice({
  name: 'reboot',
  initialState: {
    isChecking: false,
    status: false,
    error: null,
  } as SystemRebootState,
  reducers: {
    systemRebootStart: (state) => {
      state.error = null;
      state.isChecking = true;
    },
    systemRebootSuccess: (state, action) => {
      state.isChecking = false;
      state.status = action.payload;
    },
    systemRebootError: (state, action) => {
      state.error = action.payload;
      state.isChecking = false;
    },
  },
});

export const {
  systemRebootSuccess,
  systemRebootStart,
  systemRebootError,
} = systemReboot.actions;

export const systemRebootCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch) => {
  dispatch(systemRebootStart());
  try {
    const result = await systemApi.getSystemRebootStatus();
    dispatch(systemRebootSuccess(result));
  } catch (err) {
    dispatch(systemRebootError(getRequestFailMessage(err as Response)));
  }
};

export const { reducer: systemRebootReducer } = systemReboot;

export const selectIsCheckingReboot = (state: RootState): boolean =>
  state.system.reboot.isChecking;

export const selectRebootError = (state: RootState): string | null =>
  state.system.reboot.error;

export const selectReboot = (state: RootState): boolean =>
  state.system.reboot.status;
