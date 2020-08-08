import { TextField } from '@fluentui/react';
import React, { useEffect, useMemo } from 'react';
import { config } from '../../../../config';
import { useFormInputs } from '../../../../forms/useFormInputs';
import {
  onRenderTextFieldLabel,
  textfieldWithLabelInfoStyles,
} from '../../TextFieldWithInfo/TextFieldWithInfo';
import { BackupConfigureProps } from '../types';

type FormState = {
  hostname: string;
  path: string;
  username: string;
  days: string;
};

export const BackupConfigureRsync: React.FunctionComponent<BackupConfigureProps> = ({
  backupConfig,
  isCurrentType,
  daysDescription,
  onConfigChange,
}) => {
  const targetPath = isCurrentType
    ? backupConfig.target.substring(8).split('//')
    : [];
  const targetHostParts = isCurrentType
    ? targetPath.shift()?.split('@') || []
    : [];

  const { inputs, onInputChange } = useFormInputs<FormState>({
    hostname: isCurrentType ? targetHostParts[1] : '',
    path: isCurrentType ? `/${targetPath[0]}` : '',
    username: isCurrentType ? targetHostParts[0] : '',
    days: String(backupConfig.minAgeInDays),
  });

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
      target: `rsync://${inputs.username}@${inputs.hostname}/${inputs.path}`,
      targetUser: '',
      targetPass: '',
      minAge: Number(inputs.days) || 1,
    });
  }, [
    inputs.days,
    inputs.hostname,
    inputs.path,
    inputs.username,
    onConfigChange,
  ]);

  return (
    <>
      <TextField
        value={inputs.hostname}
        label="Hostname"
        name="hostname"
        required
        placeholder="hostname.local"
        onChange={onInputChange}
      />
      <TextField
        value={inputs.path}
        label="Path"
        name="path"
        required
        placeholder={`/backups/${config.hostname}`}
        onChange={onInputChange}
      />
      <TextField
        value={inputs.username}
        label="Username"
        name="username"
        required
        onChange={onInputChange}
      />
      <TextField
        value={backupConfig.sshPubKey}
        label="Public SSH Key"
        required
        readOnly
        onRenderLabel={onSSHKeyRenderLabel}
        styles={textfieldWithLabelInfoStyles}
      />
      <TextField
        value={inputs.days}
        label="Days"
        name="days"
        min={1}
        step={1}
        type="number"
        required
        onRenderLabel={onDaysRenderLabel}
        styles={textfieldWithLabelInfoStyles}
        onChange={onInputChange}
      />
    </>
  );
};
