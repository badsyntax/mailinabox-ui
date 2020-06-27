import React from 'react';
import { Text, mergeStyles, getTheme } from '@fluentui/react';

const theme = getTheme();

const className = mergeStyles({
  padding: theme.spacing.m,
  fontFamily: 'monospace',
  backgroundColor: theme.palette.neutralLighterAlt,
  borderColor: theme.semanticColors.variantBorder,
  borderRadius: theme.effects.roundedCorner2,
  borderWidth: 1,
  borderStyle: 'solid',
  marginBottom: 0,
});

export const Pre: React.FunctionComponent = ({ children }) => {
  return (
    <Text as="pre" className={className} block>
      {children}
    </Text>
  );
};
