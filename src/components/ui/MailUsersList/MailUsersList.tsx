import {
  IColumn,
  IStackProps,
  mergeStyles,
  MessageBarType,
  Stack,
  Text,
} from '@fluentui/react';
import { MailUser, MailUserStatus } from 'mailinabox-api';
import React, { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { selectUsersWithGroups } from '../../../features/usersSlice';
import { GroupedDetailsList } from '../GroupedDetailsList/GroupedDetailsList';
import { MessageBar } from '../MessageBar/MessageBar';
import { MailUserActions } from './MailUserActions';
import { MailUserActionsList } from './MailUserActionsList';

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Email Address',
    minWidth: 320,
    isMultiline: true,
    isRowHeader: true,
    fieldName: 'email',
    onRender: (item: MailUser): React.ReactNode => {
      const styles =
        item.status === MailUserStatus.Inactive
          ? {
              root: {
                textDecoration: 'line-through',
              },
            }
          : {};
      return (
        <>
          <Text styles={styles}>{item.email}</Text>
          {item.status === MailUserStatus.Inactive && item.mailbox ? (
            <MessageBar
              messageBarType={MessageBarType.info}
              isMultiline
              styles={{ root: { marginTop: 10 } }}
            >
              To restore account, create a new account with this email address.
              Or to permanently delete the mailbox, delete the directory{' '}
              <code>{item.mailbox}</code> on the machine.
            </MessageBar>
          ) : null}
        </>
      );
    },
  },
  {
    key: 'column2',
    name: 'Privilege',
    minWidth: 80,
    isMultiline: false,
    onRender: (user: MailUser): React.ReactNode => {
      return user.status === MailUserStatus.Active ? (
        <Text>
          {user.privileges.length ? (
            <strong>{user.privileges.join(', ')}</strong>
          ) : (
            'normal'
          )}
        </Text>
      ) : null;
    },
  },
  {
    key: 'column3',
    name: 'Actions',
    minWidth: 50,
    isMultiline: false,
    onRender: (user: MailUser): React.ReactNode => {
      return user.status === MailUserStatus.Active ? (
        <MailUserActionsList user={user} />
      ) : null;
    },
    className: mergeStyles({
      displayName: 'DetailsRow-actions-cell',
    }),
  },
];

interface MailUsersListProps {
  openedGroupsState: [string[], Dispatch<SetStateAction<string[]>>];
}

export const MailUsersList: React.FunctionComponent<
  IStackProps & MailUsersListProps
> = ({ openedGroupsState, ...props }) => {
  const [users, groups] = useSelector(selectUsersWithGroups);
  return (
    <Stack as="section" {...props}>
      <MailUserActions />
      <GroupedDetailsList
        openedGroupsState={openedGroupsState}
        items={users}
        groups={groups}
        columns={columns}
      />
    </Stack>
  );
};
