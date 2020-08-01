import { CommandBar, ContextualMenuItemType, Stack } from '@fluentui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { LogoutRoute } from '../../routes/LogoutRoute/LogoutRoute';
import { AliasesRoute } from '../../routes/MainRoute/mail/AliasesRoute/AliasesRoute';
import { InstructionsRoute } from '../../routes/MainRoute/mail/InstructionsRoute/InstructionsRoute';
import { UsersRoute } from '../../routes/MainRoute/mail/UsersRoute/UsersRoute';
import { SyncGuideRoute } from '../../routes/MainRoute/SyncGuideRoute/SyncGuideRoute';
import { BackupsRoute } from '../../routes/MainRoute/system/BackupsRoute/BackupsRoute';
import { CertificatesRoute } from '../../routes/MainRoute/system/CertificatesRoute/CertificatesRoute';
import { CustomDnsRoute } from '../../routes/MainRoute/system/CustomDnsRoute/CustomDnsRoute';
import { ExternalDnsRoute } from '../../routes/MainRoute/system/ExternalDnsRoute/ExternalDnsRoute';
import { StatusChecksRoute } from '../../routes/MainRoute/system/StatusChecksRoute/StatusChecksRoute';
import { WebRoute } from '../../routes/MainRoute/WebRoute/WebRoute';

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
                  onClick: (): void => history.push(StatusChecksRoute.path),
                },
                {
                  key: 'navCertificates',
                  text: 'TLS (SSL) Certificates',
                  onClick: (): void => history.push(CertificatesRoute.path),
                },
                {
                  key: 'navBackupStatus',
                  text: 'Backup Status',
                  onClick: (): void => history.push(BackupsRoute.path),
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
                        onClick: (): void => history.push(CustomDnsRoute.path),
                      },
                      {
                        key: 'navExternalDnsRoute',
                        text: 'External DNS',
                        onClick: (): void =>
                          history.push(ExternalDnsRoute.path),
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
                  onClick: (): void => history.push(InstructionsRoute.path),
                },
                {
                  key: 'navUsers',
                  text: 'Users',
                  onClick: (): void => history.push(UsersRoute.path),
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
            onClick: (): void => history.push(SyncGuideRoute.path),
          },
          {
            key: 'navWeb',
            text: 'Web',
            iconProps: { iconName: 'SiteScan' },
            onClick: (): void => history.push(WebRoute.path),
          },
        ]}
      />
    </Stack>
  );
};
