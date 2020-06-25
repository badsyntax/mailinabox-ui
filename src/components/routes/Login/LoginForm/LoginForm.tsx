import React from 'react';
import { TextField, Stack, PrimaryButton } from '@fluentui/react';

export const LoginForm: React.FunctionComponent = () => {
  return (
    <form>
      <Stack gap="20">
        <Stack gap="10">
          <TextField label="Email" autoFocus required type="email" />
          <TextField label="Password" required type="password" />
        </Stack>
        <Stack horizontalAlign="start">
          <PrimaryButton type="submit" text="Submit" />
        </Stack>
      </Stack>
    </form>
  );
};
