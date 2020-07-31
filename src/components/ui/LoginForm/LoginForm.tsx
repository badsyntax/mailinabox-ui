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
import { updateAuth } from '../../../features/authSlice';
// import { authUpdate, selectIsAuthenticated } from '../../../features/authSlice';
import { loginCheck, loginResetError } from '../../../features/loginSlice';
import { RootState } from '../../../store';
import { MainRoute } from '../../routes/MainRoute/MainRoute';
import { MessageBar } from '../MessageBar/MessageBar';

export const LoginForm: React.FunctionComponent = () => {
  const { isLoggingIn, loginError } = useSelector(
    (state: RootState) => state.login
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

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
      ev?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
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
      dispatch(updateAuth({ username: email, password }));
    }
  });
  return (
    <Stack as="form" gap="m" onSubmit={onFormSubmit}>
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
        {isLoggingIn && <Spinner size={SpinnerSize.medium} />}
        <PrimaryButton type="submit" text="Sign in" disabled={isLoggingIn} />
      </Stack>
    </Stack>
  );
};
