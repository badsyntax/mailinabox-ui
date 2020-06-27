import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import { UpdateSystemPrivacyValueEnum } from 'mailinabox-api';
import { getRequestFailMessage, systemApi } from '../../api';
import { RootState } from '../../store';

export interface SystemPrivacyState {
  isChecking: boolean;
  isUpdating: boolean;
  status: boolean;
  error: string | null;
}

const initialState: SystemPrivacyState = {
  isChecking: false,
  isUpdating: false,
  status: false,
  error: null,
};

const systemPrivacy = createSlice({
  name: 'privacy',
  initialState,
  reducers: {
    systemPrivacyGetStart: (state): void => {
      state.error = null;
      state.isChecking = true;
    },
    systemPrivacyGetSuccess: (state, action): void => {
      state.isChecking = false;
      state.status = action.payload;
    },
    systemPrivacyUpdateStart: (state): void => {
      state.error = null;
      state.isUpdating = true;
    },
    systemPrivacyUpdateSuccess: (state, action): void => {
      state.isUpdating = false;
      const { result, privacy } = action.payload;
      if (result === 'OK') {
        state.status = privacy;
      }
    },
    systemPrivacyError: (state, action): void => {
      state.error = action.payload;
      state.isChecking = false;
    },
  },
});

export const {
  systemPrivacyGetSuccess,
  systemPrivacyGetStart,
  systemPrivacyError,
  systemPrivacyUpdateStart,
  systemPrivacyUpdateSuccess,
} = systemPrivacy.actions;

export const systemPrivacyCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(systemPrivacyGetStart());
  try {
    const result = await systemApi.getSystemPrivacyStatus();
    dispatch(systemPrivacyGetSuccess(result));
  } catch (err) {
    dispatch(systemPrivacyError(getRequestFailMessage(err as Response)));
  }
};

export const systemPrivacyUpdate = (
  privacy: boolean
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(systemPrivacyUpdateStart());
  try {
    const result = await systemApi.updateSystemPrivacy({
      value: privacy
        ? UpdateSystemPrivacyValueEnum.Private
        : UpdateSystemPrivacyValueEnum.Off,
    });
    dispatch(
      systemPrivacyUpdateSuccess({
        result,
        privacy,
      })
    );
  } catch (err) {
    dispatch(systemPrivacyError(getRequestFailMessage(err as Response)));
  }
};

export const { reducer: systemPrivacyReducer } = systemPrivacy;

export const selectIsCheckingPrivacy = (state: RootState): boolean =>
  state.system.privacy.isChecking;

export const selectIsUpdatingPrivacy = (state: RootState): boolean =>
  state.system.privacy.isUpdating;

export const selectPrivacyError = (state: RootState): string | null =>
  state.system.privacy.error;

export const selectPrivacy = (state: RootState): boolean =>
  state.system.privacy.status;
