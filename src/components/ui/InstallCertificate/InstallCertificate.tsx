import {
  ComboBox,
  IComboBox,
  IComboBoxOption,
  IOnRenderComboBoxLabelProps,
  IStackProps,
  mergeStyles,
  MessageBarType,
  Stack,
  VirtualizedComboBox,
} from '@fluentui/react';
import { getCodeList } from 'country-list';
import { SSLStatus } from 'mailinabox-api';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateCSRReset } from '../../../features/sslSlice';
import { RootState } from '../../../store';
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

const columnClassName = mergeStyles({
  flexBasis: 0,
});

const comboBoxStyles = {
  label: {
    selectors: {
      ':after': {
        paddingRight: 0,
      },
    },
  },
};

const onRenderComboBoxLabel = (calloutText: string) => (
  props?: IOnRenderComboBoxLabelProps,
  defaultRender?: (props?: IOnRenderComboBoxLabelProps) => JSX.Element | null
): React.ReactElement | null =>
  props && defaultRender ? (
    <InstallCertificateComboBoxLabel
      {...props}
      calloutText={calloutText}
      defaultRender={defaultRender}
    />
  ) : null;

export const InstallCertificate: React.FunctionComponent<
  IStackProps & {
    items: Array<SSLStatus>;
  }
> = ({ items, ...props }) => {
  const { sslAction } = useSelector((state: RootState) => state.ssl);
  const dispatch = useDispatch();
  const [selectedDomain, setSelectedDomain] = useState<IComboBoxOption>({
    key: sslAction?.sslStatus?.domain || '',
    text: sslAction?.sslStatus?.domain || '',
  });
  const [selectedCountry, setSelectedCountry] = useState<IComboBoxOption>();

  const onDomainChange = useCallback(
    (_event: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
      if (option) {
        dispatch(generateCSRReset());
        setSelectedDomain(option);
      }
    },
    [dispatch]
  );
  const onCountryChange = useCallback(
    (_event: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
      dispatch(generateCSRReset());
      setSelectedCountry(option);
    },
    [dispatch]
  );
  const onDomainRenderLabel = useMemo(
    () =>
      onRenderComboBoxLabel(
        'A multi-domain or wildcard certificate will be automatically applied to any domains it is valid for besides the one you choose above.'
      ),
    []
  );
  const onCountryRenderLabel = useMemo(
    () =>
      onRenderComboBoxLabel(
        "This is required by some TLS certificate providers. You may leave this blank if you know your TLS certificate provider doesn't require it."
      ),
    []
  );

  return (
    <Stack as="section" gap="m" {...props}>
      <MessageBar messageBarType={MessageBarType.info} isMultiline>
        If you don't want to use our automatic Let's Encrypt integration, you
        can give any other certificate provider a try. You can generate the
        needed CSR below.
      </MessageBar>
      <Stack horizontal gap="l2">
        <Stack gap="m" grow={1} className={columnClassName}>
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
            selectedKey={selectedDomain?.key}
            onRenderLabel={onDomainRenderLabel}
            onChange={onDomainChange}
            styles={comboBoxStyles}
          />
          {selectedDomain?.key && (
            <VirtualizedComboBox
              placeholder="Select a country"
              label="What country are you in?"
              options={countriesList}
              onRenderLabel={onCountryRenderLabel}
              allowFreeform
              autoComplete="on"
              selectedKey={selectedCountry?.key}
              onChange={onCountryChange}
              styles={comboBoxStyles}
              dropdownMaxWidth={300}
              useComboBoxAsMenuWidth
            />
          )}
        </Stack>
        <Stack gap="m" grow={2} className={columnClassName}>
          {selectedDomain && selectedCountry && (
            <InstallCertificateWithCSR
              domain={selectedDomain.key as string}
              countryCode={selectedCountry.key as string}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
