import { CommandBar } from '@fluentui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Backups } from '../routes/MainRoute/system/Backups/Backups';
import { Certificates } from '../routes/MainRoute/system/Certificates/Certificates';
import { StatusChecks } from '../routes/MainRoute/system/StatusChecks/StatusChecks';

export const PrimaryNav: React.FunctionComponent = () => {
  const history = useHistory();
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
                onClick: (): void => history.push(StatusChecks.path),
              },
              {
                key: 'certificates',
                text: 'TLS (SSL) Certificates',
                iconProps: { iconName: 'Lock' },
                onClick: (): void => history.push(Certificates.path),
              },
              {
                key: 'backup',
                text: 'Backup Status',
                iconProps: { iconName: 'CloudUpload' },
                onClick: (): void => history.push(Backups.path),
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
