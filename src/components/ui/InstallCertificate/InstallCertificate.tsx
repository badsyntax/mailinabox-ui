import {
  ComboBox,
  IComboBox,
  IComboBoxOption,
  IOnRenderComboBoxLabelProps,
  IStackProps,
  mergeStyles,
  MessageBarType,
  ScreenWidthMinLarge,
  Stack,
  VirtualizedComboBox,
} from '@fluentui/react';
import { getCodeList } from 'country-list';
import { SSLStatus } from 'mailinabox-api';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { generateCSRReset } from '../../../features/sslSlice';
import { useFormInputs } from '../../../forms/useFormInputs';
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

const onRenderComboBoxLabel =
  (calloutText: string) =>
  (
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

type FormState = {
  domain: string;
  country: string;
};

const initialFormState: FormState = {
  domain: '',
  country: '',
};

export const InstallCertificate: React.FunctionComponent<
  IStackProps & {
    items: Array<SSLStatus>;
  }
> = ({ items, ...props }) => {
  const { sslAction } = useSelector((state: RootState) => state.ssl);
  const { inputs, setInputs } = useFormInputs<FormState>({
    ...initialFormState,
    domain: sslAction?.sslStatus?.domain || '',
  });
  const dispatch = useDispatch();
  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });

  const onComboboxChange =
    (key: keyof FormState) =>
    (_event: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
      if (option) {
        dispatch(generateCSRReset());
        setInputs({
          ...inputs,
          [key]: option,
        });
      }
    };

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
      <MessageBar
        messageBarType={MessageBarType.info}
        isMultiline={isMinLargeScreen}
        truncated={!isMinLargeScreen}
      >
        If you don't want to use our automatic Let's Encrypt integration, you
        can give any other certificate provider a try. You can generate the
        needed CSR below.
      </MessageBar>
      <Stack horizontal={isMinLargeScreen} gap={isMinLargeScreen ? 'l2' : 'm'}>
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
            selectedKey={inputs.domain}
            onRenderLabel={onDomainRenderLabel}
            onChange={onComboboxChange('domain')}
            styles={comboBoxStyles}
          />
          {inputs.domain && (
            <VirtualizedComboBox
              placeholder="Select a country"
              label="What country are you in?"
              options={countriesList}
              onRenderLabel={onCountryRenderLabel}
              allowFreeform
              autoComplete="on"
              selectedKey={inputs.country}
              onChange={onComboboxChange('country')}
              styles={comboBoxStyles}
              dropdownMaxWidth={300}
              useComboBoxAsMenuWidth
            />
          )}
        </Stack>
        <Stack grow={2} className={columnClassName}>
          {inputs.domain && inputs.country && (
            <InstallCertificateWithCSR
              domain={inputs.domain as string}
              countryCode={inputs.country as string}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
