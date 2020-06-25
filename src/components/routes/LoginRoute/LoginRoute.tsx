import React from 'react';
import { Stack, mergeStyles, getTheme, AnimationStyles } from '@fluentui/react';
import { LoginHeader } from '../../LoginHeader/LoginHeader';
import { LoginForm } from '../../LoginForm/LoginForm';

const className = mergeStyles({
  padding: 25,
  width: 420,
  boxShadow: getTheme().effects.elevation8,
  backgroundColor: getTheme().palette.white,
  ...AnimationStyles.fadeIn200,
});

export const LoginRoute: React.FunctionComponent & { path: string } = () => {
  return (
    <Stack
      className={className}
      verticalAlign="center"
      tokens={{ childrenGap: 15 }}
    >
      <LoginHeader />
      <LoginForm />
    </Stack>
  );
};

LoginRoute.path = '/login';
