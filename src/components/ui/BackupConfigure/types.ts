import {
  SystemBackupConfigResponse,
  SystemBackupConfigUpdateRequest,
} from 'mailinabox-api';

export interface BackupConfigureProps {
  backupConfig: SystemBackupConfigResponse;
  isCurrentType: boolean;
  daysDescription: string;
  onConfigChange: (config: SystemBackupConfigUpdateRequest) => void;
}

export enum BackupType {
  off = 'off',
  local = 'local',
  rsync = 'rsync',
  s3 = 's3',
}
