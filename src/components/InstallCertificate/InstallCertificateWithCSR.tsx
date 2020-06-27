import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MessageBar,
  MessageBarType,
  ProgressIndicator,
  Stack,
  TextField,
  PrimaryButton,
  Text,
} from '@fluentui/react';
import {
  selectIsGeneratingCSR,
  selectCSRError,
  selectGeneratedCSR,
  sslGenerateCSR,
} from '../../features/ssl/sslSlice';

import { Pre } from '../Pre/Pre';

interface SSLCertificateInstallProps {
  domain: string;
  countryCode: string;
}

export const InstallCertificateWithCSR: React.FunctionComponent<SSLCertificateInstallProps> = ({
  domain,
  countryCode,
}) => {
  const dispatch = useDispatch();
  const isGeneratingCSR = useSelector(selectIsGeneratingCSR);
  const csrError = useSelector(selectCSRError);
  const generatedCSR = useSelector(selectGeneratedCSR);

  useEffect(() => {
    dispatch(sslGenerateCSR(domain, countryCode));
    console.log('GENERATE CSR');
  }, [countryCode, domain, dispatch]);

  return (
    <>
      {csrError && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline>
          {csrError}
        </MessageBar>
      )}
      {isGeneratingCSR && <ProgressIndicator label="Generating CSR..." />}
      {!isGeneratingCSR && generatedCSR && (
        <Stack tokens={{ childrenGap: 'm' }}>
          <Text>
            You will need to provide the certificate provider this Certificate
            Signing Request (CSR):
          </Text>
          <MessageBar messageBarType={MessageBarType.info} isMultiline>
            The CSR is safe to share. It can only be used in combination with a
            secret key stored on this machine.
          </MessageBar>
          <Pre>{generatedCSR}</Pre>
          <Text>
            The certificate provider will then provide you with a TLS/SSL
            certificate. They may also provide you with an intermediate chain.
            Paste each separately into the boxes below:
          </Text>
          <TextField
            label="TLS/SSL certificate:"
            multiline
            rows={6}
            placeholder="-----BEGIN CERTIFICATE-----&#xA;stuff here&#xA;-----END CERTIFICATE-----"
          />
          <TextField
            label="TLS/SSL intermediate chain (if provided):"
            multiline
            rows={6}
            placeholder="-----BEGIN CERTIFICATE-----&#xA;stuff here&#xA;-----END CERTIFICATE-----&#xA;-----BEGIN CERTIFICATE-----&#xA;more stuff here&#xA;-----END CERTIFICATE-----"
          />
          <Stack horizontal>
            <PrimaryButton>Install Certificate</PrimaryButton>
          </Stack>
        </Stack>
      )}
    </>
  );
};
