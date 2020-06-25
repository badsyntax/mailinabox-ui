/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  TextField,
  Stack,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Checkbox,
  BaseButton,
  Button,
  AnimationStyles,
} from '@fluentui/react';

import {
  selectIsLoggingIn,
  selectLoginError,
  loginResetError,
  loginCheck,
} from '../../features/loginSlice';
import { authUpdate, selectIsAuthenticated } from '../../features/authSlice';
import { HomeRoute } from '../routes/HomeRoute/HomeRoute';

export const LoginForm: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const isLogginIn = useSelector(selectIsLoggingIn);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loginError = useSelector(selectLoginError);

  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onRememberChange = useCallback(
    (ev?: React.FormEvent<HTMLElement>, checked?: boolean): void => {
      setRemember(!!checked);
    },
    []
  );
  const onEmailChange = useCallback(
    (ev: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setEmail(newValue ?? '');
    },
    []
  );
  const onPasswordChange = useCallback(
    (ev: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setPassword(newValue ?? '');
    },
    []
  );
  const onMessageBarDismiss = useCallback(
    (
      ev?:
        | React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
        | undefined
    ): void => {
      dispatch(loginResetError());
    },
    [dispatch]
  );

  useEffect(() => {
    if (isAuthenticated) {
      history.push(HomeRoute.path);
    } else {
      dispatch(authUpdate({ username: email, password }));
    }
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(loginResetError());
        dispatch(loginCheck(remember));
      }}
    >
      <Stack tokens={{ childrenGap: 20 }}>
        {loginError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={onMessageBarDismiss}
            dismissButtonAriaLabel="Close"
            styles={{
              root: {
                ...AnimationStyles.fadeIn500,
              },
            }}
          >
            {loginError}
          </MessageBar>
        )}
        <Stack tokens={{ childrenGap: 10 }}>
          <TextField
            label="Email"
            value={email}
            required
            type="email"
            autoFocus
            onChange={onEmailChange}
          />
          <TextField
            label="Password"
            value={password}
            required
            type="password"
            onChange={onPasswordChange}
          />
          <Checkbox
            label="Remember me"
            checked={remember}
            onChange={onRememberChange}
          />
        </Stack>
        <Stack
          horizontalAlign="end"
          verticalAlign="center"
          horizontal
          tokens={{ childrenGap: 10 }}
        >
          {isLogginIn && <Spinner size={SpinnerSize.medium} />}
          <PrimaryButton type="submit" text="Sign in" />
        </Stack>
      </Stack>
    </form>
  );
};
