import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  Icon,
  IGroup,
  IStackProps,
  mergeStyleSets,
  MessageBarType,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { MailUser, MailUserPrivilege, MailUserStatus } from 'mailinabox-api';
import React from 'react';
import { MessageBar } from '../MessageBar/MessageBar';
import { MailUserActions } from './MailUserActions';
import { MailUserActionsList } from './MailUserActionsList';

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px',
  },
});

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'User Type',
    iconClassName: classNames.fileIconHeaderIcon,
    iconName: 'Contact',
    isIconOnly: true,
    minWidth: 16,
    maxWidth: 16,
    onRender: (item: MailUser): React.ReactElement => {
      return (
        <Icon
          iconName={
            item.privileges.includes(MailUserPrivilege.Admin)
              ? 'EditContact'
              : 'Contact'
          }
          styles={{ root: { fontSize: 16 } }}
        />
      );
    },
  },
  {
    key: 'column2',
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
              Or to permanently delete the mailbox, delete the directory
              <code>{item.mailbox}</code> on the machine.
            </MessageBar>
          ) : null}
        </>
      );
    },
  },
  {
    key: 'column3',
    name: '',
    minWidth: 160,
    isMultiline: false,
    styles: {},
    isPadded: false,
    onRender: (user: MailUser): React.ReactNode => {
      return user.status === MailUserStatus.Active ? (
        <MailUserActionsList user={user} />
      ) : null;
    },
  },
];

export const MailUsersList: React.FunctionComponent<
  IStackProps & {
    users: Array<MailUser>;
    groups: Array<IGroup>;
  }
> = ({ users = [], groups = [], ...props }) => {
  return (
    <Stack as="section" {...props}>
      <MailUserActions />
      <DetailsList
        items={users}
        groups={groups}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        onShouldVirtualize={(): boolean => false}
        selectionMode={SelectionMode.none}
        constrainMode={ConstrainMode.horizontalConstrained}
        useReducedRowRenderer
        usePageCache
      />
    </Stack>
  );
};
