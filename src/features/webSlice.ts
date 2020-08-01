import { IGroup } from '@fluentui/react';
import {
  Action,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import { WebDomain } from 'mailinabox-api';
import psl from 'psl';
import { getRequestFailMessage, webApi } from '../api';
import { RootState } from '../store';

export type WebDomainWithDomainInfo = WebDomain & {
  domainWithoutSubDomain: string;
  subDomain: string;
};

export enum WebDomainActionType {
  update,
}

export interface WebDomainAction {
  webDomain?: WebDomainWithDomainInfo;
  action?: WebDomainActionType;
}

export interface WebState {
  isGettingDomains: boolean;
  domains: Array<WebDomain>;
  getDomainsError: string | null;
  domainAction: WebDomainAction | null;
  isUpdatingWeb: boolean;
  updateWebError: string | null;
  updateWebResponse: string | null;
}

const initialState: WebState = {
  isGettingDomains: false,
  domains: [],
  getDomainsError: null,
  domainAction: null,
  isUpdatingWeb: false,
  updateWebError: null,
  updateWebResponse: null,
};

export const web = createSlice({
  name: 'web',
  initialState,
  reducers: {
    getDomainsStart: (state): void => {
      state.getDomainsError = null;
      state.isGettingDomains = true;
    },
    getDomainsSuccess: (state, action): void => {
      state.isGettingDomains = false;
      state.domains = action.payload;
    },
    getDomainsError: (state, action): void => {
      state.isGettingDomains = false;
      state.getDomainsError = action.payload;
    },
    updateWebStart: (state): void => {
      state.updateWebError = null;
      state.isUpdatingWeb = true;
    },
    updateWebSuccess: (state, action): void => {
      state.isUpdatingWeb = false;
      state.updateWebResponse = action.payload;
    },
    updateWebError: (state, action): void => {
      state.isUpdatingWeb = false;
      state.updateWebError = action.payload;
    },
    updateWebReset: (state): void => {
      state.isUpdatingWeb = false;
      state.updateWebError = null;
      state.updateWebResponse = null;
    },
    resetDomainAction: (state): void => {
      state.domainAction = {
        ...state.domainAction,
        action: undefined,
      };
    },
    setDomainAction: (state, action: PayloadAction<WebDomainAction>): void => {
      state.domainAction = action.payload;
    },
  },
});

export const { reducer: webReducer } = web;

export const {
  getDomainsStart,
  getDomainsSuccess,
  getDomainsError,
  resetDomainAction,
  setDomainAction,
  updateWebStart,
  updateWebSuccess,
  updateWebError,
  updateWebReset,
} = web.actions;

function sortByFqdn(
  a: WebDomainWithDomainInfo,
  b: WebDomainWithDomainInfo
): number {
  if (a.domainWithoutSubDomain === b.domainWithoutSubDomain) {
    return a.subDomain.localeCompare(b.subDomain);
  }
  return a.domainWithoutSubDomain.localeCompare(b.domainWithoutSubDomain);
}

export const selectOrderedAndGroupedStaticEnabledDomains = (
  state: RootState
): [Array<WebDomainWithDomainInfo>, Array<IGroup>] => {
  const domains = state.web.domains
    .filter((webDomain) => webDomain.staticEnabled)
    .map((webDomain) => {
      const parsed = psl.parse(webDomain.domain);
      return {
        ...webDomain,
        domainWithoutSubDomain: (!parsed.error && parsed.domain) || '',
        subDomain: (!parsed.error && parsed.subdomain) || '',
      };
    })
    .sort(sortByFqdn);

  let groups: Array<IGroup> = [];

  domains.forEach((webDomain: WebDomainWithDomainInfo, index) => {
    const { domainWithoutSubDomain } = webDomain;
    if (groups[groups.length - 1]?.name !== domainWithoutSubDomain) {
      groups.push({
        key: 'group' + groups.length,
        name: domainWithoutSubDomain,
        startIndex: index,
        level: 0,
        count: 0,
        isCollapsed: true,
      });
    }
  });

  groups = groups.map((group, index) => {
    return {
      ...group,
      count:
        (groups[index + 1]?.startIndex || domains.length) - group.startIndex,
    };
  });

  return [domains, groups];
};

export const selectGetDomainsError = (state: RootState): string | null =>
  state.web.getDomainsError;

export const getDomains = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(getDomainsStart());
  try {
    const result = await webApi.getWebDomains();
    dispatch(getDomainsSuccess(result));
  } catch (err) {
    dispatch(getDomainsError(await getRequestFailMessage(err)));
  }
};

export const updateWeb = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(updateWebStart());
  try {
    const result = await webApi.updateWeb();
    dispatch(updateWebSuccess(result || 'Nothing changed.'));
  } catch (err) {
    dispatch(updateWebError(await getRequestFailMessage(err)));
  }
};
