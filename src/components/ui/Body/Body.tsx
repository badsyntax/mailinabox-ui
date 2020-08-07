import { ScreenWidthMinMedium, Stack } from '@fluentui/react';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

export const Body: React.FunctionComponent = ({ children }) => {
  const isMinMediumScreen = useMediaQuery({
    minWidth: ScreenWidthMinMedium,
  });

  const nonMobileContainerProps = {
    gap: isMinMediumScreen ? 'l1' : undefined,
    padding: isMinMediumScreen ? '0 m l2 m' : '0 m m m ',
  };
  return (
    <Stack
      as="main"
      styles={{
        root: {
          maxWidth: 1170,
          width: '100%',
        },
      }}
      {...nonMobileContainerProps}
    >
      {children}
    </Stack>
  );
};
