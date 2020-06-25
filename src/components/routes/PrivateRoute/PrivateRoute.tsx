import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../../features/authSlice';
import { LoginRoute } from '../LoginRoute/LoginRoute';

export const PrivateRoute: React.FunctionComponent<RouteProps> = ({
  children,
  ...rest
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: LoginRoute.path,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
