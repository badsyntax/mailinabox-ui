import { CommandBar, ContextualMenuItemType, Stack } from '@fluentui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { LogoutRoute } from '../routes/LogoutRoute/LogoutRoute';
import { Aliases } from '../routes/MainRoute/mail/Aliases/Aliases';
import { Instructions } from '../routes/MainRoute/mail/Instructions/Instructions';
import { Users } from '../routes/MainRoute/mail/Users/Users';
import { Backups } from '../routes/MainRoute/system/Backups/Backups';
import { Certificates } from '../routes/MainRoute/system/Certificates/Certificates';
import { CustomDns } from '../routes/MainRoute/system/CustomDns/CustomDns';
import { ExternalDns } from '../routes/MainRoute/system/ExternalDns/ExternalDns';
import { StatusChecks } from '../routes/MainRoute/system/StatusChecks/StatusChecks';

export const PrimaryNav: React.FunctionComponent = () => {
  const history = useHistory();
  return (
    <Stack
      styles={{
        root: {
          width: '100%',
        },
      }}
    >
      <CommandBar
        styles={{
          root: {
            padding: 0,
          },
        }}
        farItems={[
          {
            key: 'logout',
            text: 'Log out',
            iconProps: { iconName: 'SignOut' },
            onClick: (): void => {
              history.push(LogoutRoute.path);
            },
          },
        ]}
        items={[
          {
            key: 'system',
            text: 'System',
            iconProps: { iconName: 'System' },
            subMenuProps: {
              items: [
                {
                  key: 'statusChecks',
                  text: 'Status Checks',
                  // iconProps: { iconName: 'Health' },
                  onClick: (): void => history.push(StatusChecks.path),
                },
                {
                  key: 'certificates',
                  text: 'TLS (SSL) Certificates',
                  // iconProps: { iconName: 'Lock' },
                  onClick: (): void => history.push(Certificates.path),
                },
                {
                  key: 'backup',
                  text: 'Backup Status',
                  // iconProps: { iconName: 'CloudUpload' },
                  onClick: (): void => history.push(Backups.path),
                },
                {
                  key: 'advanced',
                  text: 'Advanced',
                  // iconProps: { iconName: 'LightningBolt' },
                  itemType: ContextualMenuItemType.Section,
                  sectionProps: {
                    topDivider: true,
                    bottomDivider: true,
                    title: 'Advanced',
                    items: [
                      {
                        key: 'customDns',
                        text: 'Custom DNS',
                        // iconProps: { iconName: 'InternetSharing' },
                        onClick: (): void => history.push(CustomDns.path),
                      },
                      {
                        key: 'externalDns',
                        text: 'External DNS',
                        // iconProps: { iconName: 'NetworkTower' },
                        onClick: (): void => history.push(ExternalDns.path),
                      },
                      {
                        key: 'monitoring',
                        text: 'Munin Monitoring',
                        // iconProps: { iconName: 'Chart' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            key: 'mail',
            text: 'Mail',
            iconProps: { iconName: 'Mail' },
            subMenuProps: {
              items: [
                {
                  key: 'instructions',
                  text: 'Instructions',
                  // iconProps: { iconName: 'Settings' },
                  onClick: (): void => history.push(Instructions.path),
                },
                {
                  key: 'users',
                  text: 'Users',
                  // iconProps: { iconName: 'Contact' },
                  onClick: (): void => history.push(Users.path),
                },
                {
                  key: 'aliases',
                  text: 'Aliases',
                  // iconProps: { iconName: 'ConnectContacts' },
                  onClick: (): void => history.push(Aliases.path),
                },
              ],
            },
          },
          {
            key: 'contacts',
            text: 'Contacts/Calendar',
            iconProps: { iconName: 'Calendar' },
          },
          {
            key: 'web',
            text: 'Web',
            iconProps: { iconName: 'SiteScan' },
          },
        ]}
      />
    </Stack>
  );
};
