import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../../../router';
import { LoginRoute } from '../../routes/LoginRoute/LoginRoute';
import { MainRoute } from '../../routes/MainRoute/MainRoute';
import { PrivateRoute } from '../../routes/PrivateRoute/PrivateRoute';

export const App: React.FunctionComponent = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path={LoginRoute.path}>
          <LoginRoute />
        </Route>
        <Route exact path="/404">
          Not Found
        </Route>
        <PrivateRoute path={MainRoute.path}>
          <MainRoute />
        </PrivateRoute>
      </Switch>
    </Router>
  );
};
