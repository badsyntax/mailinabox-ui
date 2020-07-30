import { Stack } from '@fluentui/react';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Header } from '../../ui/Header/Header';
import { LogoutRoute } from '../LogoutRoute/LogoutRoute';
import { Aliases } from './mail/Aliases/Aliases';
import { Instructions } from './mail/Instructions/Instructions';
import { Users } from './mail/Users/Users';
import { SyncGuide } from './SyncGuide/SyncGuide';
import { Backups } from './system/Backups/Backups';
import { Certificates } from './system/Certificates/Certificates';
import { CustomDns } from './system/CustomDns/CustomDns';
import { ExternalDns } from './system/ExternalDns/ExternalDns';
import { StatusChecks } from './system/StatusChecks/StatusChecks';
import { Web } from './Web/Web';

export const MainRoute: React.FunctionComponent & { path: string } = () => {
  return (
    <Stack gap="l1" horizontalAlign="center">
      <Header />
      <Switch>
        <Route exact path={[MainRoute.path, StatusChecks.path]}>
          <StatusChecks />
        </Route>
        <Route exact path={Certificates.path}>
          <Certificates />
        </Route>
        <Route exact path={Backups.path}>
          <Backups />
        </Route>
        <Route exact path={CustomDns.path}>
          <CustomDns />
        </Route>
        <Route exact path={ExternalDns.path}>
          <ExternalDns />
        </Route>
        <Route exact path={Instructions.path}>
          <Instructions />
        </Route>
        <Route exact path={Users.path}>
          <Users />
        </Route>
        <Route exact path={Aliases.path}>
          <Aliases />
        </Route>
        <Route exact path={SyncGuide.path}>
          <SyncGuide />
        </Route>
        <Route exact path={Web.path}>
          <Web />
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
