import { getTheme, Spinner, SpinnerSize, Stack } from '@fluentui/react';
import React from 'react';

const theme = getTheme();

interface DialogFooterProps {
  isLoading?: boolean;
}

export const DialogFooter: React.FunctionComponent<DialogFooterProps> = ({
  children,
  isLoading = false,
}) => {
  return (
    <Stack
      horizontalAlign="end"
      verticalAlign="center"
      horizontal
      gap="s1"
      styles={{
        root: {
          marginTop: theme.spacing.m,
        },
      }}
    >
      {isLoading && <Spinner size={SpinnerSize.medium} />}
      {children}
    </Stack>
  );
};
