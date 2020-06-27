import { Stack } from '@fluentui/react';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Header } from '../../Header/Header';
import { Backups } from './system/Backups/Backups';
import { Certificates } from './system/Certificates/Certificates';
import { StatusChecks } from './system/StatusChecks/StatusChecks';

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
        <Redirect to="/404" />
      </Switch>
    </Stack>
  );
};

MainRoute.path = '/';
