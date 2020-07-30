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
import { MailUser, MailUserByDomain } from 'mailinabox-api';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsGettingUsers,
  selectUsers,
  selectUsersError,
  usersCheck,
} from '../../../../../features/usersSlice';
import { Body } from '../../../../ui/Body/Body';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { MailUserAdd } from '../../../../ui/MailUserAdd/MailUserAdd';
import { MailUsersList } from '../../../../ui/MailUsersList/MailUsersList';
import { MessageBar } from '../../../../ui/MessageBar/MessageBar';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

const UsersSections: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const isCheckingUsers = useSelector(selectIsGettingUsers);
  const mailUsers = useSelector(selectUsers);
  const usersError = useSelector(selectUsersError);
  const users: Array<MailUser> = [];
  const groups: Array<IGroup> = [];

  mailUsers.forEach((userDomain: MailUserByDomain) => {
    const { domain, users: usersByDomain } = userDomain;
    groups.push({
      key: 'group' + groups.length,
      name: domain,
      startIndex: users.length,
      isCollapsed: true,
      level: 0,
      count: usersByDomain.length,
    });
    users.push(...usersByDomain);
  });

  useEffect(() => {
    dispatch(usersCheck());
  }, [dispatch]);
  return (
    <Pivot linkSize={PivotLinkSize.large}>
      <PivotItem headerText="Existing Mail Users">
        {usersError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline
            className={className}
          >
            {usersError}
          </MessageBar>
        )}
        {isCheckingUsers && <ProgressIndicator label="Loading users..." />}
        {!isCheckingUsers && !usersError && (
          <MailUsersList users={users} groups={groups} className={className} />
        )}
      </PivotItem>
      <PivotItem headerText="Add a Mail User">
        <MailUserAdd className={className} />
      </PivotItem>
    </Pivot>
  );
};

export const Users: React.FunctionComponent & {
  path: string;
} = () => {
  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Breadcrumb
          onReduceData={(): undefined => undefined}
          styles={{
            root: {
              marginTop: 0,
              width: '100%',
            },
          }}
          items={[
            {
              text: 'Mail',
              key: 'system',
            },
            {
              text: 'Users',
              key: 'users',
              as: 'h1',
            },
          ]}
        />
      </Stack>
      <BodyPanel>
        <UsersSections />
      </BodyPanel>
    </Body>
  );
};

Users.path = '/mail/users';
