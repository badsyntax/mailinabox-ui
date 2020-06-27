/* eslint-disable @typescript-eslint/no-empty-function */
import {
  BaseButton,
  Button,
  Checkbox,
  MessageBarType,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  TextField,
} from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authUpdate, selectIsAuthenticated } from '../../features/authSlice';
import {
  loginCheck,
  loginResetError,
  selectIsLoggingIn,
  selectLoginError,
} from '../../features/loginSlice';
import { MessageBar } from '../MessageBar/MessageBar';
import { MainRoute } from '../routes/MainRoute/MainRoute';

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
  const onFormSubmit = useCallback(
    (ev: React.FormEvent<HTMLElement>): void => {
      ev.preventDefault();
      dispatch(loginResetError());
      dispatch(loginCheck(remember));
    },
    [dispatch, remember]
  );

  useEffect(() => {
    if (isAuthenticated) {
      history.push(MainRoute.path);
    } else {
      dispatch(authUpdate({ username: email, password }));
    }
  });
  return (
    <form onSubmit={onFormSubmit}>
      <Stack gap="m">
        {loginError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={onMessageBarDismiss}
            dismissButtonAriaLabel="Close"
          >
            {loginError}
          </MessageBar>
        )}
        <Stack gap="m">
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
        <Stack horizontalAlign="end" verticalAlign="center" horizontal gap="s1">
          {isLogginIn && <Spinner size={SpinnerSize.medium} />}
          <PrimaryButton type="submit" text="Sign in" disabled={isLogginIn} />
        </Stack>
      </Stack>
    </form>
  );
};
