import React from 'react';
import { Stack } from '@fluentui/react';
import { Header } from '../../Header/Header';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SystemChecks } from './SystemChecks/SystemChecks';

export const MainRoute: React.FunctionComponent & { path: string } = () => {
  return (
    <Stack tokens={{ childrenGap: 'l1' }} horizontalAlign="center">
      <Header />
      <Switch>
        <Route exact path={[MainRoute.path, SystemChecks.path]}>
          <SystemChecks />
        </Route>
        <Redirect to="/404" />
      </Switch>
    </Stack>
  );
};

MainRoute.path = '/';
