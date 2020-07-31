import { IGroup } from '@fluentui/react';
import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import {
  MailAlias,
  MailAliasByDomain,
  MailAliasesResponse,
  MailAliasesResponseFormat,
  UpsertMailAliasRequest,
} from 'mailinabox-api';
import { aliasesApi, getRequestFailMessage } from '../api';
import { RootState } from '../store';

export enum AliasActionType {
  remove,
  update,
}

export interface AliasAction {
  alias?: MailAlias;
  type?: AliasActionType;
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
  aliasAction: AliasAction | null;
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
  aliasAction: null,
};

export const aliases = createSlice({
  name: 'aliases',
  initialState,
  reducers: {
    getAliasesStart: (state): void => {
      state.getAliasesError = null;
      state.isGettingAliases = true;
    },
    getAliasesSuccess: (state, action): void => {
      state.isGettingAliases = false;
      state.aliases = action.payload;
    },
    getAliasesError: (state, action): void => {
      state.getAliasesError = action.payload;
      state.isGettingAliases = false;
    },
    upsertAliasStart: (state): void => {
      state.isUpsertingAlias = true;
      state.upsertAliasError = null;
    },
    upsertAliasSuccess: (state, action): void => {
      state.isUpsertingAlias = false;
      state.upsertAliasResponse = action.payload;
    },
    upsertAliasError: (state, action): void => {
      state.upsertAliasError = action.payload;
      state.isUpsertingAlias = false;
    },
    upsertAliasReset: (state): void => {
      state.isUpsertingAlias = false;
      state.upsertAliasError = null;
      state.upsertAliasResponse = null;
    },
    upsertAliasResetError: (state): void => {
      state.upsertAliasError = null;
    },
    resetAliasAction: (state): void => {
      state.aliasAction = {
        ...state.aliasAction,
        type: undefined,
      };
    },
    setAliasAction: (state, action): void => {
      state.aliasAction = action.payload;
    },
    removeAliasStart: (state): void => {
      state.isRemovingAlias = true;
      state.removeAliasError = null;
    },
    removeAliasSuccess: (state, action): void => {
      state.isRemovingAlias = false;
      state.removeAliasResponse = action.payload;
    },
    removeAliasError: (state, action): void => {
      state.removeAliasError = action.payload;
      state.isRemovingAlias = false;
    },
    removeAliasReset: (state): void => {
      state.removeAliasError = null;
      state.isRemovingAlias = false;
      state.removeAliasResponse = null;
    },
  },
});

export const {
  getAliasesSuccess,
  getAliasesStart,
  getAliasesError,
  upsertAliasStart,
  upsertAliasSuccess,
  upsertAliasError,
  upsertAliasReset,
  upsertAliasResetError,
  resetAliasAction,
  setAliasAction,
  removeAliasStart,
  removeAliasSuccess,
  removeAliasError,
  removeAliasReset,
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

export const selectAliasAction = (state: RootState): AliasAction | null =>
  state.aliases.aliasAction;

export const selectRemoveAliasError = (state: RootState): string | null =>
  state.aliases.removeAliasError;

export const selectRemoveAliasResponse = (state: RootState): string | null =>
  state.aliases.removeAliasResponse;

export const selectAliasesWithGroups = (
  state: RootState
): [Array<MailAlias>, Array<IGroup>] => {
  const aliases: Array<MailAlias> = [];
  const groups: Array<IGroup> = [];
  state.aliases.aliases.forEach((aliasDomain: MailAliasByDomain) => {
    const { domain, aliases: aliasesByDomain } = aliasDomain;
    groups.push({
      key: 'group' + domain,
      name: domain,
      startIndex: aliases.length,
      level: 0,
      count: aliasesByDomain.length,
    });
    aliases.push(...aliasesByDomain);
  });
  return [aliases, groups];
};

export const getAliases = (
  showProgress = true
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  if (showProgress) {
    dispatch(getAliasesStart());
  }
  try {
    const result = await aliasesApi.getMailAliases({
      format: MailAliasesResponseFormat.Json,
    });
    dispatch(getAliasesSuccess(result));
  } catch (err) {
    dispatch(getAliasesError(await getRequestFailMessage(err)));
  }
};

export const upsertAlias = (
  alias: UpsertMailAliasRequest
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(upsertAliasStart());
  try {
    const result = await aliasesApi.upsertMailAlias(alias);
    dispatch(upsertAliasSuccess(result));
  } catch (err) {
    dispatch(upsertAliasError(await getRequestFailMessage(err)));
  }
};

export const removeAlias = (
  address: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(removeAliasStart());
  try {
    const result = await aliasesApi.removeMailAlias({
      address,
    });
    dispatch(removeAliasSuccess(result));
  } catch (err) {
    dispatch(removeAliasError(await getRequestFailMessage(err)));
  }
};
