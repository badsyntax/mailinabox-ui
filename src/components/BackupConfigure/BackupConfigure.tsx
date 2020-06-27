import {
  Dropdown,
  IDropdownOption,
  IStackProps,
  mergeStyles,
  MessageBarType,
  Stack,
  Text,
} from '@fluentui/react';
import { SystemBackupStatusResponse } from 'mailinabox-api';
import React, { useCallback, useState } from 'react';
import { MessageBar } from '../MessageBar/MessageBar';
import { BackupConfigureS3 } from './BackupConfigureS3';

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
        <Text>
          Backups are stored in an Amazon Web Services S3 bucket. You must have
          an AWS account already.
        </Text>
        <MessageBar messageBarType={MessageBarType.info} isMultiline>
          You MUST manually copy the encryption password from
          /home/user-data/backup/secret_key.txt to a safe and secure location.
          You will need this file to decrypt backup files. It is NOT stored in
          your Amazon S3 bucket.
        </MessageBar>
      </Stack>
      <Stack gap="m" grow={1} className={columnClassName}>
        {selectedBackupOption?.key === BackupOptionKeys.s3 && (
          <BackupConfigureS3 />
        )}
      </Stack>
    </Stack>
  );
};
