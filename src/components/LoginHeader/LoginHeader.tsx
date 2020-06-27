import { Image, Stack, Text } from '@fluentui/react';
import React from 'react';
import logo from './logo.png';

export const LoginHeader: React.FunctionComponent = () => {
  return (
    <Stack horizontal horizontalAlign="start" gap="m">
      <Image src={logo} alt="mailinabox login" width={34} />
      <Text block variant="xLarge">
        Mail-in-a-Box Login
      </Text>
    </Stack>
  );
};
