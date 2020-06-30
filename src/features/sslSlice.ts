import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import { SSLStatusResponse } from 'mailinabox-api';
import { getRequestFailMessage, sslApi } from '../api';
import { RootState } from '../store';

export interface SSLState {
  isCheckingStatus: boolean;
  isGeneratingCSR: boolean;
  sslStatus: SSLStatusResponse;
  generatedCSR: string | null;
  getStatusError: string | null;
  generateCSRError: string | null;
}

const initialState: SSLState = {
  isCheckingStatus: false,
  isGeneratingCSR: false,
  sslStatus: {
    canProvision: [],
    status: [],
  },
  generatedCSR: null,
  getStatusError: null,
  generateCSRError: null,
};

export const ssl = createSlice({
  name: 'ssl',
  initialState,
  reducers: {
    sslGetStatusStart: (state): void => {
      state.getStatusError = null;
      state.isCheckingStatus = true;
    },
    sslGetStatusSuccess: (state, action): void => {
      state.isCheckingStatus = false;
      state.sslStatus = action.payload;
    },
    sslGetStatusError: (state, action): void => {
      state.getStatusError = action.payload;
      state.isCheckingStatus = false;
    },
    sslGenerateCSRStart: (state): void => {
      state.generateCSRError = null;
      state.isGeneratingCSR = true;
    },
    sslGenerateCSRSuccess: (state, action): void => {
      state.isGeneratingCSR = false;
      state.generatedCSR = action.payload;
    },
    sslGenerateCSRError: (state, action): void => {
      state.generateCSRError = action.payload;
      state.isGeneratingCSR = false;
    },
    sslGenerateCSRReset: (state): void => {
      state.generateCSRError = null;
      state.generatedCSR = null;
    },
  },
});

export const {
  sslGetStatusSuccess,
  sslGetStatusStart,
  sslGetStatusError,
  sslGenerateCSRStart,
  sslGenerateCSRSuccess,
  sslGenerateCSRError,
  sslGenerateCSRReset,
} = ssl.actions;

export const sslStatusCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(sslGetStatusStart());
  try {
    const result = await sslApi.getSSLStatus();
    dispatch(sslGetStatusSuccess(result));
  } catch (err) {
    dispatch(sslGetStatusError(getRequestFailMessage(err as Response)));
  }
};

export const sslGenerateCSR = (
  domain: string,
  countrycode: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(sslGenerateCSRStart());
  try {
    const result = await sslApi.generateCSR({
      domain,
      countrycode,
    });
    dispatch(sslGenerateCSRSuccess(result));
  } catch (err) {
    dispatch(sslGenerateCSRError(getRequestFailMessage(err as Response)));
  }
};

export const { reducer: sslReducer } = ssl;

export const selectIsCheckingSSLStatus = (state: RootState): boolean =>
  state.ssl.isCheckingStatus;

export const selectSSLStatusError = (state: RootState): string | null =>
  state.ssl.getStatusError;

export const selectSSLStatus = (state: RootState): SSLStatusResponse =>
  state.ssl.sslStatus;

export const selectIsGeneratingCSR = (state: RootState): boolean =>
  state.ssl.isGeneratingCSR;

export const selectCSRError = (state: RootState): string | null =>
  state.ssl.generateCSRError;

export const selectGeneratedCSR = (state: RootState): string | null =>
  state.ssl.generatedCSR;
