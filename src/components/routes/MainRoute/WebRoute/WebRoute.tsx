import {
  Breadcrumb,
  getTheme,
  Link,
  mergeStyles,
  PivotItem,
  Stack,
  Text,
} from '@fluentui/react';
import React, { useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Body } from '../../../ui/Body/Body';
import { BodyPanel } from '../../../ui/BodyPanel/BodyPanel';
import { PivotRoutes } from '../../../ui/PivotRoutes/PivotRoutes';
import { WebDomainsList } from '../../../ui/WebDomainsList/WebDomainsList';
import { WebInstructions } from '../../../ui/WebInstructions/WebInstructions';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

export const WebRoute: React.FunctionComponent & {
  path: string;
} = () => {
  const { path, url } = useRouteMatch();
  const openedGroupsState = useState<string[]>([]);

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
              text: 'Static Web Hosting',
              key: 'web',
            },
          ]}
        />
      </Stack>
      <BodyPanel>
        <Text>
          This machine is serving a simple, static website at{' '}
          <Link href="#">https://box.proxima-mail.com</Link> and at all domain
          names that you set up an email user or alias for.
        </Text>
      </BodyPanel>
      <BodyPanel>
        <PivotRoutes>
          <PivotItem itemKey={url} headerText="Domains" />
          <PivotItem
            itemKey={`${url}/instructions`}
            headerText="Uploading Instructions"
          />
        </PivotRoutes>
        <Switch>
          <Route exact path={path}>
            <WebDomainsList
              className={className}
              openedGroupsState={openedGroupsState}
            />
          </Route>
          <Route exact path={`${path}/instructions`}>
            <WebInstructions />
          </Route>
        </Switch>
      </BodyPanel>
    </Body>
  );
};

WebRoute.path = '/web';
