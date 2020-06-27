import React from 'react';
import { Stack } from '@fluentui/react';

export const Body: React.FunctionComponent = ({ children }) => {
  return (
    <Stack
      as="main"
      tokens={{ childrenGap: 'l1', padding: '0 0 l2 0' }}
      styles={{
        root: {
          maxWidth: 1100,
          width: '100%',
        },
      }}
    >
      {children}
    </Stack>
  );
};
