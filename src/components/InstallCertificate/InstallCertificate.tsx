import React, { useState, useCallback } from 'react';

import {
  IStackProps,
  Stack,
  MessageBarType,
  ComboBox,
  VirtualizedComboBox,
  IComboBoxOption,
  IOnRenderComboBoxLabelProps,
  IComboBox,
} from '@fluentui/react';
import { getCodeList } from 'country-list';

import { SSLStatusResponseStatus } from 'mailinabox-api';
import { MessageBar } from '../MessageBar/MessageBar';
import { InstallCertificateComboBoxLabel } from './InstallCertificateComboBoxLabel';
import { InstallCertificateWithCSR } from './InstallCertificateWithCSR';

const countries = getCodeList();

const countriesList = Object.keys(countries)
  .map((countryCode) => ({
    key: countryCode.toUpperCase(),
    text: countries[countryCode],
  }))
  .sort((a, b) => a.text.localeCompare(b.text));

const comboBoxStyles = {
  root: {
    maxWidth: 400,
  },
  subComponentStyles: {
    label: {
      root: {
        selectors: {
          ':after': {
            paddingRight: 0,
          },
        },
      },
    },
  },
};

const onRenderComboBoxLabel = (
  props?: IOnRenderComboBoxLabelProps,
  defaultRender?: (props?: IOnRenderComboBoxLabelProps) => JSX.Element | null
) =>
  props && defaultRender ? (
    <InstallCertificateComboBoxLabel {...props} defaultRender={defaultRender} />
  ) : null;

export const InstallCertificate: React.FunctionComponent<
  IStackProps & {
    items: Array<SSLStatusResponseStatus>;
  }
> = ({ items, ...props }) => {
  const [selectedDomain, setSelectedDomain] = useState<IComboBoxOption>();
  const [selectedCountry, setSelectedCountry] = useState<IComboBoxOption>();

  const onDomainChange = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
      setSelectedDomain(option);
    },
    []
  );
  const onCountryChange = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
      setSelectedCountry(option);
    },
    []
  );
  return (
    <Stack as="section" tokens={{ childrenGap: 'm' }} {...props}>
      <MessageBar messageBarType={MessageBarType.info} isMultiline>
        If you don't want to use our automatic Let's Encrypt integration, you
        can give any other certificate provider a try. You can generate the
        needed CSR below.
      </MessageBar>
      <ComboBox
        placeholder="Select a domain"
        label="Which domain are you getting a certificate for?"
        options={items.map(({ domain }) => ({
          key: domain,
          text: domain,
        }))}
        required
        allowFreeform
        autoComplete="on"
        selectedKey={selectedDomain ? selectedDomain.key : undefined}
        onRenderLabel={onRenderComboBoxLabel}
        onChange={onDomainChange}
        styles={comboBoxStyles}
      />
      {selectedDomain && (
        <VirtualizedComboBox
          placeholder="Select a country"
          label="What country are you in?"
          options={countriesList}
          onRenderLabel={onRenderComboBoxLabel}
          allowFreeform
          autoComplete="on"
          selectedKey={selectedCountry ? selectedCountry.key : undefined}
          onChange={onCountryChange}
          styles={comboBoxStyles}
          dropdownMaxWidth={300}
          useComboBoxAsMenuWidth
        />
      )}
      {selectedDomain && selectedCountry && (
        <InstallCertificateWithCSR
          domain={selectedDomain.key as string}
          countryCode={selectedCountry.key as string}
        />
      )}
    </Stack>
  );
};
