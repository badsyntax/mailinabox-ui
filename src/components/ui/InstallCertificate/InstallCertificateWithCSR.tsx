import {
  BaseButton,
  Dialog,
  DialogFooter,
  DialogType,
  IDialogContentProps,
  IModalProps,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  ProgressIndicator,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { SSLCertificateInstallRequest } from 'mailinabox-api';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  generateCSR,
  installCertificate,
  installCertificateReset,
  selectCSRError,
  selectGeneratedCSRResponse,
  selectInstallCertificateError,
  selectInstallCertificateResponse,
  selectIsGeneratingCSR,
  selectIsInstallingCertificate,
  sslStatusCheck,
} from '../../../features/sslSlice';
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

export const InstallCertificateWithCSR: React.FunctionComponent<SSLCertificateInstallProps> = ({
  domain,
  countryCode,
}) => {
  const dispatch = useDispatch();
  const isGeneratingCSR = useSelector(selectIsGeneratingCSR);
  const csrError = useSelector(selectCSRError);
  const generatedCSR = useSelector(selectGeneratedCSRResponse);
  const isInstallingCertificate = useSelector(selectIsInstallingCertificate);
  const installCertificateError = useSelector(selectInstallCertificateError);
  const installCertificateResponse = useSelector(
    selectInstallCertificateResponse
  );

  const [installCertificateRequest, setInstallCertificateRequest] = useState<
    SSLCertificateInstallRequest
  >({
    ...defaultInstallCertificateRequest,
    domain,
  });
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);

  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);

  const onDialogClose = useCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    },
    []
  );

  const onDialogDismissed = useCallback((): void => {
    const installCertificateSuccess = installOkRegEx.test(
      installCertificateResponse || ''
    );
    if (installCertificateSuccess) {
      setInstallCertificateRequest({
        ...defaultInstallCertificateRequest,
        domain,
      });
      dispatch(sslStatusCheck());
    }
    dispatch(installCertificateReset());
    setHasDialogOpened(false);
  }, [dispatch, domain, installCertificateResponse]);

  const onCertChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setInstallCertificateRequest({
        ...installCertificateRequest,
        cert: newValue ?? '',
      });
    },
    [installCertificateRequest]
  );

  const onChainChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setInstallCertificateRequest({
        ...installCertificateRequest,
        chain: newValue ?? '',
      });
    },
    [installCertificateRequest]
  );

  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLElement>): void => {
      event.preventDefault();
      dispatch(installCertificate(installCertificateRequest));
    },
    [dispatch, installCertificateRequest]
  );

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

  const error = csrError || installCertificateError;

  const dialogContent = installOkRegEx.test(installCertificateResponse || '')
    ? 'Certificate has been installed. Check that you have no connection problems to the domain.'
    : installCertificateResponse;

  return (
    <>
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
      {!isGeneratingCSR && generatedCSR && (
        <Stack gap="m" as="form" onSubmit={onFormSubmit}>
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
            required
          />
          <Stack horizontal>
            <PrimaryButton type="submit" disabled={isInstallingCertificate}>
              Install Certificate
            </PrimaryButton>
          </Stack>
        </Stack>
      )}
    </>
  );
};
