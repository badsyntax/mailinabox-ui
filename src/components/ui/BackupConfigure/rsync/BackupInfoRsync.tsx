import { MessageBarType, Text } from '@fluentui/react';
import { SystemBackupConfigResponse } from 'mailinabox-api';
import React from 'react';
import { MessageBar } from '../../MessageBar/MessageBar';

interface BackupInfoRsyncProps {
  config: SystemBackupConfigResponse;
}

export const BackupInfoRsync: React.FunctionComponent<BackupInfoRsyncProps> = ({
  config,
}) => {
  return (
    <>
      <Text>
        Backups synced to a remote machine using rsync over SSH, with local
        copies in <code>{config.fileTargetDirectory}</code>. These files are
        encrypted, so they are safe to store anywhere.
      </Text>
      <MessageBar messageBarType={MessageBarType.warning} isMultiline>
        Separately copy the encryption password from{' '}
        <code>{config.encPwFile}</code> to a safe and secure location. You will
        need this file to decrypt backup files.
      </MessageBar>
    </>
  );
};
