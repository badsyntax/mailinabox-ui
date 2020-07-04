import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { storageAuth } from '../../../auth';
import { authUpdate } from '../../../features/authSlice';

export const LogoutRoute: React.FunctionComponent & { path: string } = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    storageAuth.clear();
    dispatch(
      authUpdate({ username: '', password: '', isAuthenticated: false })
    );
  });
  return null;
};

LogoutRoute.path = '/logout';
