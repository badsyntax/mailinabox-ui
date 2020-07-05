import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsUpdatingUser,
  selectUpdateUserError,
  selectUpdateUserResponse,
  selectUserUpdate,
  UserAction,
  userResetUpdateAction,
  usersCheck,
} from '../../features/usersSlice';
import { MailUserArchiveDialog } from './MailUserArchiveDialog';
import { MailUserSetPasswordDialog } from './MailUserSetPasswordDialog';
import { MailUserUpdatePrivilege } from './MailUserUpdatePrivilege';

export const MailUserActions: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const isUpdatingUser = useSelector(selectIsUpdatingUser);
  const updateUserError = useSelector(selectUpdateUserError);
  const updateUserResponse = useSelector(selectUpdateUserResponse);
  const userUpdate = useSelector(selectUserUpdate);

  const resetUserAction = useCallback((): void => {
    dispatch(userResetUpdateAction());
  }, [dispatch]);

  useEffect(() => {
    if (updateUserResponse) {
      dispatch(usersCheck(false));
    }
  }, [dispatch, resetUserAction, updateUserResponse]);
  return (
    <>
      <MailUserUpdatePrivilege
        onClose={resetUserAction}
        user={userUpdate?.user}
        isUpdatingUser={isUpdatingUser}
        updateUserError={updateUserError}
        updateUserResponse={updateUserResponse}
      />
      <MailUserSetPasswordDialog
        hidden={userUpdate?.action !== UserAction.setPassword}
        onClose={resetUserAction}
        user={userUpdate?.user}
        isUpdatingUser={isUpdatingUser}
        updateUserError={updateUserError}
        updateUserResponse={updateUserResponse}
      />
      <MailUserArchiveDialog
        hidden={userUpdate?.action !== UserAction.archive}
        onClose={resetUserAction}
        user={userUpdate?.user}
        isUpdatingUser={isUpdatingUser}
        updateUserError={updateUserError}
        updateUserResponse={updateUserResponse}
      />
    </>
  );
};
