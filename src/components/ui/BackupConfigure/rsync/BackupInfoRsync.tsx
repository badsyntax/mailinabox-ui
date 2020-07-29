import { MessageBarType, Text } from '@fluentui/react';
import React from 'react';
import { MessageBar } from '../../MessageBar/MessageBar';

export const BackupInfoRsync: React.FunctionComponent = () => {
  return (
    <>
      <Text>
        Backups synced to a remote machine using rsync over SSH, with local
        copies in <code>/home/user-data/backup/encrypted</code>. These files are
        encrypted, so they are safe to store anywhere.
      </Text>
      <MessageBar messageBarType={MessageBarType.warning} isMultiline>
        Separately copy the encryption password from
        <code>/home/user-data/backup/secret_key.txt</code> to a safe and secure
        location. You will need this file to decrypt backup files.
      </MessageBar>
    </>
  );
};
