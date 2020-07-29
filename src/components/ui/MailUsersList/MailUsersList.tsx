import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IDetailsGroupDividerProps,
  IGroup,
  IGroupHeaderProps,
  IRenderFunction,
  IStackProps,
  mergeStyleSets,
  MessageBarType,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { MailUser, MailUserStatus } from 'mailinabox-api';
import React from 'react';
import { MessageBar } from '../MessageBar/MessageBar';
import { MailUserActions } from './MailUserActions';
import { MailUserActionsList } from './MailUserActionsList';

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px',
  },
  fileIconCell: {
    textAlign: 'center',
    padding: 0,
  },
});

const columns: IColumn[] = [
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
              Or to permanently delete the mailbox, delete the directory{' '}
              <code>{item.mailbox}</code> on the machine.
            </MessageBar>
          ) : null}
        </>
      );
    },
  },
  {
    key: 'column3',
    name: 'Priviledge',
    minWidth: 80,
    isMultiline: false,
    onRender: (user: MailUser): React.ReactNode => {
      return user.status === MailUserStatus.Active ? (
        <Text>
          {user.privileges.length ? user.privileges.join(', ') : 'normal'}
        </Text>
      ) : null;
    },
  },
  {
    key: 'column4',
    name: 'Actions',
    minWidth: 50,
    isMultiline: false,
    className: classNames.fileIconCell,
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
        selectionMode={SelectionMode.none}
        constrainMode={ConstrainMode.horizontalConstrained}
        useReducedRowRenderer
        usePageCache
        groupProps={{
          isAllGroupsCollapsed: true,
          onRenderHeader: (
            props?: IDetailsGroupDividerProps,
            defaultRender?: IRenderFunction<IGroupHeaderProps>
          ): JSX.Element | null => {
            if (defaultRender) {
              return (
                <div
                  onClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>
                  ): void => {
                    if (props && props.group) {
                      event.preventDefault();
                      props.onToggleCollapse?.(props.group);
                    }
                  }}
                >
                  {defaultRender(props)}
                </div>
              );
            }
            return null;
          },
        }}
      />
    </Stack>
  );
};
