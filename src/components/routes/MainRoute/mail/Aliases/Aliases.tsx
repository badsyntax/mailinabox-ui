import {
  Breadcrumb,
  getTheme,
  mergeStyles,
  Pivot,
  PivotItem,
  PivotLinkSize,
  Stack,
} from '@fluentui/react';
import React from 'react';
import { Body } from '../../../../Body/Body';
import { BodyPanel } from '../../../../BodyPanel/BodyPanel';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

const AliasesSections: React.FunctionComponent = () => {
  return (
    <Pivot linkSize={PivotLinkSize.large}>
      <PivotItem headerText="Existing Mail Alias" className={className}>
        <div>Existing mail aliases</div>
      </PivotItem>
      <PivotItem headerText="Add a Mail Alias" className={className}>
        <div>Add a Mail Alias</div>
      </PivotItem>
    </Pivot>
  );
};

export const Aliases: React.FunctionComponent & {
  path: string;
} = () => {
  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Breadcrumb
          styles={{
            root: {
              marginTop: 0,
            },
          }}
          items={[
            {
              text: 'Mail',
              key: 'mail',
            },
            {
              text: 'Aliases',
              key: 'aliases',
              as: 'h1',
            },
          ]}
        />
      </Stack>
      <BodyPanel>
        <AliasesSections />
      </BodyPanel>
    </Body>
  );
};

Aliases.path = '/mail/aliases';
