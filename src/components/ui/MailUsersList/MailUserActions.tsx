import { useConstCallback } from '@uifabric/react-hooks';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetUserAction, UserActionType } from '../../../features/usersSlice';
import { RootState } from '../../../store';
import { MailUserArchiveDialog } from './MailUserArchiveDialog';
import { MailUserSetPasswordDialog } from './MailUserSetPasswordDialog';
import { MailUserUpdatePrivilege } from './MailUserUpdatePrivilege';

export const MailUserActions: React.FunctionComponent = () => {
  const { isUpdatingUser, updateUserError, updateUserResponse, userAction } =
    useSelector((state: RootState) => state.users);

  const dispatch = useDispatch();

  const onDialogDismiss = useConstCallback((): void => {
    dispatch(resetUserAction());
  });

  return (
    <>
      <MailUserUpdatePrivilege
        onDialogDismiss={onDialogDismiss}
        userAction={userAction}
        isUpdatingUser={isUpdatingUser}
        updateUserError={updateUserError}
        updateUserResponse={updateUserResponse}
      />
      <MailUserSetPasswordDialog
        hidden={userAction?.type !== UserActionType.setPassword}
        onDismiss={onDialogDismiss}
        userAction={userAction}
        isUpdatingUser={isUpdatingUser}
        updateUserError={updateUserError}
        updateUserResponse={updateUserResponse}
      />
      <MailUserArchiveDialog
        hidden={userAction?.type !== UserActionType.archive}
        onDismiss={onDialogDismiss}
        userAction={userAction}
        isUpdatingUser={isUpdatingUser}
        updateUserError={updateUserError}
        updateUserResponse={updateUserResponse}
      />
    </>
  );
};
