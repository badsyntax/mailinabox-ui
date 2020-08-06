/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Mocks } from '../types';
import addDnsCustomARecord from './data/addDnsCustomARecord.json';
import addDnsCustomRecord from './data/addDnsCustomRecord.json';
import addDnsSecondaryNameserver from './data/addDnsSecondaryNameserver.json';
import getDnsCustomARecordsForQName from './data/getDnsCustomARecordsForQName.json';
import getDnsCustomRecords from './data/getDnsCustomRecords.json';
import getDnsCustomRecordsForQNameAndType from './data/getDnsCustomRecordsForQNameAndType.json';
import getDnsDump from './data/getDnsDump.json';
import getDnsSecondaryNameserver from './data/getDnsSecondaryNameserver.json';
import getDnsZones from './data/getDnsZones.json';
import removeDnsCustomARecord from './data/removeDnsCustomARecord.json';
import removeDnsCustomRecord from './data/removeDnsCustomRecord.json';
import updateDns from './data/updateDns.json';
import updateDnsCustomARecord from './data/updateDnsCustomARecord.json';
import updateDnsCustomRecord from './data/updateDnsCustomRecord.json';

export const dns: Mocks = {
  'admin/dns/secondary-nameserver': {
    get: getDnsSecondaryNameserver.response,
    post: addDnsSecondaryNameserver.response,
  },
  'admin/dns/zones': {
    get: getDnsZones.response,
  },
  'admin/dns/update': {
    get: updateDns.response,
  },
  'admin/dns/custom': {
    get: getDnsCustomRecords.response,
  },
  'admin/dns/:qname/:rtype': {
    get: getDnsCustomRecordsForQNameAndType.response,
    post: addDnsCustomRecord.response,
    put: updateDnsCustomRecord.response,
    delete: removeDnsCustomRecord.response,
  },
  'admin/dns/:qname': {
    get: getDnsCustomARecordsForQName.response,
    post: addDnsCustomARecord.response,
    put: updateDnsCustomARecord.response,
    delete: removeDnsCustomARecord.response,
  },
  'admin/dns/dump': {
    get: getDnsDump.response,
  },
};
