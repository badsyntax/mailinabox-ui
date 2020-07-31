import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { RootState } from '../../../store';
import { LoginRoute } from '../LoginRoute/LoginRoute';

export const PrivateRoute: React.FunctionComponent<RouteProps> = ({
  children,
  ...rest
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }): React.ReactNode =>
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
