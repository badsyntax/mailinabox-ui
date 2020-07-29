import {
  AnimationStyles,
  getTheme,
  IStackProps,
  mergeStyles,
  Stack,
} from '@fluentui/react';
import React from 'react';

const className = mergeStyles({
  boxShadow: getTheme().effects.elevation8,
  backgroundColor: getTheme().palette.white,
  ...AnimationStyles.fadeIn200,
});

export const BodyPanel: React.FunctionComponent<IStackProps> = ({
  children,
  ...props
}) => {
  return (
    <Stack as="section" padding="m" gap="m" className={className} {...props}>
      {children}
    </Stack>
  );
};
