import { getTheme, mergeStyles, Text } from '@fluentui/react';
import React from 'react';

const theme = getTheme();

const className = mergeStyles({
  padding: theme.spacing.m,
  fontFamily: 'monospace',
  backgroundColor: theme.palette.neutralLighterAlt,
  borderColor: theme.semanticColors.variantBorder,
  borderRadius: theme.effects.roundedCorner2,
  borderWidth: 1,
  borderStyle: 'solid',
  overflow: 'auto',
  textOverflow: 'unset',
  margin: 0,
});

export const Pre: React.FunctionComponent = ({ children }) => {
  return (
    <Text as="pre" className={className}>
      {children}
    </Text>
  );
};
