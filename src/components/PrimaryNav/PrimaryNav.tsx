import React from 'react';
import { CommandBar } from '@fluentui/react';

export const PrimaryNav: React.FunctionComponent = () => {
  return (
    <CommandBar
      farItems={[
        {
          key: 'logout',
          text: 'Log out',
          iconProps: { iconName: 'SignOut' },
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
                iconProps: { iconName: 'Health' },
              },
              {
                key: 'certificates',
                text: 'TLS (SSL) Certificates',
                iconProps: { iconName: 'Lock' },
              },
              {
                key: 'backup',
                text: 'Backup Status',
                iconProps: { iconName: 'CloudUpload' },
              },
              {
                key: 'advanced',
                text: 'Advanced',
                iconProps: { iconName: 'LightningBolt' },
                subMenuProps: {
                  items: [
                    {
                      key: 'customDns',
                      text: 'Custom DNS',
                      iconProps: { iconName: 'InternetSharing' },
                    },
                    {
                      key: 'externalDns',
                      text: 'External DNS',
                      iconProps: { iconName: 'NetworkTower' },
                    },
                    {
                      key: 'monitoring',
                      text: 'Munin Monitoring',
                      iconProps: { iconName: 'Chart' },
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
                iconProps: { iconName: 'Settings' },
              },
              {
                key: 'users',
                text: 'Users',
                iconProps: { iconName: 'Contact' },
              },
              {
                key: 'aliases',
                text: 'Aliases',
                iconProps: { iconName: 'ConnectContacts' },
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
  );
};
