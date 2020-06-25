/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextField,
  Stack,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
} from '@fluentui/react';

import {
  performLogin,
  selectIsLoggingIn,
  selectLoginError,
  resetLoginError,
} from '../../../../features/loginSlice';

const setter = (set: React.Dispatch<React.SetStateAction<string>>) => (
  _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  newValue?: string | undefined
) => {
  if (newValue) {
    set(newValue);
  }
};

export const LoginForm: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const isLogginIn = useSelector(selectIsLoggingIn);
  const loginError = useSelector(selectLoginError);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(performLogin());
      }}
    >
      <Stack gap="20">
        {loginError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={() => dispatch(resetLoginError())}
            dismissButtonAriaLabel="Close"
          >
            Incorrect email or password
          </MessageBar>
        )}
        <Stack gap="10">
          <TextField
            label="Email"
            value={email}
            autoFocus
            required
            type="email"
            disabled={isLogginIn}
            onChange={setter(setEmail)}
          />
          <TextField
            label="Password"
            value={password}
            required
            type="password"
            disabled={isLogginIn}
            onChange={setter(setPassword)}
          />
        </Stack>
        <Stack horizontalAlign="start" horizontal gap="10">
          <PrimaryButton type="submit" text="Submit" />{' '}
          {isLogginIn && <Spinner size={SpinnerSize.medium} />}
        </Stack>
      </Stack>
    </form>
  );
};
