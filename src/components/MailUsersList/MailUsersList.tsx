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
import { useBoolean } from '@uifabric/react-hooks';
import { MailUser, MailUserPrivilege, MailUserStatus } from 'mailinabox-api';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUpdatePrivilegeResponse,
  usersCheck,
  userUpdatePrivilegeReset,
} from '../../features/usersSlice';
import { MessageBar } from '../MessageBar/MessageBar';
import { MailUserActionsList } from './MailUserActionsList';
import { MailUserPrivilegeUpdate } from './MailUserPrivilegeUpdate';

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
              Or to permanently delete the mailbox, delete the directory
              <code>{item.mailbox}</code> on the machine.
            </MessageBar>
          ) : null}
        </>
      );
    },
  },
  {
    key: 'column2',
    name: '',
    minWidth: 160,
    isMultiline: false,
  },
];

export const MailUsersList: React.FunctionComponent<
  IStackProps & {
    users: Array<MailUser>;
    groups: Array<IGroup>;
  }
> = ({ users = [], groups = [], ...props }) => {
  const dispatch = useDispatch();
  const updatePrivilegeResponse = useSelector(selectUpdatePrivilegeResponse);
  const [
    addAdminDialogHidden,
    { setFalse: showAddAdminDialog, setTrue: hideAddAdminDialog },
  ] = useBoolean(true);
  const [
    removeAdminDialogHidden,
    { setFalse: showRemoveAdminDialog, setTrue: hideRemoveAdminDialog },
  ] = useBoolean(true);

  const [dialogUser, setDialogUser] = useState<MailUser>();

  const addAdminPrivilegeUser = useCallback(
    (user: MailUser): void => {
      setDialogUser(user);
      showAddAdminDialog();
    },
    [showAddAdminDialog]
  );
  const removeAdminPrivilegeUser = useCallback(
    (user: MailUser): void => {
      setDialogUser(user);
      showRemoveAdminDialog();
    },
    [showRemoveAdminDialog]
  );

  columns[2].onRender = useCallback(
    (user: MailUser): React.ReactNode => {
      return user.status === MailUserStatus.Active ? (
        <MailUserActionsList
          user={user}
          onAddAdminPrivilegeUser={addAdminPrivilegeUser}
          onRemoveAdminPrivilegeUser={removeAdminPrivilegeUser}
        />
      ) : null;
    },
    [addAdminPrivilegeUser, removeAdminPrivilegeUser]
  );

  useEffect(() => {
    hideAddAdminDialog();
    hideRemoveAdminDialog();
    dispatch(usersCheck());
    dispatch(userUpdatePrivilegeReset());
  }, [
    dispatch,
    hideAddAdminDialog,
    hideRemoveAdminDialog,
    updatePrivilegeResponse,
  ]);

  return (
    <Stack as="section" {...props}>
      <MailUserPrivilegeUpdate
        removeAdminDialogHidden={removeAdminDialogHidden}
        addAdminDialogHidden={addAdminDialogHidden}
        hideAddAdminDialog={hideAddAdminDialog}
        hideRemoveAdminDialog={hideRemoveAdminDialog}
        user={dialogUser}
      />
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
