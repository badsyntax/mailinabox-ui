import { Stack } from '@fluentui/react';
import React from 'react';
import { Body } from '../../../../ui/Body/Body';
import { BodyBreadcrumb } from '../../../../ui/BodyBreadcrumb/BodyBreadcrumb';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { MailAliases } from '../../../../ui/MailAliases/MailAliases';

export const AliasesRoute: React.FunctionComponent & {
  path: string;
} = () => {
  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <BodyBreadcrumb
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
        <MailAliases />
      </BodyPanel>
    </Body>
  );
};

AliasesRoute.path = '/mail/aliases';
