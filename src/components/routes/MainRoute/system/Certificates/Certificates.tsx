import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  MessageBar,
  MessageBarType,
  ProgressIndicator,
  Text,
  getTheme,
  Pivot,
  PivotItem,
  PivotLinkSize,
} from '@fluentui/react';
import { BodyPanel } from '../../../../BodyPanel/BodyPanel';
import { Body } from '../../../../Body/Body';
import {
  selectIsCheckingSSLStatus,
  selectSSLStatusError,
  sslStatusCheck,
  selectSSLStatus,
} from '../../../../../features/ssl/sslSlice';
import { CertificatesList } from '../../../../CertificatesList/CertificatesList';
import { InstallCertificate } from '../../../../InstallCertificate/InstallCertificate';

const theme = getTheme();

const pivotItemStyles = {
  root: { marginTop: theme.spacing.m },
};

const CertificateSections: React.FunctionComponent = () => {
  const sslStatus = useSelector(selectSSLStatus);
  const items = sslStatus.status;
  return (
    <>
      <Pivot aria-label="Basic Pivot Example" linkSize={PivotLinkSize.large}>
        <PivotItem headerText="Certificate Status">
          <CertificatesList styles={pivotItemStyles} items={items} />
        </PivotItem>
        <PivotItem headerText="Install Custom Certificate">
          <InstallCertificate styles={pivotItemStyles} items={items} />
        </PivotItem>
      </Pivot>
    </>
  );
};

export const Certificates: React.FunctionComponent & {
  path: string;
} = () => {
  const dispatch = useDispatch();
  const isCheckingSSLStatus = useSelector(selectIsCheckingSSLStatus);
  const statusError = useSelector(selectSSLStatusError);

  useEffect(() => {
    dispatch(sslStatusCheck());
  }, [dispatch]);

  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text as="h1" block variant="xLarge">
          TLS (SSL) Certificates
        </Text>
      </Stack>
      <BodyPanel>
        <Text>
          A TLS (formerly called SSL) certificate is a cryptographic file that
          proves to anyone connecting to a web address that the connection is
          secure between you and the owner of that address.
        </Text>
        <Text>
          You need a TLS certificate for this box’s hostname
          (box.proxima-mail.com) (TODO) and every other domain name and
          subdomain that this box is hosting a website for (see the list below).
        </Text>
      </BodyPanel>
      <BodyPanel>
        {statusError && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {statusError}
          </MessageBar>
        )}
        {isCheckingSSLStatus && (
          <ProgressIndicator label="Checking certificate status..." />
        )}
        {!isCheckingSSLStatus && !statusError && <CertificateSections />}
      </BodyPanel>
    </Body>
  );
};

Certificates.path = '/system/ssl';
