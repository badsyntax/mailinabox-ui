import { IGroup } from '@fluentui/react';
import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import { WebDomain } from 'mailinabox-api';
import psl from 'psl';
import { getRequestFailMessage, webApi } from '../api';
import { RootState } from '../store';

export interface SSLState {
  isGettingDomains: boolean;
  domains: Array<WebDomain>;
  getDomainsError: string | null;
}

const initialState: SSLState = {
  isGettingDomains: false,
  domains: [],
  getDomainsError: null,
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
  },
});

export const { reducer: webReducer } = web;

export const {
  getDomainsStart,
  getDomainsSuccess,
  getDomainsError,
} = web.actions;

export const selectIsGettingDomains = (state: RootState): boolean =>
  state.web.isGettingDomains;

export const selectDomains = (state: RootState): Array<WebDomain> =>
  state.web.domains;

export type WebDomainWithDomainInfo = WebDomain & {
  domainWithoutSubDomain: string;
  subDomain: string;
};

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
        domain: `https://${webDomain.domain}`,
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
    const result = await webApi.getDomains();
    dispatch(getDomainsSuccess(result));
  } catch (err) {
    dispatch(getDomainsError(await getRequestFailMessage(err as Response)));
  }
};
