import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MainRoute } from '../routes/MainRoute/MainRoute';
import { LoginRoute } from '../routes/LoginRoute/LoginRoute';
import { PrivateRoute } from '../routes/PrivateRoute/PrivateRoute';

export const App: React.FunctionComponent = () => {
  return (
    <Router>
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
