import {
  Dropdown,
  IDropdownOption,
  IStackProps,
  mergeStyles,
  PrimaryButton,
  Stack,
} from '@fluentui/react';
import { SystemBackupStatusResponse } from 'mailinabox-api';
import React, { useCallback, useState } from 'react';
import { BackupConfigureLocal } from './local/BackupConfigureLocal';
import { BackupInfoLocal } from './local/BackupInfoLocal';
import { BackupConfigureRsync } from './rsync/BackupConfigureRsync';
import { BackupInfoRsync } from './rsync/BackupInfoRsync';
import { BackupConfigureS3 } from './s3/BackupConfigureS3';
import { BackupInfoS3 } from './s3/BackupInfoS3';

const columnClassName = mergeStyles({
  flexBasis: 0,
});

enum BackupOptionKeys {
  off,
  local,
  rsync,
  s3,
}

const backupOptions = [
  {
    key: BackupOptionKeys.off,
    text: 'Nowhere (Disable Backups)',
  },
  {
    key: BackupOptionKeys.local,
    text: 'box.proxima-mail.com (TODO)',
  },
  {
    key: BackupOptionKeys.rsync,
    text: 'rsync',
  },
  {
    key: BackupOptionKeys.s3,
    text: 'Amazon S3',
  },
];

export const BackupConfigure: React.FunctionComponent<
  IStackProps & SystemBackupStatusResponse
> = ({ backups, unmatchedFileSize, ...props }) => {
  const [selectedBackupOption, setSelectedBackupOption] = useState<
    IDropdownOption
  >();
  const onBackupOptionChange = useCallback(
    (
      event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      setSelectedBackupOption(option);
    },
    []
  );
  return (
    <Stack as="section" gap="l2" horizontal {...props}>
      <Stack gap="m" grow={1} className={columnClassName}>
        <Dropdown
          label="Backup to"
          options={backupOptions}
          selectedKey={selectedBackupOption?.key}
          required
          onChange={onBackupOptionChange}
        />
        {selectedBackupOption?.key === BackupOptionKeys.local && (
          <BackupInfoLocal />
        )}
        {selectedBackupOption?.key === BackupOptionKeys.rsync && (
          <BackupInfoRsync />
        )}
        {selectedBackupOption?.key === BackupOptionKeys.s3 && <BackupInfoS3 />}
      </Stack>
      <Stack
        gap="m"
        grow={1}
        className={columnClassName}
        verticalAlign={
          selectedBackupOption?.key === BackupOptionKeys.off ? 'end' : 'start'
        }
      >
        {selectedBackupOption?.key === BackupOptionKeys.local && (
          <BackupConfigureLocal />
        )}
        {selectedBackupOption?.key === BackupOptionKeys.rsync && (
          <BackupConfigureRsync />
        )}
        {selectedBackupOption?.key === BackupOptionKeys.s3 && (
          <BackupConfigureS3 />
        )}
        {selectedBackupOption?.key === BackupOptionKeys.off && (
          <Stack horizontal>
            <PrimaryButton>Save</PrimaryButton>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
