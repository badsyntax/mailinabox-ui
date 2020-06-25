import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Stack } from '@fluentui/react';
import { Home } from '../routes/Home/Home';
import { Login } from '../routes/Login/Login';

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
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route>Not Found</Route>
        </Switch>
      </Stack>
    </Router>
  );
};
