import React from 'react';
import logo from './fabric.png';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { FontWeights, Stack, Text, Link } from '@fluentui/react';

const boldStyle = {
  root: { fontWeight: FontWeights.semibold },
};

export const HomeRoute: React.FunctionComponent & { path: string } = () => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      styles={{
        root: {
          width: '960px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#605e5c',
        },
      }}
      tokens={{ childrenGap: 15 }}
    >
      <img src={logo} alt="logo" />
      <Text variant="xxLarge" styles={boldStyle}>
        Welcome to Your UI Fabric HomeRoute
      </Text>
      <Text variant="large">
        For a guide on how to customize this project, check out the UI Fabric
        documentation.
      </Text>
      <Text variant="large" styles={boldStyle}>
        Essential Links
      </Text>
      <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
        <Link href="https://developer.microsoft.com/en-us/fabric">Docs</Link>
        <Link href="https://stackoverflow.com/questions/tagged/office-ui-fabric">
          Stack Overflow
        </Link>
        <Link href="https://github.com/officeDev/office-ui-fabric-react/">
          Github
        </Link>
        <Link href="https://twitter.com/officeuifabric">Twitter</Link>
      </Stack>
      <Text variant="large" styles={boldStyle}>
        Design System
      </Text>
      <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
        <Link href="https://developer.microsoft.com/en-us/fabric#/styles/icons">
          Icons
        </Link>
        <Link href="https://developer.microsoft.com/en-us/fabric#/styles/typography">
          Typography
        </Link>
        <Link href="https://developer.microsoft.com/en-us/fabric#/styles/themegenerator">
          Theme
        </Link>
      </Stack>
    </Stack>
  );
};

HomeRoute.path = '/';
