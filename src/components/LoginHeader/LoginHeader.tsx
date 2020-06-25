import React from 'react';
import { Text, Image, Stack } from '@fluentui/react';

import logo from './logo.png';

export const LoginHeader: React.FunctionComponent = () => {
  return (
    <Stack horizontal tokens={{ childrenGap: 10 }}>
      <Image src={logo} alt="mailinabox login" width={34} />
      <Text block variant="xLarge">
        Mail-in-a-Box Login
      </Text>
    </Stack>
  );
};
