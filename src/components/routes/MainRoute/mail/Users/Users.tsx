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
import { Body } from '../../../../Body/Body';
import { BodyPanel } from '../../../../BodyPanel/BodyPanel';
import { MailUserAdd } from '../../../../MailUserAdd/MailUserAdd';
import { MailUsersList } from '../../../../MailUsersList/MailUsersList';
import { MessageBar } from '../../../../MessageBar/MessageBar';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

const UsersSections: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const mailUsers = useSelector(selectUsers);
  const usersError = useSelector(selectUsersError);
  const isCheckingUsers = useSelector(selectIsGettingUsers);

  // const addAdminPrivilegeResponse = useSelector(
  //   selectAddAdminPrivilegeResponse
  // );
  // const removeAdminPrivilegeResponse = useSelector(
  //   selectRemoveAdminPrivilegeResponse
  // );

  useEffect(() => {
    dispatch(usersCheck());
  }, [dispatch]);

  // useEffect(() => {
  //   if (addAdminPrivilegeResponse) {
  //     dispatch(userAddAdminPrivilegeReset());
  //     dispatch(usersCheck());
  //   }
  //   if (removeAdminPrivilegeResponse) {
  //     dispatch(userRemoveAdminPrivilegeReset());
  //     dispatch(usersCheck());
  //   }
  // }, [addAdminPrivilegeResponse, dispatch, removeAdminPrivilegeResponse]);

  const users: Array<MailUser> = [];
  const groups: Array<IGroup> = [];

  mailUsers.forEach((userDomain: MailUserByDomain) => {
    const { domain, users: usersByDomain } = userDomain;
    groups.push({
      key: 'group' + groups.length,
      name: domain,
      startIndex: users.length,
      isCollapsed: false,
      level: 0,
      count: usersByDomain.length,
    });
    users.push(...usersByDomain);
  });

  console.log('isCheckingUsers', isCheckingUsers);
  return (
    <Pivot linkSize={PivotLinkSize.large}>
      <PivotItem headerText="Existing Mail Users" className={className}>
        {usersError && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {usersError}
          </MessageBar>
        )}
        {isCheckingUsers && <ProgressIndicator label="Loading users..." />}
        {users.length > 0 && (
          <MailUsersList users={users} groups={groups} className={className} />
        )}
      </PivotItem>
      <PivotItem headerText="Add a Mail User" className={className}>
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
