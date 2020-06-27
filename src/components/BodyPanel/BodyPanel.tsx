import React from 'react';
import {
  mergeStyles,
  getTheme,
  Stack,
  IStackProps,
  AnimationStyles,
} from '@fluentui/react';

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
    <Stack
      as="section"
      tokens={{ padding: 'm', childrenGap: 'm' }}
      className={className}
      {...props}
    >
      {children}
    </Stack>
  );
};
