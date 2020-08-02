import { TextField } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  onRenderTextFieldLabel,
  textfieldWithLabelInfoStyles,
} from '../../TextFieldWithInfo/TextFieldWithInfo';
import { BackupConfigureProps } from '../types';

export const BackupConfigureRsync: React.FunctionComponent<BackupConfigureProps> = ({
  config,
  isCurrentType,
  daysDescription,
  onConfigChange,
}) => {
  const targetPath = isCurrentType
    ? config.target.substring(8).split('//')
    : [];
  const targetHostParts = isCurrentType
    ? targetPath.shift()?.split('@') || []
    : [];
  const initialUsername = isCurrentType ? targetHostParts[0] : '';
  const initialHostName = isCurrentType ? targetHostParts[1] : '';
  const initialPath = isCurrentType ? `/${targetPath[0]}` : '';

  const [days, setDays] = useState<string | undefined>(
    String(config.minAgeInDays)
  );
  const [hostname, setHostname] = useState<string | undefined>(initialHostName);
  const [path, setPath] = useState<string | undefined>(initialPath);
  const [username, setUsername] = useState<string | undefined>(initialUsername);

  const onDaysChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ): void => {
      setDays(newValue);
    },
    []
  );

  const onHostnameChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ): void => {
      setHostname(newValue);
    },
    []
  );

  const onPathChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ): void => {
      setPath(newValue);
    },
    []
  );
  const onUsernameChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ): void => {
      setUsername(newValue);
    },
    []
  );

  const onDaysRenderLabel = useMemo(
    () => onRenderTextFieldLabel(daysDescription),
    [daysDescription]
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

  useEffect(() => {
    onConfigChange({
      target: `rsync://${username}@${hostname}/${path}`,
      targetUser: '',
      targetPass: '',
      minAge: Number(days) || 1,
    });
  }, [days, hostname, onConfigChange, path, username]);

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
        placeholder="/backups/box.example.com"
        onChange={onPathChange}
      />
      <TextField
        value={username}
        label="Username"
        required
        onChange={onUsernameChange}
      />
      <TextField
        value={config.sshPubKey}
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
    </>
  );
};
