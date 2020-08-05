import { Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { RootState } from '../../../store';
import { Header } from '../../ui/Header/Header';
import { LoginRoute } from '../LoginRoute/LoginRoute';
import { LogoutRoute } from '../LogoutRoute/LogoutRoute';
import { AliasesRoute } from './mail/AliasesRoute/AliasesRoute';
import { InstructionsRoute } from './mail/InstructionsRoute/InstructionsRoute';
import { UsersRoute } from './mail/UsersRoute/UsersRoute';
import { SyncGuideRoute } from './SyncGuideRoute/SyncGuideRoute';
import { BackupsRoute } from './system/BackupsRoute/BackupsRoute';
import { CertificatesRoute } from './system/CertificatesRoute/CertificatesRoute';
import { CustomDnsRoute } from './system/CustomDnsRoute/CustomDnsRoute';
import { ExternalDnsRoute } from './system/ExternalDnsRoute/ExternalDnsRoute';
import { StatusChecksRoute } from './system/StatusChecksRoute/StatusChecksRoute';
import { WebRoute } from './WebRoute/WebRoute';

export const MainRoute: React.FunctionComponent & { path: string } = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== LoginRoute.path) {
      history.push(LoginRoute.path);
    }
  }, [history, isAuthenticated, location.pathname]);

  return (
    <Stack gap="l1" horizontalAlign="center">
      <Header />
      <Switch>
        <Route exact path={[MainRoute.path, StatusChecksRoute.path]}>
          <StatusChecksRoute />
        </Route>
        <Route path={CertificatesRoute.path}>
          <CertificatesRoute />
        </Route>
        <Route path={BackupsRoute.path}>
          <BackupsRoute />
        </Route>
        <Route path={CustomDnsRoute.path}>
          <CustomDnsRoute />
        </Route>
        <Route path={ExternalDnsRoute.path}>
          <ExternalDnsRoute />
        </Route>
        <Route exact path={InstructionsRoute.path}>
          <InstructionsRoute />
        </Route>
        <Route path={UsersRoute.path}>
          <UsersRoute />
        </Route>
        <Route path={AliasesRoute.path}>
          <AliasesRoute />
        </Route>
        <Route exact path={SyncGuideRoute.path}>
          <SyncGuideRoute />
        </Route>
        <Route path={WebRoute.path}>
          <WebRoute />
        </Route>
        <Route exact path={LogoutRoute.path}>
          <LogoutRoute />
        </Route>
        <Redirect to="/404" />
      </Switch>
    </Stack>
  );
};

MainRoute.path = '/';
