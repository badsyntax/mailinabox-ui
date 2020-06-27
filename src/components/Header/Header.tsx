import { getTheme, mergeStyles } from '@fluentui/react';
import React from 'react';
import { PrimaryNav } from '../PrimaryNav/PrimaryNav';

const className = mergeStyles({
  alignSelf: 'stretch',
  backgroundColor: getTheme().semanticColors.bodyBackground,
});

export const Header: React.FunctionComponent = () => {
  return (
    <header className={className}>
      <PrimaryNav />
    </header>
  );
};
