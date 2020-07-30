import {
  Breadcrumb,
  getTheme,
  IGroup,
  mergeStyles,
  MessageBarType,
  Pivot,
  PivotItem,
  PivotLinkSize,
  ProgressIndicator,
  Stack,
} from '@fluentui/react';
import { MailAlias, MailAliasByDomain } from 'mailinabox-api';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAliases,
  selectAliases,
  selectAliasesError,
  selectIsGettingAliases,
} from '../../../../../features/aliasesSlice';
import { Body } from '../../../../ui/Body/Body';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { MailAliasAdd } from '../../../../ui/MailAliasAdd/MailAliasAdd';
import { MailAliasesList } from '../../../../ui/MailAliasesList/MailAliasesList';
import { MessageBar } from '../../../../ui/MessageBar/MessageBar';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

const AliasesSections: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const isCheckingAliases = useSelector(selectIsGettingAliases);
  const mailAliases = useSelector(selectAliases);
  const aliasesError = useSelector(selectAliasesError);
  const aliases: Array<MailAlias> = [];
  const groups: Array<IGroup> = [];

  mailAliases.forEach((aliasDomain: MailAliasByDomain) => {
    const { domain, aliases: aliasesByDomain } = aliasDomain;
    groups.push({
      key: 'group' + groups.length,
      name: domain,
      startIndex: aliases.length,
      level: 0,
      count: aliasesByDomain.length,
      isCollapsed: true,
    });
    aliases.push(...aliasesByDomain);
  });

  useEffect(() => {
    dispatch(getAliases());
  }, [dispatch]);
  return (
    <Pivot linkSize={PivotLinkSize.large}>
      <PivotItem headerText="Existing Mail Aliases" className={className}>
        {aliasesError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline
            className={className}
          >
            {aliasesError}
          </MessageBar>
        )}
        {isCheckingAliases && <ProgressIndicator label="Loading aliases..." />}
        {!isCheckingAliases && !aliasesError && (
          <MailAliasesList
            aliases={aliases}
            groups={groups}
            className={className}
          />
        )}
      </PivotItem>
      <PivotItem headerText="Add a Mail Alias" className={className}>
        <MailAliasAdd />
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
