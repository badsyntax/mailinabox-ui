import { AnimationStyles, getTheme, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';
import { LoginForm } from '../../LoginForm/LoginForm';
import { LoginHeader } from '../../LoginHeader/LoginHeader';

const className = mergeStyles({
  maxWidth: 420,
  boxShadow: getTheme().effects.elevation8,
  backgroundColor: getTheme().palette.white,
  ...AnimationStyles.slideUpIn20,
  animationDuration: '1s',
});

export const LoginRoute: React.FunctionComponent & { path: string } = () => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      horizontal
      padding="l1"
    >
      <Stack
        grow={1}
        className={className}
        verticalAlign="center"
        gap="m"
        padding="l1"
      >
        <LoginHeader />
        <LoginForm />
      </Stack>
    </Stack>
  );
};

LoginRoute.path = '/login';
