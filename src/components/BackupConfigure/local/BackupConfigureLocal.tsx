import { PrimaryButton, Stack, TextField } from '@fluentui/react';
import React, { useCallback, useMemo, useState } from 'react';
import {
  onRenderTextFieldLabel,
  textfieldWithLabelInfoStyles,
} from '../../TextFieldWithInfo/TextFieldWithInfo';

export const BackupConfigureLocal: React.FunctionComponent = () => {
  const [days, setDays] = useState<string | undefined>('1');
  const onDaysChange = useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ): void => {
      setDays(newValue);
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
  return (
    <>
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
