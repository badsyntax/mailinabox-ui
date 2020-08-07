import { MessageBarType, Text } from '@fluentui/react';
import { SystemBackupConfigResponse } from 'mailinabox-api';
import React from 'react';
import { MessageBar } from '../../MessageBar/MessageBar';

interface BackupInfoS3Props {
  config: SystemBackupConfigResponse;
}

export const BackupInfoS3: React.FunctionComponent<BackupInfoS3Props> = ({
  config,
}) => {
  return (
    <>
      <Text>
        Backups are stored in an Amazon Web Services S3 bucket. You must have an
        AWS account already.
      </Text>
      <MessageBar messageBarType={MessageBarType.warning}>
        You MUST manually copy the encryption password from{' '}
        <code>{config.encPwFile}</code> to a safe and secure location. You will
        need this file to decrypt backup files. It is NOT stored in your Amazon
        S3 bucket.
      </MessageBar>
    </>
  );
};
