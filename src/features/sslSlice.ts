import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import {
  SSLCertificateInstallRequest,
  SSLStatus,
  SSLStatusResponse,
} from 'mailinabox-api';
import { handleRequestError, sslApi } from '../api';
import { AppThunk, RootState } from '../store';

export enum SSLActionType {
  install,
}

export interface SSLAction {
  sslStatus?: SSLStatus;
  type?: SSLActionType;
}

export interface SSLState {
  isGettingStatus: boolean;
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
  isGettingStatus: false,
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
      state.isGettingStatus = true;
    },
    getSSLStatusSuccess: (state, action): void => {
      state.isGettingStatus = false;
      state.sslStatus = action.payload;
    },
    getSSLStatusError: (state, action): void => {
      state.getStatusError = action.payload;
      state.isGettingStatus = false;
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

export const getSSLStatus =
  (): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch): Promise<void> => {
    dispatch(getSSLStatusStart());
    try {
      const result = await sslApi.getSSLStatus();
      dispatch(getSSLStatusSuccess(result));
    } catch (err) {
      await handleRequestError(err, dispatch, getSSLStatusError);
    }
  };

export const generateCSR =
  (domain: string, countrycode: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(generateCSRStart());
    try {
      const result = await sslApi.generateSSLCSR({
        domain,
        countrycode,
      });
      dispatch(generateCSRSuccess(result));
    } catch (err) {
      await handleRequestError(err, dispatch, generateCSRError);
    }
  };

export const installCertificate =
  (request: SSLCertificateInstallRequest): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(installCertificateStart());
    try {
      const result = await sslApi.installSSLCertificate(request);
      dispatch(installCertificateSuccess(result));
    } catch (err) {
      await handleRequestError(err, dispatch, installCertificateError);
    }
  };
