import { CommandBar, ContextualMenuItemType, Stack } from '@fluentui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { LogoutRoute } from '../../routes/LogoutRoute/LogoutRoute';
import { AliasesRoute } from '../../routes/MainRoute/mail/AliasesRoute/AliasesRoute';
import { Instructions } from '../../routes/MainRoute/mail/Instructions/Instructions';
import { Users } from '../../routes/MainRoute/mail/Users/Users';
import { SyncGuide } from '../../routes/MainRoute/SyncGuide/SyncGuide';
import { Backups } from '../../routes/MainRoute/system/Backups/Backups';
import { Certificates } from '../../routes/MainRoute/system/Certificates/Certificates';
import { CustomDns } from '../../routes/MainRoute/system/CustomDns/CustomDns';
import { ExternalDns } from '../../routes/MainRoute/system/ExternalDns/ExternalDns';
import { StatusChecks } from '../../routes/MainRoute/system/StatusChecks/StatusChecks';
import { Web } from '../../routes/MainRoute/Web/Web';

export const PrimaryNav: React.FunctionComponent = () => {
  const history = useHistory();
  return (
    <Stack
      styles={{
        root: {
          width: '100%',
        },
      }}
      as="nav"
    >
      <CommandBar
        styles={{
          root: {
            padding: 0,
          },
        }}
        farItems={[
          {
            key: 'navLogout',
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
                  key: 'navStatusChecks',
                  text: 'Status Checks',
                  onClick: (): void => history.push(StatusChecks.path),
                },
                {
                  key: 'navCertificates',
                  text: 'TLS (SSL) Certificates',
                  onClick: (): void => history.push(Certificates.path),
                },
                {
                  key: 'navBackupStatus',
                  text: 'Backup Status',
                  onClick: (): void => history.push(Backups.path),
                },
                {
                  key: 'navAdvanced',
                  text: 'Advanced',
                  itemType: ContextualMenuItemType.Section,
                  sectionProps: {
                    topDivider: true,
                    bottomDivider: true,
                    title: 'Advanced',
                    items: [
                      {
                        key: 'navCustomDns',
                        text: 'Custom DNS',
                        onClick: (): void => history.push(CustomDns.path),
                      },
                      {
                        key: 'navExternalDnsRoute',
                        text: 'External DNS',
                        onClick: (): void => history.push(ExternalDns.path),
                      },
                      {
                        key: 'navMonitoring',
                        text: 'Munin Monitoring',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            key: 'navMail',
            text: 'Mail',
            iconProps: { iconName: 'Mail' },
            subMenuProps: {
              items: [
                {
                  key: 'navInstructions',
                  text: 'Instructions',
                  onClick: (): void => history.push(Instructions.path),
                },
                {
                  key: 'navUsers',
                  text: 'Users',
                  onClick: (): void => history.push(Users.path),
                },
                {
                  key: 'navAliases',
                  text: 'Aliases',
                  onClick: (): void => history.push(AliasesRoute.path),
                },
              ],
            },
          },
          {
            key: 'navContacts',
            text: 'Contacts/Calendar',
            iconProps: { iconName: 'Calendar' },
            onClick: (): void => history.push(SyncGuide.path),
          },
          {
            key: 'navWeb',
            text: 'Web',
            iconProps: { iconName: 'SiteScan' },
            onClick: (): void => history.push(Web.path),
          },
        ]}
      />
    </Stack>
  );
};
