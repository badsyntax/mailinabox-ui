import {
  Dialog,
  DialogFooter,
  DialogType,
  IDialogContentProps,
  PrimaryButton,
  Text,
} from '@fluentui/react';
import { useBoolean } from '@uifabric/react-hooks';
import { MailUser } from 'mailinabox-api';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addUserAdminPrivilege,
  removeUserAdminPrivilege,
  resetUserAction,
  updateUserReset,
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
  user?: MailUser | null;
  isUpdatingUser: boolean;
  updateUserError: string | null;
  updateUserResponse: string | null;
}

export const MailUserUpdatePrivilege: React.FunctionComponent<MailUserUpdatePrivilegeProps> = ({
  onDialogDismiss,
  user,
  isUpdatingUser,
  updateUserError,
  updateUserResponse,
}) => {
  const { userAction } = useSelector((state: RootState) => state.users);
  const { username } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const [
    removeErrorDialogHidden,
    { setFalse: showRemoveErrorDialog, setTrue: hideRemoveErrorDialog },
  ] = useBoolean(true);

  const onConfirmClick = useCallback((): void => {
    onDialogDismiss();
  }, [onDialogDismiss]);

  const onModalDismissed = useCallback((): void => {
    dispatch(updateUserReset());
  }, [dispatch]);

  const removeAdminDialogHidden =
    userAction?.type !== UserActionType.removeAdminPrivilege;

  const addAdminDialogHidden =
    userAction?.type !== UserActionType.addAdminPrivilege;

  const updateSelfError = !removeAdminDialogHidden && username === user?.email;

  const modalProps = {
    isBlocking: true,
    onDismissed: onModalDismissed,
  };

  const onRemoveAdminConfirm = useCallback((): void => {
    if (user) {
      dispatch(removeUserAdminPrivilege(user));
    }
  }, [dispatch, user]);

  const onAddAdminConfirm = useCallback((): void => {
    if (user) {
      dispatch(addUserAdminPrivilege(user));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (updateSelfError) {
      showRemoveErrorDialog();
    } else {
      hideRemoveErrorDialog();
    }
  }, [updateSelfError, showRemoveErrorDialog, hideRemoveErrorDialog, dispatch]);

  useEffect(() => {
    if (
      updateUserResponse &&
      (!removeAdminDialogHidden || !addAdminDialogHidden)
    ) {
      dispatch(resetUserAction());
    }
  }, [
    addAdminDialogHidden,
    dispatch,
    removeAdminDialogHidden,
    updateUserResponse,
  ]);
  return (
    <>
      <Dialog
        hidden={removeErrorDialogHidden}
        dialogContentProps={modifyPrivilegesDialogContentProps}
        modalProps={modalProps}
      >
        <Text>You cannot remove the admin privilege from yourself.</Text>
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onConfirmClick} />
        </DialogFooter>
      </Dialog>

      {!updateSelfError && (
        <>
          <ActionConfirmDialog
            dialogContentProps={modifyPrivilegesDialogContentProps}
            modalProps={modalProps}
            onDismiss={onDialogDismiss}
            isLoading={
              removeAdminDialogHidden || isUpdatingUser || !!updateUserResponse
            }
            error={updateUserError}
            hidden={removeAdminDialogHidden}
            onConfirm={onRemoveAdminConfirm}
            confirmButtonText="Remove"
          >
            <Text>
              Are you sure you want to remove the admin privilege for{' '}
              <strong>{user?.email}?</strong>
            </Text>
          </ActionConfirmDialog>
          <ActionConfirmDialog
            dialogContentProps={modifyPrivilegesDialogContentProps}
            modalProps={modalProps}
            onDismiss={onDialogDismiss}
            isLoading={
              addAdminDialogHidden || isUpdatingUser || !!updateUserResponse
            }
            error={updateUserError}
            hidden={addAdminDialogHidden}
            onConfirm={onAddAdminConfirm}
            confirmButtonText="Add"
          >
            <Text>
              Are you sure you want to add the admin privilege for{' '}
              <strong>{user?.email}?</strong>
            </Text>
          </ActionConfirmDialog>
        </>
      )}
    </>
  );
};
