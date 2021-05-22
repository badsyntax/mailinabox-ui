import { Dropdown, IDropdownOption, TextField } from '@fluentui/react';
import React, { useEffect, useMemo } from 'react';
import { useFormInputs } from '../../../../forms/useFormInputs';
import {
  onRenderTextFieldLabel,
  textfieldWithLabelInfoStyles,
} from '../../../ui/TextFieldWithInfo/TextFieldWithInfo';
import { BackupConfigureProps } from '../types';
import { s3RegionOptions } from './regionOptions';

type FormState = {
  region: string;
  host: string;
  path: string;
  accessKey: string;
  secretAccessKey: string;
  days: string;
};

export const BackupConfigureS3: React.FunctionComponent<BackupConfigureProps> =
  ({ backupConfig, isCurrentType, daysDescription, onConfigChange }) => {
    const path = isCurrentType
      ? backupConfig.target.substring(5).split('/')
      : [];
    const host = isCurrentType ? path.shift() : '';
    const region = s3RegionOptions.find(
      (regionOption) => regionOption.key === host
    );

    const { inputs, setInputs, onInputChange } = useFormInputs<FormState>({
      region: (region?.key || '') as string,
      host: ((region?.key === 'other' ? '' : region?.key) || '') as string,
      days: String(backupConfig.minAgeInDays),
      path: path.join('/'),
      accessKey: '',
      secretAccessKey: '',
    });

    const onRegionChange = (
      _event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      if (option) {
        setInputs({
          ...inputs,
          region: option.key as string,
          host: ((option.key === 'other' ? '' : option?.key) || '') as string,
        });
      }
    };

    const onDaysRenderLabel = useMemo(
      () => onRenderTextFieldLabel(daysDescription),
      [daysDescription]
    );

    useEffect(() => {
      onConfigChange({
        target: `s3://${inputs.host}/${inputs.path}`,
        targetUser: inputs.accessKey || '',
        targetPass: inputs.secretAccessKey || '',
        minAge: Number(inputs.days) || 1,
      });
    }, [
      inputs.accessKey,
      inputs.days,
      inputs.host,
      inputs.path,
      inputs.secretAccessKey,
      onConfigChange,
    ]);

    return (
      <>
        <Dropdown
          label="S3 Region"
          options={s3RegionOptions}
          selectedKey={inputs.region}
          required
          onChange={onRegionChange}
        />
        <TextField
          label="S3 Host / Endpoint"
          required
          value={inputs.host}
          onChange={onInputChange}
          name="host"
          placeholder="Endpoint"
        />
        <TextField
          label="S3 Path"
          required
          value={inputs.path}
          name="path"
          placeholder="your-bucket-name/backup-directory"
          onChange={onInputChange}
        />
        <TextField
          label="S3 Access Key"
          required
          name="accessKey"
          value={inputs.accessKey}
          onChange={onInputChange}
        />
        <TextField
          label="S3 Secret Access Key"
          required
          name="secretAccessKey"
          value={inputs.secretAccessKey}
          onChange={onInputChange}
        />
        <TextField
          value={inputs.days}
          label="Days"
          min={1}
          step={1}
          type="number"
          name="days"
          required
          onRenderLabel={onDaysRenderLabel}
          styles={textfieldWithLabelInfoStyles}
          onChange={onInputChange}
        />
      </>
    );
  };
