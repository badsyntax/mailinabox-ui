import {
  BaseButton,
  Dialog,
  DialogFooter,
  DialogType,
  IDialogContentProps,
  IModalProps,
  IStackProps,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  ProgressIndicator,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import { SSLCertificateInstallRequest } from 'mailinabox-api';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  generateCSR,
  getSSLStatus,
  installCertificate,
  installCertificateReset,
} from '../../../features/sslSlice';
import { RootState } from '../../../store';
import { Pre } from '../Pre/Pre';

interface SSLCertificateInstallProps {
  domain: string;
  countryCode: string;
}

const dialogContentProps: IDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'TLS Certificate Installation',
};

const modalProps: IModalProps = {
  isBlocking: true,
};

const defaultInstallCertificateRequest: SSLCertificateInstallRequest = {
  domain: '',
  cert: '',
  chain: '',
};

const installOkRegEx = /^OK($|\n)/;

export const InstallCertificateWithCSR: React.FunctionComponent<
  IStackProps & SSLCertificateInstallProps
> = ({ domain, countryCode, ...props }) => {
  const {
    isGeneratingCSR,
    generateCSRError,
    generateCSRResponse,
    isInstallingCertificate,
    installCertificateError,
    installCertificateResponse,
  } = useSelector((state: RootState) => state.ssl);
  const dispatch = useDispatch();

  const [installCertificateRequest, setInstallCertificateRequest] =
    useState<SSLCertificateInstallRequest>({
      ...defaultInstallCertificateRequest,
      domain,
    });
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);

  const onDialogClose = useConstCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    }
  );

  const onDialogDismissed = (): void => {
    const installCertificateSuccess = installOkRegEx.test(
      installCertificateResponse || ''
    );
    if (installCertificateSuccess) {
      setInstallCertificateRequest({
        ...defaultInstallCertificateRequest,
        domain,
      });
      dispatch(getSSLStatus());
    }
    dispatch(installCertificateReset());
    setHasDialogOpened(false);
  };

  const onCertChange = (
    _event: React.FormEvent<HTMLElement>,
    newValue?: string
  ): void => {
    setInstallCertificateRequest({
      ...installCertificateRequest,
      cert: newValue ?? '',
    });
  };

  const onChainChange = (
    _event: React.FormEvent<HTMLElement>,
    newValue?: string
  ): void => {
    setInstallCertificateRequest({
      ...installCertificateRequest,
      chain: newValue ?? '',
    });
  };

  const onFormSubmit = (event: React.FormEvent<HTMLElement>): void => {
    event.preventDefault();
    dispatch(installCertificate(installCertificateRequest));
  };

  useEffect(() => {
    if (installCertificateResponse && isDialogHidden && !hasDialogOpened) {
      setIsDialogHidden(false);
    }
  }, [installCertificateResponse, hasDialogOpened, isDialogHidden]);

  useEffect(() => {
    if (!isDialogHidden) {
      setHasDialogOpened(true);
    }
  }, [isDialogHidden]);

  useEffect(() => {
    dispatch(generateCSR(domain, countryCode));
  }, [countryCode, domain, dispatch]);

  const error = generateCSRError || installCertificateError;

  const dialogContent = installOkRegEx.test(installCertificateResponse || '')
    ? 'Certificate has been installed. Check that you have no connection problems to the domain.'
    : installCertificateResponse;

  return (
    <Stack {...props}>
      <Dialog
        hidden={isDialogHidden}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
        minWidth={480}
        maxWidth={480}
        onDismissed={onDialogDismissed}
      >
        <Text>{dialogContent}</Text>
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onDialogClose} />
        </DialogFooter>
      </Dialog>
      {error && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline>
          {error}
        </MessageBar>
      )}
      {isGeneratingCSR && <ProgressIndicator label="Generating CSR..." />}
      {!isGeneratingCSR && generateCSRResponse && (
        <Stack gap="m" as="form" onSubmit={onFormSubmit}>
          <Text>
            You will need to provide the certificate provider this Certificate
            Signing Request (CSR):
          </Text>
          <MessageBar messageBarType={MessageBarType.info} isMultiline>
            The CSR is safe to share. It can only be used in combination with a
            secret key stored on this machine.
          </MessageBar>
          <Pre>{generateCSRResponse}</Pre>
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
            value={installCertificateRequest.cert}
            onChange={onCertChange}
            required
          />
          <TextField
            label="TLS/SSL intermediate chain (if provided):"
            multiline
            rows={6}
            placeholder="-----BEGIN CERTIFICATE-----&#xA;stuff here&#xA;-----END CERTIFICATE-----&#xA;-----BEGIN CERTIFICATE-----&#xA;more stuff here&#xA;-----END CERTIFICATE-----"
            value={installCertificateRequest.chain}
            onChange={onChainChange}
          />
          <Stack horizontal>
            <PrimaryButton type="submit" disabled={isInstallingCertificate}>
              Install Certificate
            </PrimaryButton>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
