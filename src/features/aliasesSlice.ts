import { IGroup } from '@fluentui/react';
import { createSlice } from '@reduxjs/toolkit';
import {
  MailAlias,
  MailAliasByDomain,
  MailAliasesResponseFormat,
  UpsertMailAliasRequest,
} from 'mailinabox-api';
import { handleRequestError, mailApi } from '../api';
import { AppThunk, RootState } from '../store';

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
  aliases: Array<MailAliasByDomain>;
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

export const getAliases =
  (showProgress = true): AppThunk =>
  async (dispatch): Promise<void> => {
    if (showProgress) {
      dispatch(getAliasesStart());
    }
    try {
      const result = await mailApi.getMailAliases({
        format: MailAliasesResponseFormat.Json,
      });
      dispatch(getAliasesSuccess(result));
    } catch (err) {
      await handleRequestError(err, dispatch, getAliasesError);
    }
  };

export const upsertAlias =
  (alias: UpsertMailAliasRequest): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(upsertAliasStart());
    try {
      const result = await mailApi.upsertMailAlias(alias);
      dispatch(upsertAliasSuccess(result));
    } catch (err) {
      await handleRequestError(err, dispatch, upsertAliasError);
    }
  };

export const removeAlias =
  (address: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(removeAliasStart());
    try {
      const result = await mailApi.removeMailAlias({
        address,
      });
      dispatch(removeAliasSuccess(result));
    } catch (err) {
      await handleRequestError(err, dispatch, removeAliasError);
    }
  };
