import { MessageBarType, Text } from '@fluentui/react';
import React from 'react';
import { MessageBar } from '../../MessageBar/MessageBar';

export const BackupInfoLocal: React.FunctionComponent = () => {
  return (
    <>
      <Text>
        Backups are stored on this machine’s own hard disk. You are responsible
        for periodically using SFTP (FTP over SSH) to copy the backup files from
        /home/user-data/backup/encrypted to a safe location. These files are
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
