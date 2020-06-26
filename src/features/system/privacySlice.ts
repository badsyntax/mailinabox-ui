import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { systemApi, getRequestFailMessage } from '../../api';
import { UpdatePrivacyValueEnum } from 'mailinabox-api';

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

export const systemPrivacy = createSlice({
  name: 'privacy',
  initialState,
  reducers: {
    systemPrivacyGetStart: (state) => {
      state.error = null;
      state.isChecking = true;
    },
    systemPrivacyGetSuccess: (state, action) => {
      state.isChecking = false;
      state.status = action.payload;
    },
    systemPrivacyUpdateStart: (state) => {
      state.error = null;
      state.isUpdating = true;
    },
    systemPrivacyUpdateSuccess: (state, action) => {
      state.isUpdating = false;
      const { result, privacy } = action.payload;
      if (result === 'OK') {
        state.status = privacy;
      }
    },
    systemPrivacyError: (state, action) => {
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
> => async (dispatch) => {
  dispatch(systemPrivacyGetStart());
  try {
    const result = await systemApi.getPrivacy();
    dispatch(systemPrivacyGetSuccess(result));
  } catch (err) {
    dispatch(systemPrivacyError(getRequestFailMessage(err as Response)));
  }
};

export const systemPrivacyUpdate = (
  privacy: boolean
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
) => {
  dispatch(systemPrivacyUpdateStart());
  try {
    const result = await systemApi.updatePrivacy({
      value: privacy
        ? UpdatePrivacyValueEnum.Private
        : UpdatePrivacyValueEnum.Off,
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
