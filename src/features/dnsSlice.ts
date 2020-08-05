import { IGroup } from '@fluentui/react';
import { createSlice } from '@reduxjs/toolkit';
import {
  AddDnsCustomRecordRequest,
  AddDnsSecondaryNameserverRequest,
  DNSCustomRecord,
  DNSDumpDomainRecord,
  DNSDumpDomains,
  DNSDumpResponse,
  DNSSecondaryNameserverResponse,
  RemoveDnsCustomRecordRequest,
} from 'mailinabox-api';
import psl from 'psl';
import { dnsApi, handleRequestError } from '../api';
import { AppThunk, RootState } from '../store';

export enum DNSActionType {
  remove,
}

export interface DNSAction {
  dnsRecord?: DNSCustomRecord;
  type?: DNSActionType;
}

export interface SSLState {
  isGettingSecondaryNameserver: boolean;
  isGettingZones: boolean;
  isGettingCustomRecords: boolean;
  isGettingDump: boolean;
  isAddingCustomRecord: boolean;
  isAddingSecondaryNameserver: boolean;
  isRemovingCustomRecord: boolean;
  secondaryNameserver: DNSSecondaryNameserverResponse;
  zones: Array<string>;
  customRecords: Array<DNSCustomRecord>;
  dump: DNSDumpResponse;
  addCustomRecordResponse: string | null;
  addSecondaryNameserverResponse: string | null;
  removeCustomRecordResponse: string | null;
  getSecondaryNameserverError: string | null;
  getZonesError: string | null;
  getCustomRecordsError: string | null;
  getDumpError: string | null;
  addCustomRecordError: string | null;
  addSecondaryNameserverError: string | null;
  removeCustomRecordError: string | null;
  dnsAction: DNSAction | null;
}

const initialState: SSLState = {
  isGettingSecondaryNameserver: false,
  isGettingZones: false,
  isGettingCustomRecords: false,
  isGettingDump: false,
  isAddingCustomRecord: false,
  isAddingSecondaryNameserver: false,
  isRemovingCustomRecord: false,
  secondaryNameserver: {
    hostnames: [],
  },
  dump: [],
  zones: [],
  customRecords: [],
  addCustomRecordResponse: null,
  addSecondaryNameserverResponse: null,
  removeCustomRecordResponse: null,
  getSecondaryNameserverError: null,
  getZonesError: null,
  getCustomRecordsError: null,
  getDumpError: null,
  addCustomRecordError: null,
  addSecondaryNameserverError: null,
  removeCustomRecordError: null,
  dnsAction: null,
};

export const dns = createSlice({
  name: 'dns',
  initialState,
  reducers: {
    getDumpStart: (state): void => {
      state.getDumpError = null;
      state.isGettingDump = true;
    },
    getDumpSuccess: (state, action): void => {
      state.isGettingDump = false;
      state.dump = action.payload;
    },
    getDumpError: (state, action): void => {
      state.isGettingDump = false;
      state.getDumpError = action.payload;
    },
    getSecondaryNameserverStart: (state): void => {
      state.getSecondaryNameserverError = null;
      state.isGettingSecondaryNameserver = true;
    },
    getSecondaryNameserverSuccess: (state, action): void => {
      state.isGettingSecondaryNameserver = false;
      state.secondaryNameserver = action.payload;
    },
    getSecondaryNameserverError: (state, action): void => {
      state.isGettingSecondaryNameserver = false;
      state.getSecondaryNameserverError = action.payload;
    },
    getZonesStart: (state): void => {
      state.getZonesError = null;
      state.isGettingZones = true;
    },
    getZonesSuccess: (state, action): void => {
      state.isGettingZones = false;
      state.zones = action.payload;
    },
    getZonesError: (state, action): void => {
      state.isGettingZones = false;
      state.getZonesError = action.payload;
    },
    getCustomRecordsStart: (state): void => {
      state.getCustomRecordsError = null;
      state.isGettingCustomRecords = true;
    },
    getCustomRecordsSuccess: (state, action): void => {
      state.isGettingCustomRecords = false;
      state.customRecords = action.payload;
    },
    getCustomRecordsError: (state, action): void => {
      state.isGettingCustomRecords = false;
      state.getCustomRecordsError = action.payload;
    },
    addCustomRecordStart: (state): void => {
      state.addCustomRecordError = null;
      state.isAddingCustomRecord = true;
    },
    addCustomRecordSuccess: (state, action): void => {
      state.isAddingCustomRecord = false;
      state.addCustomRecordResponse = action.payload;
    },
    addCustomRecordError: (state, action): void => {
      state.isAddingCustomRecord = false;
      state.addCustomRecordError = action.payload;
    },
    addCustomRecordResetError: (state): void => {
      state.addCustomRecordError = null;
    },
    addCustomRecordReset: (state): void => {
      state.isAddingCustomRecord = false;
      state.addCustomRecordError = null;
      state.addCustomRecordResponse = null;
    },
    removeCustomRecordStart: (state): void => {
      state.removeCustomRecordError = null;
      state.isRemovingCustomRecord = true;
    },
    removeCustomRecordSuccess: (state, action): void => {
      state.isRemovingCustomRecord = false;
      state.removeCustomRecordResponse = action.payload;
    },
    removeCustomRecordError: (state, action): void => {
      state.isRemovingCustomRecord = false;
      state.removeCustomRecordError = action.payload;
    },
    removeCustomRecordResetError: (state): void => {
      state.removeCustomRecordError = null;
    },
    removeCustomRecordReset: (state): void => {
      state.isRemovingCustomRecord = false;
      state.removeCustomRecordError = null;
      state.removeCustomRecordResponse = null;
    },
    addSecondaryNameserverStart: (state): void => {
      state.addSecondaryNameserverError = null;
      state.isAddingSecondaryNameserver = true;
    },
    addSecondaryNameserverSuccess: (state, action): void => {
      state.isAddingSecondaryNameserver = false;
      state.addSecondaryNameserverResponse = action.payload;
    },
    addSecondaryNameserverError: (state, action): void => {
      state.isAddingSecondaryNameserver = false;
      state.addSecondaryNameserverError = action.payload;
    },
    addSecondaryNameserverResetError: (state): void => {
      state.addSecondaryNameserverError = null;
    },
    addSecondaryNameserverReset: (state): void => {
      state.isAddingSecondaryNameserver = false;
      state.addSecondaryNameserverError = null;
      state.addSecondaryNameserverResponse = null;
    },
    resetDNSAction: (state): void => {
      state.dnsAction = {
        ...state.dnsAction,
        type: undefined,
      };
    },
    setDNSAction: (state, action): void => {
      state.dnsAction = action.payload;
    },
  },
});

export const {
  getSecondaryNameserverStart,
  getSecondaryNameserverSuccess,
  getSecondaryNameserverError,
  getZonesStart,
  getZonesSuccess,
  getZonesError,
  getCustomRecordsStart,
  getCustomRecordsSuccess,
  getCustomRecordsError,
  getDumpStart,
  getDumpSuccess,
  getDumpError,
  addCustomRecordStart,
  addCustomRecordSuccess,
  addCustomRecordError,
  addCustomRecordResetError,
  addCustomRecordReset,
  addSecondaryNameserverStart,
  addSecondaryNameserverSuccess,
  addSecondaryNameserverError,
  addSecondaryNameserverResetError,
  addSecondaryNameserverReset,
  removeCustomRecordStart,
  removeCustomRecordSuccess,
  removeCustomRecordError,
  removeCustomRecordResetError,
  removeCustomRecordReset,
  resetDNSAction,
  setDNSAction,
} = dns.actions;

export const { reducer: dnsReducer } = dns;

function sort(a: DNSCustomRecord, b: DNSCustomRecord): number {
  if (a.qname === b.qname) {
    if (a.rtype === b.rtype) {
      return a.value.localeCompare(b.value);
    }
    return a.rtype.localeCompare(b.rtype);
  }
  return a.qname.localeCompare(b.qname);
}

function reverseFqdn(record: DNSCustomRecord): DNSCustomRecord {
  return {
    ...record,
    qname: record.qname.split('.').reverse().join('.'),
  };
}

export const selectCustomRecordsSorted = (
  state: RootState
): Array<DNSCustomRecord> => {
  return state.dns.customRecords
    .slice()
    .map(reverseFqdn)
    .sort(sort)
    .map(reverseFqdn);
};

export const selectCustomRecordsWithGroups = (
  state: RootState
): [Array<DNSCustomRecord>, Array<IGroup>] => {
  const records = selectCustomRecordsSorted(state);
  let groups: Array<IGroup> = [];

  records.forEach((record: DNSCustomRecord, i: number) => {
    const parsed = psl.parse(record.qname);
    if (parsed.error || !parsed.domain) {
      return;
    }
    const { domain } = parsed;
    if (groups[groups.length - 1]?.name !== domain) {
      groups.push({
        key: 'customDnsGroup' + domain,
        name: domain,
        startIndex: i,
        isCollapsed: false,
        level: 0,
        count: 0,
      });
    }
  });

  groups = groups.map((group, index) => {
    return {
      ...group,
      count:
        (groups[index + 1]?.startIndex || records.length) - group.startIndex,
    };
  });

  return [records, groups];
};

export const selectDumpWithGroups = (
  state: RootState
): [Array<DNSDumpDomainRecord>, Array<IGroup>] => {
  const { dump } = state.dns;
  const records: Array<DNSDumpDomainRecord> = [];
  const groups: Array<IGroup> = [];

  dump.forEach((dnsDomains: DNSDumpDomains) => {
    const [domainName, dnsRecords] = dnsDomains;
    groups.push({
      key: 'dnsDumpGroup' + domainName,
      name: domainName as string,
      startIndex: records.length,
      isCollapsed: false,
      level: 0,
      count: dnsRecords.length,
    });
    records.push(...(dnsRecords as Array<DNSDumpDomainRecord>));
  });

  return [records, groups];
};

export const getSecondaryNameserver = (): AppThunk => async (
  dispatch
): Promise<void> => {
  dispatch(getSecondaryNameserverStart());
  try {
    const result = await dnsApi.getDnsSecondaryNameserver();
    dispatch(getSecondaryNameserverSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, getSecondaryNameserverError);
  }
};

export const getZones = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(getZonesStart());
  try {
    const result = await dnsApi.getDnsZones();
    dispatch(getZonesSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, getZonesError);
  }
};

export const getCustomRecords = (): AppThunk => async (
  dispatch
): Promise<void> => {
  dispatch(getCustomRecordsStart());
  try {
    const result = await dnsApi.getDnsCustomRecords();
    dispatch(getCustomRecordsSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, getCustomRecordsError);
  }
};

export const getDump = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(getDumpStart());
  try {
    const result = await dnsApi.getDnsDump();
    dispatch(getDumpSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, getDumpError);
  }
};

export const addCustomRecord = (
  customRecordRequest: AddDnsCustomRecordRequest
): AppThunk => async (dispatch): Promise<void> => {
  dispatch(addCustomRecordStart());
  try {
    const result = await dnsApi.addDnsCustomRecord(customRecordRequest);
    dispatch(addCustomRecordSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, addCustomRecordError);
  }
};

export const removeCustomRecord = (
  customRecordRequest: RemoveDnsCustomRecordRequest
): AppThunk => async (dispatch): Promise<void> => {
  dispatch(removeCustomRecordStart());
  try {
    const result = await dnsApi.removeDnsCustomRecord(customRecordRequest);
    dispatch(removeCustomRecordSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, removeCustomRecordError);
  }
};

export const addSecondaryNameserver = (
  secondaryNameserverRequest: AddDnsSecondaryNameserverRequest
): AppThunk => async (dispatch): Promise<void> => {
  dispatch(addSecondaryNameserverStart());
  try {
    const result = await dnsApi.addDnsSecondaryNameserver(
      secondaryNameserverRequest
    );
    dispatch(addSecondaryNameserverSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, addSecondaryNameserverError);
  }
};
