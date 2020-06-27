import React from 'react';
import { Stack } from '@fluentui/react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Header } from '../../Header/Header';
import { StatusChecks } from './system/StatusChecks/StatusChecks';
import { Certificates } from './system/Certificates/Certificates';

export const MainRoute: React.FunctionComponent & { path: string } = () => {
  console.log('main route');
  return (
    <Stack tokens={{ childrenGap: 'l1' }} horizontalAlign="center">
      <Header />
      <Switch>
        <Route exact path={[MainRoute.path, StatusChecks.path]}>
          <StatusChecks />
        </Route>
        <Route exact path={Certificates.path}>
          <Certificates />
        </Route>
        <Redirect to="/404" />
      </Switch>
    </Stack>
  );
};

MainRoute.path = '/';
