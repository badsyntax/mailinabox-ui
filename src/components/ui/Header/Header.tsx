import { getTheme, mergeStyles, Stack, Text } from '@fluentui/react';
import React from 'react';
import { PrimaryNav } from '../PrimaryNav/PrimaryNav';

const className = mergeStyles({
  alignSelf: 'stretch',
  backgroundColor: getTheme().semanticColors.bodyBackground,
});

export const Header: React.FunctionComponent = () => {
  return (
    <Stack
      as="header"
      className={className}
      horizontal
      horizontalAlign="center"
    >
      <Stack
        as="section"
        gap="s1"
        styles={{
          root: {
            maxWidth: 1170,
            width: '100%',
          },
        }}
        horizontal
        verticalAlign="center"
      >
        {/* <Stack.Item disableShrink>
          <Text nowrap variant="large">
            box.example.com
          </Text>
        </Stack.Item> */}
        <Stack.Item disableShrink>
          <Text nowrap variant="large">
            Mail-in-a-Box
          </Text>
        </Stack.Item>
        <PrimaryNav />
      </Stack>
    </Stack>
  );
};
