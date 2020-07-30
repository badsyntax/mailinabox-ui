import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import {
  SSLCertificateInstallRequest,
  SSLStatus,
  SSLStatusResponse,
} from 'mailinabox-api';
import { getRequestFailMessage, sslApi } from '../api';
import { RootState } from '../store';

export enum SSLActionType {
  install,
}

export interface SSLAction {
  sslStatus?: SSLStatus;
  type?: SSLActionType;
}

export interface SSLState {
  isGettingCertificates: boolean;
  isGeneratingCSR: boolean;
  isInstallingCertificate: boolean;
  sslStatus: SSLStatusResponse;
  getStatusError: string | null;
  generateCSRResponse: string | null;
  generateCSRError: string | null;
  installCertificateResponse: string | null;
  installCertificateError: string | null;
  sslAction: SSLAction | null;
}

const initialState: SSLState = {
  isGettingCertificates: false,
  isGeneratingCSR: false,
  isInstallingCertificate: false,
  sslStatus: {
    canProvision: [],
    status: [],
  },
  generateCSRResponse: null,
  installCertificateResponse: null,
  getStatusError: null,
  generateCSRError: null,
  installCertificateError: null,
  sslAction: null,
};

export const ssl = createSlice({
  name: 'ssl',
  initialState,
  reducers: {
    getSSLStatusStart: (state): void => {
      state.getStatusError = null;
      state.isGettingCertificates = true;
    },
    getSSLStatusSuccess: (state, action): void => {
      state.isGettingCertificates = false;
      state.sslStatus = action.payload;
    },
    getSSLStatusError: (state, action): void => {
      state.getStatusError = action.payload;
      state.isGettingCertificates = false;
    },
    generateCSRStart: (state): void => {
      state.generateCSRError = null;
      state.isGeneratingCSR = true;
    },
    generateCSRSuccess: (state, action): void => {
      state.isGeneratingCSR = false;
      state.generateCSRResponse = action.payload;
    },
    generateCSRError: (state, action): void => {
      state.generateCSRError = action.payload;
      state.isGeneratingCSR = false;
    },
    generateCSRReset: (state): void => {
      state.generateCSRError = null;
      state.generateCSRResponse = null;
      state.isGeneratingCSR = false;
    },
    installCertificateStart: (state): void => {
      state.installCertificateError = null;
      state.isInstallingCertificate = true;
    },
    installCertificateSuccess: (state, action): void => {
      state.isInstallingCertificate = false;
      state.installCertificateResponse = action.payload;
    },
    installCertificateError: (state, action): void => {
      state.installCertificateError = action.payload;
      state.isInstallingCertificate = false;
    },
    installCertificateReset: (state): void => {
      state.installCertificateError = null;
      state.installCertificateResponse = null;
      state.isInstallingCertificate = false;
    },
    resetSSLAction: (state): void => {
      state.sslAction = null;
    },
    setSSLAction: (state, action): void => {
      state.sslAction = action.payload;
    },
  },
});

export const {
  getSSLStatusSuccess,
  getSSLStatusStart,
  getSSLStatusError,
  generateCSRStart,
  generateCSRSuccess,
  generateCSRError,
  generateCSRReset,
  installCertificateStart,
  installCertificateSuccess,
  installCertificateError,
  installCertificateReset,
  resetSSLAction,
  setSSLAction,
} = ssl.actions;

export const { reducer: sslReducer } = ssl;

export const selectIsCheckingSSLStatus = (state: RootState): boolean =>
  state.ssl.isGettingCertificates;

export const selectSSLStatusError = (state: RootState): string | null =>
  state.ssl.getStatusError;

export const selectSSLStatus = (state: RootState): SSLStatusResponse =>
  state.ssl.sslStatus;

export const selectIsGeneratingCSR = (state: RootState): boolean =>
  state.ssl.isGeneratingCSR;

export const selectCSRError = (state: RootState): string | null =>
  state.ssl.generateCSRError;

export const selectGeneratedCSRResponse = (state: RootState): string | null =>
  state.ssl.generateCSRResponse;

export const selectIsInstallingCertificate = (state: RootState): boolean =>
  state.ssl.isInstallingCertificate;

export const selectInstallCertificateError = (
  state: RootState
): string | null => state.ssl.installCertificateError;

export const selectInstallCertificateResponse = (
  state: RootState
): string | null => state.ssl.installCertificateResponse;

export const selectSSLAction = (state: RootState): SSLAction | null =>
  state.ssl.sslAction;

export const sslStatusCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(getSSLStatusStart());
  try {
    const result = await sslApi.getSSLStatus();
    dispatch(getSSLStatusSuccess(result));
  } catch (err) {
    dispatch(getSSLStatusError(await getRequestFailMessage(err as Response)));
  }
};

export const generateCSR = (
  domain: string,
  countrycode: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(generateCSRStart());
  try {
    const result = await sslApi.generateSSLCSR({
      domain,
      countrycode,
    });
    dispatch(generateCSRSuccess(result));
  } catch (err) {
    dispatch(generateCSRError(await getRequestFailMessage(err as Response)));
  }
};

export const installCertificate = (
  request: SSLCertificateInstallRequest
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(installCertificateStart());
  try {
    const result = await sslApi.installSSLCertificate(request);
    dispatch(installCertificateSuccess(result));
  } catch (err) {
    dispatch(
      installCertificateError(await getRequestFailMessage(err as Response))
    );
  }
};
