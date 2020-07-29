import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import {
  MailAlias,
  MailAliasesResponse,
  MailAliasesResponseFormat,
  UpsertAliasRequest,
} from 'mailinabox-api';
import { aliasesApi, getRequestFailMessage } from '../api';
import { RootState } from '../store';

export enum AliasAction {
  remove,
  update,
}

export interface AliasUpdate {
  alias?: MailAlias;
  action?: AliasAction;
}

export interface AliasesState {
  isGettingAliases: boolean;
  aliases: MailAliasesResponse;
  getAliasesError: string | null;
  isUpsertingAlias: boolean;
  isRemovingAlias: boolean;
  upsertAliasError: string | null;
  upsertAliasResponse: string | null;
  removeAliasError: string | null;
  removeAliasResponse: string | null;
  aliasUpdate: AliasUpdate | null;
}

const initialState: AliasesState = {
  isGettingAliases: false,
  aliases: [],
  getAliasesError: null,
  isUpsertingAlias: false,
  isRemovingAlias: false,
  upsertAliasError: null,
  upsertAliasResponse: null,
  removeAliasError: null,
  removeAliasResponse: null,
  aliasUpdate: null,
};

export const aliases = createSlice({
  name: 'aliases',
  initialState,
  reducers: {
    aliasesGetStart: (state): void => {
      state.getAliasesError = null;
      state.isGettingAliases = true;
    },
    aliasesGetSuccess: (state, action): void => {
      state.isGettingAliases = false;
      state.aliases = action.payload;
    },
    aliasesGetError: (state, action): void => {
      state.getAliasesError = action.payload;
      state.isGettingAliases = false;
    },
    aliasUpsertStart: (state): void => {
      state.isUpsertingAlias = true;
      state.upsertAliasError = null;
    },
    aliasUpsertSuccess: (state, action): void => {
      state.isUpsertingAlias = false;
      state.upsertAliasResponse = action.payload;
    },
    aliasUpsertError: (state, action): void => {
      state.upsertAliasError = action.payload;
      state.isUpsertingAlias = false;
    },
    aliasUpsertReset: (state): void => {
      state.isUpsertingAlias = false;
      state.upsertAliasError = null;
      state.upsertAliasResponse = null;
    },
    aliasUpsertResetError: (state): void => {
      state.upsertAliasError = null;
    },
    aliasResetUpdateAction: (state): void => {
      state.aliasUpdate = {
        action: undefined,
        alias: state.aliasUpdate?.alias,
      };
    },
    aliasUpdate: (state, action): void => {
      state.aliasUpdate = action.payload;
    },
    aliasRemoveStart: (state): void => {
      state.isRemovingAlias = true;
      state.removeAliasError = null;
    },
    aliasRemoveSuccess: (state, action): void => {
      state.isRemovingAlias = false;
      state.removeAliasResponse = action.payload;
    },
    aliasRemoveError: (state, action): void => {
      state.removeAliasError = action.payload;
      state.isRemovingAlias = false;
    },
    aliasRemoveReset: (state): void => {
      state.removeAliasError = null;
      state.isRemovingAlias = false;
      state.removeAliasResponse = null;
    },
  },
});

export const {
  aliasesGetSuccess,
  aliasesGetStart,
  aliasesGetError,
  aliasUpsertStart,
  aliasUpsertSuccess,
  aliasUpsertError,
  aliasUpsertReset,
  aliasUpsertResetError,
  aliasResetUpdateAction,
  aliasUpdate,
  aliasRemoveStart,
  aliasRemoveSuccess,
  aliasRemoveError,
  aliasRemoveReset,
} = aliases.actions;

export const { reducer: aliasesReducer } = aliases;

export const selectIsGettingAliases = (state: RootState): boolean =>
  state.aliases.isGettingAliases;

export const selectAliasesError = (state: RootState): string | null =>
  state.aliases.getAliasesError;

export const selectAliases = (state: RootState): MailAliasesResponse =>
  state.aliases.aliases;

export const selectIsUpsertingAlias = (state: RootState): boolean =>
  state.aliases.isUpsertingAlias;

export const selectUpsertAliasResponse = (state: RootState): string | null =>
  state.aliases.upsertAliasResponse;

export const selectUpsertAliasError = (state: RootState): string | null =>
  state.aliases.upsertAliasError;

export const selectIsRemovingAlias = (state: RootState): boolean =>
  state.aliases.isRemovingAlias;

export const selectAliasUpdate = (state: RootState): AliasUpdate | null =>
  state.aliases.aliasUpdate;

export const selectRemoveAliasError = (state: RootState): string | null =>
  state.aliases.removeAliasError;

export const selectRemoveAliasResponse = (state: RootState): string | null =>
  state.aliases.removeAliasResponse;

export const aliasesCheck = (
  showProgress = true
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  if (showProgress) {
    dispatch(aliasesGetStart());
  }
  try {
    const result = await aliasesApi.getAliases({
      format: MailAliasesResponseFormat.Json,
    });
    dispatch(aliasesGetSuccess(result));
  } catch (err) {
    dispatch(aliasesGetError(await getRequestFailMessage(err as Response)));
  }
};

export const aliasUpsert = (
  alias: UpsertAliasRequest
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(aliasUpsertStart());
  try {
    const result = await aliasesApi.upsertAlias(alias);
    dispatch(aliasUpsertSuccess(result));
  } catch (err) {
    dispatch(aliasUpsertError(await getRequestFailMessage(err as Response)));
  }
};

export const aliasRemove = (
  address: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(aliasRemoveStart());
  try {
    const result = await aliasesApi.removeAlias({
      address,
    });
    dispatch(aliasRemoveSuccess(result));
  } catch (err) {
    dispatch(aliasRemoveError(await getRequestFailMessage(err as Response)));
  }
};
