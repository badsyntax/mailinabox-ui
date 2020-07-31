import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import {
  AddDnsCustomRecordRequest,
  AddDnsSecondaryNameserverRequest,
  DNSCustomRecord,
  DNSDumpResponse,
  DNSSecondaryNameserverResponse,
  RemoveDnsCustomRecordRequest,
} from 'mailinabox-api';
import { dnsApi, getRequestFailMessage } from '../api';
import { RootState } from '../store';

export enum DNSActionType {
  remove,
}

export interface DNSAction {
  dnsRecord?: DNSCustomRecord;
  type?: DNSActionType;
}

export interface SSLState {
  isCheckingSecondaryNameserver: boolean;
  isCheckingZones: boolean;
  isCheckingCustomRecords: boolean;
  isCheckingDump: boolean;
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
  isCheckingSecondaryNameserver: false,
  isCheckingZones: false,
  isCheckingCustomRecords: false,
  isCheckingDump: false,
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
      state.isCheckingDump = true;
    },
    getDumpSuccess: (state, action): void => {
      state.isCheckingDump = false;
      state.dump = action.payload;
    },
    getDumpError: (state, action): void => {
      state.isCheckingDump = false;
      state.getDumpError = action.payload;
    },
    getSecondaryNameserverStart: (state): void => {
      state.getSecondaryNameserverError = null;
      state.isCheckingSecondaryNameserver = true;
    },
    getSecondaryNameserverSuccess: (state, action): void => {
      state.isCheckingSecondaryNameserver = false;
      state.secondaryNameserver = action.payload;
    },
    getSecondaryNameserverError: (state, action): void => {
      state.isCheckingSecondaryNameserver = false;
      state.getSecondaryNameserverError = action.payload;
    },
    getZonesStart: (state): void => {
      state.getZonesError = null;
      state.isCheckingZones = true;
    },
    getZonesSuccess: (state, action): void => {
      state.isCheckingZones = false;
      state.zones = action.payload;
    },
    getZonesError: (state, action): void => {
      state.isCheckingZones = false;
      state.getZonesError = action.payload;
    },
    getCustomRecordsStart: (state): void => {
      state.getCustomRecordsError = null;
      state.isCheckingCustomRecords = true;
    },
    getCustomRecordsSuccess: (state, action): void => {
      state.isCheckingCustomRecords = false;
      state.customRecords = action.payload;
    },
    getCustomRecordsError: (state, action): void => {
      state.isCheckingCustomRecords = false;
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

export const selectIsCheckingSecondaryNameserver = (
  state: RootState
): boolean => state.dns.isCheckingSecondaryNameserver;

export const selectGetSecondaryNameserverError = (
  state: RootState
): string | null => state.dns.getSecondaryNameserverError;

export const selectSecondaryNameserver = (
  state: RootState
): DNSSecondaryNameserverResponse => state.dns.secondaryNameserver;

export const selectIsCheckingZones = (state: RootState): boolean =>
  state.dns.isCheckingZones;

export const selectGetZonesError = (state: RootState): string | null =>
  state.dns.getZonesError;

export const selectZones = (state: RootState): Array<string> => state.dns.zones;

export const selectIsCheckingCustomRecords = (state: RootState): boolean =>
  state.dns.isCheckingCustomRecords;

export const selectGetCustomRecordsError = (state: RootState): string | null =>
  state.dns.getCustomRecordsError;

export const selectCustomRecords = (state: RootState): Array<DNSCustomRecord> =>
  state.dns.customRecords;

export const selectIsCheckingDump = (state: RootState): boolean =>
  state.dns.isCheckingDump;

export const selectGetDumpError = (state: RootState): string | null =>
  state.dns.getDumpError;

export const selectDump = (state: RootState): DNSDumpResponse => state.dns.dump;

export const selectIsAddingCustomRecord = (state: RootState): boolean =>
  state.dns.isAddingCustomRecord;

export const selectAddCustomRecordError = (state: RootState): string | null =>
  state.dns.addCustomRecordError;

export const selectAddCustomRecordResponse = (
  state: RootState
): string | null => state.dns.addCustomRecordResponse;

export const selectIsAddingSecondaryNameserver = (state: RootState): boolean =>
  state.dns.isAddingSecondaryNameserver;

export const selectAddSecondaryNameserverError = (
  state: RootState
): string | null => state.dns.addSecondaryNameserverError;

export const selectAddSecondaryNameserverResponse = (
  state: RootState
): string | null => state.dns.addSecondaryNameserverResponse;

export const selectIsRemovingCustomRecord = (state: RootState): boolean =>
  state.dns.isRemovingCustomRecord;

export const selectRemoveCustomRecordError = (
  state: RootState
): string | null => state.dns.removeCustomRecordError;

export const selectRemoveCustomRecordResponse = (
  state: RootState
): string | null => state.dns.removeCustomRecordResponse;

export const selectDNSAction = (state: RootState): DNSAction | null =>
  state.dns.dnsAction;

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

export const getSecondaryNameserver = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(getSecondaryNameserverStart());
  try {
    const result = await dnsApi.getDnsSecondaryNameserver();
    dispatch(getSecondaryNameserverSuccess(result));
  } catch (err) {
    dispatch(getSecondaryNameserverError(await getRequestFailMessage(err)));
  }
};

export const getZones = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(getZonesStart());
  try {
    const result = await dnsApi.getDnsZones();
    dispatch(getZonesSuccess(result));
  } catch (err) {
    dispatch(getZonesError(await getRequestFailMessage(err)));
  }
};

export const getCustomRecords = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(getCustomRecordsStart());
  try {
    const result = await dnsApi.getDnsCustomRecords();
    dispatch(getCustomRecordsSuccess(result));
  } catch (err) {
    dispatch(getCustomRecordsError(await getRequestFailMessage(err)));
  }
};

export const getDump = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(getDumpStart());
  try {
    const result = await dnsApi.getDnsDump();
    dispatch(getDumpSuccess(result));
  } catch (err) {
    dispatch(getDumpError(await getRequestFailMessage(err)));
  }
};

export const addCustomRecord = (
  customRecordRequest: AddDnsCustomRecordRequest
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(addCustomRecordStart());
  try {
    const result = await dnsApi.addDnsCustomRecord(customRecordRequest);
    dispatch(addCustomRecordSuccess(result));
  } catch (err) {
    dispatch(addCustomRecordError(await getRequestFailMessage(err)));
  }
};

export const removeCustomRecord = (
  customRecordRequest: RemoveDnsCustomRecordRequest
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(removeCustomRecordStart());
  try {
    const result = await dnsApi.removeDnsCustomRecord(customRecordRequest);
    dispatch(removeCustomRecordSuccess(result));
  } catch (err) {
    dispatch(removeCustomRecordError(await getRequestFailMessage(err)));
  }
};

export const addSecondaryNameserver = (
  secondaryNameserverRequest: AddDnsSecondaryNameserverRequest
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(addSecondaryNameserverStart());
  try {
    const result = await dnsApi.addDnsSecondaryNameserver(
      secondaryNameserverRequest
    );
    dispatch(addSecondaryNameserverSuccess(result));
  } catch (err) {
    dispatch(addSecondaryNameserverError(await getRequestFailMessage(err)));
  }
};
