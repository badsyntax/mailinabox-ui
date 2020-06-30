import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import {
  DNSCustomRecord,
  DNSDumpResponse,
  DNSSecondaryNameserverResponse,
} from 'mailinabox-api';
import { dnsApi, getRequestFailMessage } from '../api';
import { RootState } from '../store';

export interface SSLState {
  isCheckingSecondaryNameserver: boolean;
  isCheckingZones: boolean;
  isCheckingCustomRecords: boolean;
  isCheckingDump: boolean;
  secondaryNameserver: DNSSecondaryNameserverResponse;
  zones: Array<string>;
  customRecords: Array<DNSCustomRecord>;
  dump: DNSDumpResponse;
  getSecondaryNameserverError: string | null;
  getZonesError: string | null;
  getCustomRecordsError: string | null;
  getDumpError: string | null;
}

const initialState: SSLState = {
  isCheckingSecondaryNameserver: false,
  isCheckingZones: false,
  isCheckingCustomRecords: false,
  isCheckingDump: false,
  secondaryNameserver: {
    hostnames: [],
  },
  dump: [],
  zones: [],
  customRecords: [],
  getSecondaryNameserverError: null,
  getZonesError: null,
  getCustomRecordsError: null,
  getDumpError: null,
};

export const dns = createSlice({
  name: 'dns',
  initialState,
  reducers: {
    dnsGetDumpStart: (state): void => {
      state.getDumpError = null;
      state.isCheckingDump = true;
    },
    dnsGetDumpSuccess: (state, action): void => {
      state.isCheckingDump = false;
      state.dump = action.payload;
    },
    dnsGetDumpError: (state, action): void => {
      state.isCheckingDump = false;
      state.getDumpError = action.payload;
    },
    dnsGetSecondaryNameserverStart: (state): void => {
      state.getSecondaryNameserverError = null;
      state.isCheckingSecondaryNameserver = true;
    },
    dnsGetSecondaryNameserverSuccess: (state, action): void => {
      state.isCheckingSecondaryNameserver = false;
      state.secondaryNameserver = action.payload;
    },
    dnsGetSecondaryNameserverError: (state, action): void => {
      state.isCheckingSecondaryNameserver = false;
      state.getSecondaryNameserverError = action.payload;
    },
    dnsGetZonesStart: (state): void => {
      state.getZonesError = null;
      state.isCheckingZones = true;
    },
    dnsGetZonesSuccess: (state, action): void => {
      state.isCheckingZones = false;
      state.secondaryNameserver = action.payload;
    },
    dnsGetZonesError: (state, action): void => {
      state.isCheckingZones = false;
      state.getZonesError = action.payload;
    },
    dnsGetCustomRecordsStart: (state): void => {
      state.getCustomRecordsError = null;
      state.isCheckingCustomRecords = true;
    },
    dnsGetCustomRecordsSuccess: (state, action): void => {
      state.isCheckingCustomRecords = false;
      state.customRecords = action.payload;
    },
    dnsGetCustomRecordsError: (state, action): void => {
      state.isCheckingCustomRecords = false;
      state.getCustomRecordsError = action.payload;
    },
  },
});

export const {
  dnsGetSecondaryNameserverStart,
  dnsGetSecondaryNameserverSuccess,
  dnsGetSecondaryNameserverError,
  dnsGetZonesStart,
  dnsGetZonesSuccess,
  dnsGetZonesError,
  dnsGetCustomRecordsStart,
  dnsGetCustomRecordsSuccess,
  dnsGetCustomRecordsError,
  dnsGetDumpStart,
  dnsGetDumpSuccess,
  dnsGetDumpError,
} = dns.actions;

export const dnsSecondaryNameserverCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(dnsGetSecondaryNameserverStart());
  try {
    const result = await dnsApi.getDnsSecondaryNameserver();
    dispatch(dnsGetSecondaryNameserverSuccess(result));
  } catch (err) {
    dispatch(
      dnsGetSecondaryNameserverError(getRequestFailMessage(err as Response))
    );
  }
};

export const dnsZonesCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(dnsGetZonesStart());
  try {
    const result = await dnsApi.getDnsZones();
    dispatch(dnsGetZonesSuccess(result));
  } catch (err) {
    dispatch(dnsGetZonesError(getRequestFailMessage(err as Response)));
  }
};

export const dnsCustomRecordsCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(dnsGetCustomRecordsStart());
  try {
    const result = await dnsApi.getDnsCustomRecords();
    dispatch(dnsGetCustomRecordsSuccess(result));
  } catch (err) {
    dispatch(dnsGetCustomRecordsError(getRequestFailMessage(err as Response)));
  }
};

export const dnsDumpCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(dnsGetDumpStart());
  try {
    const result = await dnsApi.getDnsDump();
    dispatch(dnsGetDumpSuccess(result));
  } catch (err) {
    dispatch(dnsGetDumpError(getRequestFailMessage(err as Response)));
  }
};

export const { reducer: dnsReducer } = dns;

export const selectIsCheckingSecondaryNameserver = (
  state: RootState
): boolean => state.dns.isCheckingSecondaryNameserver;

export const selectGetSecondaryNameserverError = (
  state: RootState
): string | null => state.dns.getSecondaryNameserverError;

export const selectGetSecondaryNameserver = (
  state: RootState
): DNSSecondaryNameserverResponse => state.dns.secondaryNameserver;

export const selectIsCheckingZones = (state: RootState): boolean =>
  state.dns.isCheckingZones;

export const selectGetZonesError = (state: RootState): string | null =>
  state.dns.getZonesError;

export const selectGetZones = (state: RootState): Array<string> =>
  state.dns.zones;

export const selectIsCheckingCustomRecords = (state: RootState): boolean =>
  state.dns.isCheckingCustomRecords;

export const selectGetCustomRecordsError = (state: RootState): string | null =>
  state.dns.getCustomRecordsError;

export const selectGetCustomRecords = (
  state: RootState
): Array<DNSCustomRecord> => state.dns.customRecords;

export const selectIsCheckingDump = (state: RootState): boolean =>
  state.dns.isCheckingDump;

export const selectGetDumpError = (state: RootState): string | null =>
  state.dns.getDumpError;

export const selectGetDump = (state: RootState): DNSDumpResponse =>
  state.dns.dump;

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

export const selectGetCustomRecordsSorted = (
  state: RootState
): Array<DNSCustomRecord> => {
  return state.dns.customRecords
    .slice()
    .map(reverseFqdn)
    .sort(sort)
    .map(reverseFqdn);
};
