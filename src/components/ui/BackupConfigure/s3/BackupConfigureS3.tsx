import { Dropdown, IDropdownOption, TextField } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  onRenderTextFieldLabel,
  textfieldWithLabelInfoStyles,
} from '../../../ui/TextFieldWithInfo/TextFieldWithInfo';
import { BackupConfigureProps } from '../types';

const s3RegionOptions = [
  { key: 's3-eu-west-1.amazonaws.com', text: 'eu-west-1' },
  {
    key: 's3-ap-southeast-1.amazonaws.com',
    text: 'ap-southeast-1',
  },
  {
    key: 's3-us-gov-west-1.amazonaws.com',
    text: 'us-gov-west-1',
  },
  {
    key: 's3.ap-south-1.amazonaws.com',
    text: 'ap-south-1',
  },
  {
    key: 's3.eu-west-2.amazonaws.com',
    text: 'eu-west-2',
  },
  {
    key: 's3.ca-central-1.amazonaws.com',
    text: 'ca-central-1',
  },
  {
    key: 's3-ap-southeast-2.amazonaws.com',
    text: 'ap-southeast-2',
  },
  {
    key: 's3-us-west-1.amazonaws.com',
    text: 'us-west-1',
  },
  {
    key: 's3-ap-northeast-1.amazonaws.com',
    text: 'ap-northeast-1',
  },
  {
    key: 's3.ap-northeast-2.amazonaws.com',
    text: 'ap-northeast-2',
  },
  {
    key: 's3-sa-east-1.amazonaws.com',
    text: 'sa-east-1',
  },
  {
    key: 's3.amazonaws.com',
    text: 'us-east-1',
  },
  {
    key: 's3.us-east-2.amazonaws.com',
    text: 'us-east-2',
  },
  {
    key: 's3-us-west-2.amazonaws.com',
    text: 'us-west-2',
  },
  {
    key: 's3.eu-central-1.amazonaws.com',
    text: 'eu-central-1',
  },
  {
    key: 's3.cn-north-1.amazonaws.com.cn',
    text: 'cn-north-1',
  },
  {
    key: 'other',
    text: 'Other',
  },
];

export const BackupConfigureS3: React.FunctionComponent<BackupConfigureProps> = ({
  config,
  isCurrentType,
  daysDescription,
  onConfigChange,
}) => {
  const initialS3HostPath = isCurrentType
    ? config.target.substring(5).split('/')
    : [];
  const initialS3Host = isCurrentType ? initialS3HostPath.shift() : '';
  const initialRegion = s3RegionOptions.find(
    (regionOption) => regionOption.key === initialS3Host
  );

  const [host, setHost] = useState<string>(
    (initialRegion?.key === 'other' ? '' : initialRegion?.key) || ''
  );

  const [region, setRegion] = useState<IDropdownOption | undefined>(
    initialRegion
  );
  const [days, setDays] = useState<string | undefined>(
    String(config.minAgeInDays)
  );
  const [path, setPath] = useState<string | undefined>(
    initialS3HostPath.join('/')
  );
  const [accessKey, setAccessKey] = useState<string | undefined>();
  const [secretAccessKey, setSecretAccessKey] = useState<string | undefined>();

  const onRegionChange = useCallback(
    (
      _event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      setRegion(option);
      setHost(((option?.key === 'other' ? '' : option?.key) || '') as string);
    },
    []
  );

  const onPathChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setPath(newValue ?? '');
    },
    []
  );

  const onAccessKeyChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setAccessKey(newValue ?? '');
    },
    []
  );

  const onSecretAccessKeyChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setSecretAccessKey(newValue ?? '');
    },
    []
  );

  const onDaysChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setDays(newValue ?? '');
    },
    []
  );

  const onHostChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setHost(newValue ?? '');
    },
    []
  );

  const onDaysRenderLabel = useMemo(
    () => onRenderTextFieldLabel(daysDescription),
    [daysDescription]
  );

  useEffect(() => {
    onConfigChange({
      target: `s3://${host}/${path}`,
      targetUser: accessKey || '',
      targetPass: secretAccessKey || '',
      minAge: Number(days) || 1,
    });
  }, [accessKey, days, host, onConfigChange, path, secretAccessKey]);

  return (
    <>
      <Dropdown
        label="S3 Region"
        options={s3RegionOptions}
        selectedKey={region?.key}
        required
        onChange={onRegionChange}
      />
      <TextField
        label="S3 Host / Endpoint"
        required
        value={host}
        onChange={onHostChange}
        placeholder="Endpoint"
      />
      <TextField
        label="S3 Path"
        required
        value={path}
        placeholder="your-bucket-name/backup-directory"
        onChange={onPathChange}
      />
      <TextField
        label="S3 Access Key"
        required
        value={accessKey}
        onChange={onAccessKeyChange}
      />
      <TextField
        label="S3 Secret Access Key"
        required
        value={secretAccessKey}
        onChange={onSecretAccessKeyChange}
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
