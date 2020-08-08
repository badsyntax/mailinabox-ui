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
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userApi } from '../../../api';
import { useRequest } from '../../../api/useRequest';
import { config } from '../../../config';
import { updateAuth } from '../../../features/authSlice';
import { useFormInputs } from '../../../forms/useFormInputs';
import { RootState } from '../../../store';
import { MainRoute } from '../../routes/MainRoute/MainRoute';
import { MessageBar } from '../MessageBar/MessageBar';

type FormState = {
  email: string;
  password: string;
  remember: boolean;
};

const initialFormState: FormState = {
  email: config.mockApi ? 'demo@example.com' : '',
  password: config.mockApi ? 'mailinabox' + Math.random().toString(16) : '',
  remember: true,
};

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
  const { inputs, setInputs, onInputChange } = useFormInputs<FormState>(
    initialFormState
  );
  const { isAuthenticated, error: authError } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const onRememberChange = (
    _event?: React.FormEvent<HTMLElement>,
    checked?: boolean
  ): void => {
    setInputs({
      ...inputs,
      remember: !!checked,
    });
  };

  const onMessageBarDismiss = (
    _event?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
  ): void => {
    setError(null);
    dispatch(
      updateAuth({
        username: inputs.email,
        password: inputs.password,
        error: null,
      })
    );
  };

  const onFormSubmit = (event: React.FormEvent<HTMLElement>): void => {
    event.preventDefault();
    setError(null);
    checkLogin();
  };

  useEffect(() => {
    if (isAuthenticated) {
      history.push(MainRoute.path);
    } else {
      dispatch(
        updateAuth({
          username: inputs.email,
          password: inputs.password,
          isAuthenticated: false,
          error: authError,
        })
      );
    }
  }, [
    authError,
    dispatch,
    history,
    inputs.email,
    inputs.password,
    isAuthenticated,
  ]);

  useEffect(() => {
    if (response) {
      dispatch(
        updateAuth({
          username: response.email,
          password: response.apiKey,
          isAuthenticated: true,
          authError: null,
          remember: inputs.remember,
        })
      );
    }
  }, [dispatch, inputs.remember, response]);

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
          value={inputs.email}
          required
          type="email"
          name="email"
          autoFocus
          onChange={onInputChange}
        />
        <TextField
          label="Password"
          value={inputs.password}
          name="password"
          required
          type="password"
          onChange={onInputChange}
        />
        <Checkbox
          label="Remember me"
          checked={inputs.remember}
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
