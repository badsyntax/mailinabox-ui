import { DefaultButton, IContextualMenuItem } from '@fluentui/react';
import { MailUser, MailUserPrivilege } from 'mailinabox-api';
import React from 'react';

interface MailUserActionsListProps {
  user: MailUser;
  onAddAdminPrivilegeUser: (user: MailUser) => void;
  onRemoveAdminPrivilegeUser: (user: MailUser) => void;
}

export const MailUserActionsList: React.FunctionComponent<MailUserActionsListProps> = ({
  user,
  onAddAdminPrivilegeUser,
  onRemoveAdminPrivilegeUser,
}) => {
  return (
    <DefaultButton
      text="Actions"
      menuProps={{
        items: [
          user.privileges.includes(MailUserPrivilege.Admin)
            ? {
                key: 'removeadmin',
                text: 'Remove Admin Privilege',
                onClick: (
                  ev?:
                    | React.MouseEvent<HTMLElement, MouseEvent>
                    | React.KeyboardEvent<HTMLElement>
                    | undefined,
                  item?: IContextualMenuItem | undefined
                ): boolean | void => {
                  onRemoveAdminPrivilegeUser(user);
                },
              }
            : {
                key: 'makeadmin',
                text: 'Make Admin',
                onClick: (
                  ev?:
                    | React.MouseEvent<HTMLElement, MouseEvent>
                    | React.KeyboardEvent<HTMLElement>
                    | undefined,
                  item?: IContextualMenuItem | undefined
                ): boolean | void => {
                  onAddAdminPrivilegeUser(user);
                },
              },
          {
            key: 'setpassword',
            text: 'Set Password',
          },
          {
            key: 'archiveaccount',
            text: 'Archive Account',
          },
        ],
      }}
    />
  );
};
