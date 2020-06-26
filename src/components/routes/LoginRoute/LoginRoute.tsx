import React from 'react';
import { Stack, mergeStyles, getTheme, AnimationStyles } from '@fluentui/react';
import { LoginHeader } from '../../LoginHeader/LoginHeader';
import { LoginForm } from '../../LoginForm/LoginForm';

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
      tokens={{ padding: 'l1' }}
    >
      <Stack
        grow={1}
        className={className}
        verticalAlign="center"
        tokens={{ childrenGap: 'm', padding: 'l1' }}
      >
        <LoginHeader />
        <LoginForm />
      </Stack>
    </Stack>
  );
};

LoginRoute.path = '/login';
