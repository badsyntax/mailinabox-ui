import { PrimaryButton, Stack, TextField } from '@fluentui/react';
import React, { useCallback, useMemo, useState } from 'react';
import {
  onRenderTextFieldLabel,
  textfieldWithLabelInfoStyles,
} from '../../TextFieldWithInfo/TextFieldWithInfo';

export const BackupConfigureRsync: React.FunctionComponent = () => {
  const [days, setDays] = useState<string | undefined>('1');
  const [hostname, setHostname] = useState<string | undefined>('');
  const [path, setPath] = useState<string | undefined>('');
  const [username, setUsername] = useState<string | undefined>('');
  const sshKey = 'key'; // TODO
  const onDaysChange = useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ): void => {
      setDays(newValue);
    },
    []
  );
  const onHostnameChange = useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ): void => {
      setHostname(newValue);
    },
    []
  );
  const onPathChange = useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ): void => {
      setPath(newValue);
    },
    []
  );
  const onUsernameChange = useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ): void => {
      setUsername(newValue);
    },
    []
  );
  const onDaysRenderLabel = useMemo(
    () =>
      onRenderTextFieldLabel(
        <>
          This is the minimum number of days backup data is kept for. The box
          makes an incremental backup, so backup data is often kept much longer.
          An incremental backup file that is less than this number of days old
          requires that all previous increments back to the most recent full
          backup, plus that full backup, remain available.
        </>
      ),
    []
  );
  const onSSHKeyRenderLabel = useMemo(
    () =>
      onRenderTextFieldLabel(
        <>
          Copy the Public SSH Key above, and paste it within the{' '}
          <code>~/.ssh/authorized_keys</code> of target user on the backup
          server specified above. That way you'll enable secure and passwordless
          authentication from your mail-in-a-box server and your backup server.
        </>
      ),
    []
  );
  return (
    <>
      <TextField
        value={hostname}
        label="Hostname"
        required
        placeholder="hostname.local"
        onChange={onHostnameChange}
      />
      <TextField
        value={path}
        label="Path"
        required
        placeholder="/backups/box.proxima-mail.com"
        onChange={onPathChange}
      />
      <TextField
        value={username}
        label="Username"
        required
        onChange={onUsernameChange}
      />
      <TextField
        value={sshKey}
        label="Public SSH Key"
        required
        readOnly
        onRenderLabel={onSSHKeyRenderLabel}
        styles={textfieldWithLabelInfoStyles}
      />
      <TextField
        value={days}
        label="Days"
        min={1}
        step={1}
        type="number"
        required
        onRenderLabel={onDaysRenderLabel}
        styles={textfieldWithLabelInfoStyles}
        onChange={onDaysChange}
      />
      <Stack horizontal>
        <PrimaryButton>Save</PrimaryButton>
      </Stack>
    </>
  );
};
