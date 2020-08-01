import {
  Breadcrumb,
  getTheme,
  mergeStyles,
  MessageBar,
  MessageBarType,
  PivotItem,
  ProgressIndicator,
  Stack,
  Text,
} from '@fluentui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import {
  getSSLStatus,
  resetSSLAction,
  SSLActionType,
} from '../../../../../features/sslSlice';
import { RootState } from '../../../../../store';
import { Body } from '../../../../ui/Body/Body';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { CertificatesList } from '../../../../ui/CertificatesList/CertificatesList';
import { InstallCertificate } from '../../../../ui/InstallCertificate/InstallCertificate';
import { PivotRoutes } from '../../../../ui/PivotRoutes/PivotRoutes';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

enum SectionKeys {
  status = '',
  install = '/install',
}

const CertificateSections: React.FunctionComponent = () => {
  const { sslStatus, sslAction } = useSelector((state: RootState) => state.ssl);
  const { status: items } = sslStatus;
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { path, url } = useRouteMatch();

  useEffect(() => {
    if (sslAction?.type === SSLActionType.install) {
      history.push(`${url}${SectionKeys.install}`);
    }
  }, [history, sslAction, url]);

  useEffect(() => {
    if (location.pathname === url) {
      dispatch(resetSSLAction());
    }
  }, [dispatch, location.pathname, url]);

  return (
    <>
      <PivotRoutes>
        <PivotItem itemKey={url} headerText="Certificate Status" />
        <PivotItem
          itemKey={`${url}${SectionKeys.install}`}
          headerText="Install Custom Certificate"
        />
      </PivotRoutes>
      <Switch>
        <Route exact path={path}>
          <CertificatesList className={className} items={items} />
        </Route>
        <Route exact path={`${path}${SectionKeys.install}`}>
          <InstallCertificate className={className} items={items} />
        </Route>
      </Switch>
    </>
  );
};

export const CertificatesRoute: React.FunctionComponent & {
  path: string;
} = () => {
  const { isGettingStatus, getStatusError, sslStatus } = useSelector(
    (state: RootState) => state.ssl
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!sslStatus.status.length) {
      dispatch(getSSLStatus());
    }
  }, [dispatch, sslStatus.status.length]);

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
        {getStatusError && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {getStatusError}
          </MessageBar>
        )}
        {isGettingStatus && (
          <ProgressIndicator label="Checking certificate status..." />
        )}
        {!isGettingStatus && !getStatusError && <CertificateSections />}
      </BodyPanel>
    </Body>
  );
};

CertificatesRoute.path = '/system/ssl';
