import { MessageBarType, Text } from '@fluentui/react';
import React from 'react';
import { MessageBar } from '../../MessageBar/MessageBar';

export const BackupInfoS3: React.FunctionComponent = () => {
  return (
    <>
      <Text>
        Backups are stored in an Amazon Web Services S3 bucket. You must have an
        AWS account already.
      </Text>
      <MessageBar messageBarType={MessageBarType.warning} isMultiline>
        You MUST manually copy the encryption password from
        <code>/home/user-data/backup/secret_key.txt</code> to a safe and secure
        location. You will need this file to decrypt backup files. It is NOT
        stored in your Amazon S3 bucket.
      </MessageBar>
    </>
  );
};
