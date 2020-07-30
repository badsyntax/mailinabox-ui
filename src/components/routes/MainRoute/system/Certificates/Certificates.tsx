import {
  Breadcrumb,
  getTheme,
  mergeStyles,
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  PivotLinkSize,
  ProgressIndicator,
  Stack,
  Text,
} from '@fluentui/react';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetSSLAction,
  selectIsCheckingSSLStatus,
  selectSSLAction,
  selectSSLStatus,
  selectSSLStatusError,
  SSLActionType,
  sslStatusCheck,
} from '../../../../../features/sslSlice';
import { Body } from '../../../../ui/Body/Body';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { CertificatesList } from '../../../../ui/CertificatesList/CertificatesList';
import { InstallCertificate } from '../../../../ui/InstallCertificate/InstallCertificate';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

enum SectionKeys {
  status = 'section-status',
  install = 'section-install',
}

const CertificateSections: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { status: items } = useSelector(selectSSLStatus);
  const sslAction = useSelector(selectSSLAction);

  const onPivotLinkClick = useCallback(
    (item?: PivotItem, ev?: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (item?.props.itemKey === SectionKeys.status) {
        dispatch(resetSSLAction());
      }
    },
    [dispatch]
  );

  const selectedKey =
    sslAction?.type === SSLActionType.install ? SectionKeys.install : undefined;
  return (
    <>
      <Pivot
        linkSize={PivotLinkSize.large}
        selectedKey={selectedKey}
        onLinkClick={onPivotLinkClick}
      >
        <PivotItem headerText="Certificate Status" itemKey={SectionKeys.status}>
          <CertificatesList className={className} items={items} />
        </PivotItem>
        <PivotItem
          headerText="Install Custom Certificate"
          itemKey={SectionKeys.install}
        >
          <InstallCertificate className={className} items={items} />
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
        <Breadcrumb
          onReduceData={(): undefined => undefined}
          styles={{
            root: {
              marginTop: 0,
            },
          }}
          items={[
            {
              text: 'System',
              key: 'system',
            },
            {
              text: 'TLS (SSL) Certificates',
              key: 'certificates',
              as: 'h1',
            },
          ]}
        />
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
