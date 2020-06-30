import {
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  Stack,
  TextField,
} from '@fluentui/react';
import React, { useCallback, useMemo, useState } from 'react';
import {
  onRenderTextFieldLabel,
  textfieldWithLabelInfoStyles,
} from '../../TextFieldWithInfo/TextFieldWithInfo';

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

export const BackupConfigureS3: React.FunctionComponent = () => {
  const [selectedRegion, setSelectedRegion] = useState<IDropdownOption>();
  const onRegionChange = useCallback(
    (
      event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      setSelectedRegion(option);
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
      <Dropdown
        label="S3 Region"
        options={s3RegionOptions}
        selectedKey={selectedRegion?.key}
        required
        onChange={onRegionChange}
      />
      <TextField
        label="S3 Host / Endpoint"
        required
        value={selectedRegion?.key as string}
      />
      <TextField label="S3 Access Key" required />
      <TextField label="S3 Secret Access Key" required />
      <TextField
        defaultValue="3"
        label="Days"
        min={1}
        step={1}
        type="number"
        required
        onRenderLabel={onDaysRenderLabel}
        styles={textfieldWithLabelInfoStyles}
      />
      <Stack horizontal>
        <PrimaryButton>Save</PrimaryButton>
      </Stack>
    </>
  );
};
