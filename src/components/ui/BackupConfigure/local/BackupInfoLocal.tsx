import { MessageBarType, Text } from '@fluentui/react';
import { SystemBackupConfigResponse } from 'mailinabox-api';
import React from 'react';
import { MessageBar } from '../../MessageBar/MessageBar';

interface BackupInfoLocalProps {
  config: SystemBackupConfigResponse;
}

export const BackupInfoLocal: React.FunctionComponent<BackupInfoLocalProps> = ({
  config,
}) => {
  return (
    <>
      <Text>
        Backups are stored on this machine’s own hard disk. You are responsible
        for periodically using SFTP (FTP over SSH) to copy the backup files from
        <code>{config.fileTargetDirectory}</code> to a safe location. These
        files are encrypted, so they are safe to store anywhere.
      </Text>
      <MessageBar messageBarType={MessageBarType.warning} isMultiline>
        Separately copy the encryption password from{' '}
        <code>{config.encPwFile}</code> to a safe and secure location. You will
        need this file to decrypt backup files.
      </MessageBar>
    </>
  );
};
