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
import { selectUsername } from '../../features/authSlice';
import {
  selectUserUpdate,
  UserAction,
  userAddAdminPrivilege,
  userRemoveAdminPrivilege,
  userResetUpdateAction,
  userUpdateReset,
} from '../../features/usersSlice';
import { MailUserUpdateConfirmDialog } from './MailUserUpdateConfirmDialog';

const modifyPrivilegesDialogContentProps: IDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Modify Privileges',
};

interface MailUserUpdatePrivilegeProps {
  onClose: () => void;
  user?: MailUser | null;
  isUpdatingUser: boolean;
  updateUserError: string | null;
  updateUserResponse: string | null;
}

export const MailUserUpdatePrivilege: React.FunctionComponent<MailUserUpdatePrivilegeProps> = ({
  onClose,
  user,
  isUpdatingUser,
  updateUserError,
  updateUserResponse,
}) => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUsername);
  const userUpdate = useSelector(selectUserUpdate);
  const [
    removeErrorDialogHidden,
    { setFalse: showRemoveErrorDialog, setTrue: hideRemoveErrorDialog },
  ] = useBoolean(true);

  const onConfirmClick = useCallback((): void => {
    onClose();
  }, [onClose]);

  const onModalDismissed = useCallback((): void => {
    dispatch(userUpdateReset());
  }, [dispatch]);

  const removeAdminDialogHidden =
    userUpdate?.action !== UserAction.removeAdminPrivilege;

  const addAdminDialogHidden =
    userUpdate?.action !== UserAction.addAdminPrivilege;

  const updateSelfError = !removeAdminDialogHidden && userName === user?.email;

  const modalProps = {
    isBlocking: true,
    onDismissed: onModalDismissed,
  };

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
      dispatch(userResetUpdateAction());
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
          <MailUserUpdateConfirmDialog
            dialogContentProps={modifyPrivilegesDialogContentProps}
            modalProps={modalProps}
            onClose={onClose}
            isLoading={
              removeAdminDialogHidden || isUpdatingUser || !!updateUserResponse
            }
            error={updateUserError}
            hidden={removeAdminDialogHidden}
            onConfirm={(): void => {
              if (user) {
                dispatch(userRemoveAdminPrivilege(user));
              }
            }}
            confirmButtonText="Remove"
          >
            <Text>
              Are you sure you want to remove the admin privilege for{' '}
              <strong>{user?.email}?</strong>
            </Text>
          </MailUserUpdateConfirmDialog>
          <MailUserUpdateConfirmDialog
            dialogContentProps={modifyPrivilegesDialogContentProps}
            modalProps={modalProps}
            onClose={onClose}
            isLoading={
              addAdminDialogHidden || isUpdatingUser || !!updateUserResponse
            }
            error={updateUserError}
            hidden={addAdminDialogHidden}
            onConfirm={(): void => {
              if (user) {
                dispatch(userAddAdminPrivilege(user));
              }
            }}
            confirmButtonText="Add"
          >
            <Text>
              Are you sure you want to add the admin privilege for{' '}
              <strong>{user?.email}?</strong>
            </Text>
          </MailUserUpdateConfirmDialog>
        </>
      )}
    </>
  );
};
