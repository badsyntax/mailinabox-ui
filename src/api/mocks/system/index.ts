/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Mocks } from '../types';
import getSystemBackupConfig from './data/getSystemBackupConfig.json';
import getSystemBackupStatus from './data/getSystemBackupStatus.json';
import getSystemPrivacyStatus from './data/getSystemPrivacyStatus.json';
import getSystemRebootStatus from './data/getSystemRebootStatus.json';
import getSystemStatus from './data/getSystemStatus.json';
import getSystemUpdates from './data/getSystemUpdates.json';
import getSystemUpstreamVersion from './data/getSystemUpstreamVersion.json';
import getSystemVersion from './data/getSystemVersion.json';
import rebootSystem from './data/rebootSystem.json';
import updateSystemBackupConfig from './data/updateSystemBackupConfig.json';
import updateSystemPackages from './data/updateSystemPackages.json';
import updateSystemPrivacy from './data/updateSystemPrivacy.json';

export const system: Mocks = {
  'admin/system/status': {
    post: getSystemStatus.response,
  },
  'admin/system/version': {
    get: getSystemVersion.response,
  },
  'admin/system/latest-updstream-version': {
    post: getSystemUpstreamVersion.response,
  },
  'admin/system/updates': {
    get: getSystemUpdates.response,
  },
  'admin/system/update-packages': {
    post: updateSystemPackages.response,
  },
  'admin/system/privacy': {
    get: getSystemPrivacyStatus.response,
    post: updateSystemPrivacy.response,
  },
  'admin/system/reboot': {
    get: getSystemRebootStatus.response,
    post: rebootSystem.response,
  },
  'admin/system/backup/status': {
    get: getSystemBackupStatus.response,
  },
  'admin/system/backup/config': {
    get: getSystemBackupConfig.response,
    post: updateSystemBackupConfig.response,
  },
};
