import { TextField } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  onRenderTextFieldLabel,
  textfieldWithLabelInfoStyles,
} from '../../TextFieldWithInfo/TextFieldWithInfo';
import { BackupConfigureProps, BackupType } from '../types';

export const BackupConfigureLocal: React.FunctionComponent<BackupConfigureProps> = ({
  backupConfig,
  daysDescription,
  onConfigChange,
}) => {
  const [days, setDays] = useState<string | undefined>(
    String(backupConfig.minAgeInDays)
  );
  const onDaysChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ): void => {
      setDays(newValue);
    },
    []
  );
  const onDaysRenderLabel = useMemo(
    () => onRenderTextFieldLabel(daysDescription),
    [daysDescription]
  );

  useEffect(() => {
    onConfigChange({
      target: BackupType.local,
      targetUser: '',
      targetPass: '',
      minAge: Number(days) || 1,
    });
  }, [days, onConfigChange]);

  return (
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
  );
};
