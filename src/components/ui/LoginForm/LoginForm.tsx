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
import { MeAuthStatus, MeResponse } from 'mailinabox-api';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userApi } from '../../../api';
import { useRequest } from '../../../api/useRequest';
import { updateAuth } from '../../../features/authSlice';
import { RootState } from '../../../store';
import { MainRoute } from '../../routes/MainRoute/MainRoute';
import { MessageBar } from '../MessageBar/MessageBar';

export const LoginForm: React.FunctionComponent = () => {
  const [
    checkLogin,
    { isLoading, response, error: requestError, setError, setResponse },
  ] = useRequest<MeResponse>(
    () => userApi.getMe(),
    (response: MeResponse) => {
      if (response.status !== MeAuthStatus.Ok) {
        setError(response.reason || 'Unknown authentication error');
      } else if (!response.apiKey) {
        setError('You are not an administrator on this system.');
      } else {
        setResponse(response);
      }
    }
  );
  const { isAuthenticated, error: authError } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onRememberChange = useCallback(
    (_event?: React.FormEvent<HTMLElement>, checked?: boolean): void => {
      setRemember(!!checked);
    },
    []
  );
  const onEmailChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setEmail(newValue ?? '');
    },
    []
  );
  const onPasswordChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setPassword(newValue ?? '');
    },
    []
  );
  const onMessageBarDismiss = useCallback(
    (
      _event?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
    ): void => {
      setError(null);
      dispatch(
        updateAuth({
          username: email,
          password,
          error: null,
        })
      );
    },
    [dispatch, email, password, setError]
  );
  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLElement>): void => {
      event.preventDefault();
      setError(null);
      checkLogin();
    },
    [checkLogin, setError]
  );

  useEffect(() => {
    if (isAuthenticated) {
      history.push(MainRoute.path);
    } else {
      dispatch(
        updateAuth({
          username: email,
          password,
          isAuthenticated: false,
          error: authError,
        })
      );
    }
  }, [authError, dispatch, email, history, isAuthenticated, password]);

  useEffect(() => {
    if (response) {
      dispatch(
        updateAuth({
          username: response.email,
          password: response.apiKey,
          isAuthenticated: true,
          authError: null,
          remember,
        })
      );
    }
  }, [dispatch, remember, response]);

  const error = requestError || authError;

  return (
    <Stack as="form" gap="m" onSubmit={onFormSubmit}>
      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          onDismiss={onMessageBarDismiss}
          dismissButtonAriaLabel="Close"
        >
          {error}
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
        {isLoading && <Spinner size={SpinnerSize.medium} />}
        <PrimaryButton type="submit" text="Sign in" disabled={isLoading} />
      </Stack>
    </Stack>
  );
};
