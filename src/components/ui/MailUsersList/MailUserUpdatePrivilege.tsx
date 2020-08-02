import {
  Dialog,
  DialogFooter,
  DialogType,
  IDialogContentProps,
  PrimaryButton,
  Text,
} from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addUserAdminPrivilege,
  getUsers,
  removeUserAdminPrivilege,
  updateUserReset,
  UserAction,
  UserActionType,
} from '../../../features/usersSlice';
import { RootState } from '../../../store';
import { ActionConfirmDialog } from '../ActionConfirmDialog/ActionConfirmDialog';

const modifyPrivilegesDialogContentProps: IDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Modify Privileges',
};

interface MailUserUpdatePrivilegeProps {
  onDialogDismiss: () => void;
  userAction: UserAction | null;
  isUpdatingUser: boolean;
  updateUserError: string | null;
  updateUserResponse: string | null;
}

export const MailUserUpdatePrivilege: React.FunctionComponent<MailUserUpdatePrivilegeProps> = ({
  onDialogDismiss,
  userAction,
  isUpdatingUser,
  updateUserError,
  updateUserResponse,
}) => {
  const dispatch = useDispatch();

  const { username } = useSelector((state: RootState) => state.auth);
  const [
    removeSelfErrorDialogHidden,
    setRemoveSelfErrorDialogHidden,
  ] = useState<boolean>(true);

  const removeAdminDialogHidden =
    userAction?.type !== UserActionType.removeAdminPrivilege;

  const addAdminDialogHidden =
    userAction?.type !== UserActionType.addAdminPrivilege;

  const updateSelfError =
    !removeAdminDialogHidden && username === userAction?.user?.email;

  const onModalDismissed = useCallback((): void => {
    if (updateUserResponse) {
      dispatch(getUsers());
    }
    dispatch(updateUserReset());
  }, [dispatch, updateUserResponse]);

  const onRemoveAdminConfirm = useCallback((): void => {
    if (userAction?.user) {
      dispatch(removeUserAdminPrivilege(userAction.user));
    }
  }, [dispatch, userAction]);

  const onAddAdminConfirm = useCallback((): void => {
    if (userAction?.user) {
      dispatch(addUserAdminPrivilege(userAction.user));
    }
  }, [dispatch, userAction]);

  useEffect(() => {
    setRemoveSelfErrorDialogHidden(!updateSelfError);
  }, [updateSelfError]);

  const modalProps = {
    isBlocking: true,
    onDismissed: onModalDismissed,
  };
  return (
    <>
      <Dialog
        hidden={removeSelfErrorDialogHidden}
        dialogContentProps={modifyPrivilegesDialogContentProps}
        modalProps={modalProps}
      >
        <Text>You cannot remove the admin privilege from yourself.</Text>
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onDialogDismiss} />
        </DialogFooter>
      </Dialog>
      {!updateSelfError && (
        <>
          <ActionConfirmDialog
            dialogContentProps={modifyPrivilegesDialogContentProps}
            modalProps={modalProps}
            onDismiss={onDialogDismiss}
            isLoading={isUpdatingUser}
            error={updateUserError}
            hidden={removeAdminDialogHidden}
            onConfirm={onRemoveAdminConfirm}
            confirmButtonText="Remove"
            actionResponse={updateUserResponse}
          >
            <Text>
              Are you sure you want to remove the admin privilege for{' '}
              <strong>{userAction?.user?.email}?</strong>
            </Text>
          </ActionConfirmDialog>
          <ActionConfirmDialog
            dialogContentProps={modifyPrivilegesDialogContentProps}
            modalProps={modalProps}
            onDismiss={onDialogDismiss}
            isLoading={isUpdatingUser}
            error={updateUserError}
            hidden={addAdminDialogHidden}
            onConfirm={onAddAdminConfirm}
            confirmButtonText="Add"
            actionResponse={updateUserResponse}
          >
            <Text>
              Are you sure you want to add the admin privilege for{' '}
              <strong>{userAction?.user?.email}?</strong>
            </Text>
          </ActionConfirmDialog>
        </>
      )}
    </>
  );
};
