import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Stack } from '@fluentui/react';
import { HomeRoute } from '../routes/HomeRoute/HomeRoute';
import { LoginRoute } from '../routes/LoginRoute/LoginRoute';
import { PrivateRoute } from '../routes/PrivateRoute/PrivateRoute';

export const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        verticalFill
        tokens={{ childrenGap: 15 }}
      >
        <Switch>
          <Route exact path={LoginRoute.path}>
            <LoginRoute />
          </Route>
          <PrivateRoute exact path={HomeRoute.path}>
            <HomeRoute />
          </PrivateRoute>
          <Route>Not Found</Route>
        </Switch>
      </Stack>
    </Router>
  );
};
