import React from 'react';
import { Stack, mergeStyles, getTheme } from '@fluentui/react';
import { LoginHeader } from '../../LoginHeader/LoginHeader';
import { LoginForm } from '../../LoginForm/LoginForm';

const className = mergeStyles({
  padding: 25,
  boxShadow: getTheme().effects.elevation8,
  backgroundColor: getTheme().palette.white,
});

export const LoginRoute: React.FunctionComponent & { path: string } = () => {
  return (
    <Stack
      className={className}
      verticalAlign="center"
      tokens={{ childrenGap: 15 }}
      styles={{
        root: {
          width: '420px',
        },
      }}
    >
      <LoginHeader />
      <LoginForm />
    </Stack>
  );
};

LoginRoute.path = '/login';
