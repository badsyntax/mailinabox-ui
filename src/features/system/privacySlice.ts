import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import { SystemPrivacyStatus } from 'mailinabox-api';
import { handleRequestError, systemApi } from '../../api';
import { AppThunk, RootState } from '../../store';

export interface SystemPrivacyState {
  isGettingPrivacy: boolean;
  isUpdatingPrivacy: boolean;
  status: boolean;
  getPrivacyError: string | null;
  updatePrivacyError: string | null;
}

const initialState: SystemPrivacyState = {
  isGettingPrivacy: false,
  isUpdatingPrivacy: false,
  status: false,
  getPrivacyError: null,
  updatePrivacyError: null,
};

const systemPrivacy = createSlice({
  name: 'privacy',
  initialState,
  reducers: {
    getPrivacyStart: (state): void => {
      state.getPrivacyError = null;
      state.isGettingPrivacy = true;
    },
    getPrivacySuccess: (state, action): void => {
      state.isGettingPrivacy = false;
      state.status = action.payload;
    },
    getPrivacyError: (state, action): void => {
      state.isGettingPrivacy = false;
      state.getPrivacyError = action.payload;
    },
    updatePrivacyStart: (state): void => {
      state.getPrivacyError = null;
      state.isUpdatingPrivacy = true;
    },
    updatePrivacySuccess: (state, action): void => {
      state.isUpdatingPrivacy = false;
      const { result, privacy } = action.payload;
      if (result === 'OK') {
        state.status = privacy;
      }
    },
    updatePrivacyError: (state, action): void => {
      state.isUpdatingPrivacy = false;
      state.updatePrivacyError = action.payload;
    },
  },
});

export const {
  getPrivacySuccess,
  getPrivacyStart,
  getPrivacyError,
  updatePrivacyStart,
  updatePrivacySuccess,
  updatePrivacyError,
} = systemPrivacy.actions;

export const { reducer: systemPrivacyReducer } = systemPrivacy;

export const systemPrivacyCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(getPrivacyStart());
  try {
    const result = await systemApi.getSystemPrivacyStatus();
    dispatch(getPrivacySuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, getPrivacyError);
  }
};

export const updatePrivacy = (privacy: boolean): AppThunk => async (
  dispatch
): Promise<void> => {
  dispatch(updatePrivacyStart());
  try {
    const result = await systemApi.updateSystemPrivacy({
      value: privacy ? SystemPrivacyStatus.Private : SystemPrivacyStatus.Off,
    });
    dispatch(
      updatePrivacySuccess({
        result,
        privacy,
      })
    );
  } catch (err) {
    await handleRequestError(err, dispatch, updatePrivacyError);
  }
};
