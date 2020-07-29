import { Stack } from '@fluentui/react';
import React from 'react';

export const Body: React.FunctionComponent = ({ children }) => {
  return (
    <Stack
      as="main"
      gap="l1"
      padding="0 0 l2 0"
      styles={{
        root: {
          maxWidth: 1170,
          width: '100%',
        },
      }}
    >
      {children}
    </Stack>
  );
};
