import { Link, Stack, Text } from '@fluentui/react';
import React from 'react';
import { config } from '../../../../config';
import { Body } from '../../../ui/Body/Body';
import { BodyBreadcrumb } from '../../../ui/BodyBreadcrumb/BodyBreadcrumb';
import { BodyPanel } from '../../../ui/BodyPanel/BodyPanel';
import { WebSections } from './WebSections';

export const WebRoute: React.FunctionComponent & {
  path: string;
} = () => {
  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <BodyBreadcrumb
          items={[
            {
              text: 'Static Web Hosting',
              key: 'web',
              as: 'h1',
            },
          ]}
        />
      </Stack>
      <Stack gap="l1">
        <BodyPanel>
          <Text>
            This machine is serving a simple, static website at{' '}
            <Link
              href={`https://${config.hostname}`}
            >{`https://${config.hostname}`}</Link>{' '}
            and at all domain names that you set up an email user or alias for.
          </Text>
        </BodyPanel>
        <BodyPanel>
          <WebSections />
        </BodyPanel>
      </Stack>
    </Body>
  );
};

WebRoute.path = '/web';
