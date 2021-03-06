import { DirectionalHint, IconButton } from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import { MailUser, MailUserPrivilege } from 'mailinabox-api';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setUserAction, UserActionType } from '../../../features/usersSlice';

interface MailUserActionsListProps {
  user: MailUser;
}

export const MailUserActionsList: React.FunctionComponent<MailUserActionsListProps> =
  React.memo(({ user }) => {
    const dispatch = useDispatch();
    const doAction = useConstCallback((type: UserActionType): void => {
      dispatch(
        setUserAction({
          user,
          type,
        })
      );
    });
    return (
      <IconButton
        menuIconProps={{
          iconName: 'MoreVertical',
        }}
        styles={{
          menuIcon: {
            fontWeight: 'bold',
          },
        }}
        role="button"
        aria-haspopup={true}
        aria-label="Show actions"
        menuProps={{
          directionalHint: DirectionalHint.bottomRightEdge,
          items: [
            user.privileges.includes(MailUserPrivilege.Admin)
              ? {
                  key: 'removeadmin',
                  text: 'Remove Admin Privilege',
                  onClick: (): void =>
                    doAction(UserActionType.removeAdminPrivilege),
                }
              : {
                  key: 'makeadmin',
                  text: 'Make Admin',
                  onClick: (): void =>
                    doAction(UserActionType.addAdminPrivilege),
                },
            {
              key: 'setpassword',
              text: 'Set Password',
              onClick: (): void => doAction(UserActionType.setPassword),
            },
            {
              key: 'archiveaccount',
              text: 'Archive Account',
              onClick: (): void => doAction(UserActionType.archive),
            },
          ],
        }}
      />
    );
  });
