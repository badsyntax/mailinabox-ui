import {
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Text,
} from '@fluentui/react';
import { useBoolean } from '@uifabric/react-hooks';
import { MailUser } from 'mailinabox-api';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUsername } from '../../features/authSlice';
import {
  selectIsUpdatingPrivilege,
  selectUpdatePrivilegeError,
  selectUpdatePrivilegeResponse,
  userAddAdminPrivilege,
  userRemoveAdminPrivilege,
} from '../../features/usersSlice';
import { MailUserPrivilegeConfirmDialog } from './MailUserPrivilegeConfirmDialog';

const modalProps = {
  isBlocking: true,
  styles: { main: { maxWidth: 450 } },
};

const dialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Modify Privileges',
};

interface MailUserPrivilegeUpdateProps {
  removeAdminDialogHidden: boolean;
  addAdminDialogHidden: boolean;
  hideRemoveAdminDialog: () => void;
  hideAddAdminDialog: () => void;
  user?: MailUser | null;
}

export const MailUserPrivilegeUpdate: React.FunctionComponent<MailUserPrivilegeUpdateProps> = ({
  removeAdminDialogHidden,
  addAdminDialogHidden,
  hideRemoveAdminDialog,
  hideAddAdminDialog,
  user,
}) => {
  const dispatch = useDispatch();
  const isUpdatingPrivilege = useSelector(selectIsUpdatingPrivilege);
  const updatePrivilegeError = useSelector(selectUpdatePrivilegeError);
  const updatePrivilegeResponse = useSelector(selectUpdatePrivilegeResponse);
  const userName = useSelector(selectUsername);
  const [
    removeErrorDialogHidden,
    { setFalse: showRemoveErrorDialog, setTrue: hideRemoveErrorDialog },
  ] = useBoolean(true);

  const onConfirmClick = useCallback((): void => {
    hideRemoveAdminDialog();
    hideAddAdminDialog();
  }, [hideAddAdminDialog, hideRemoveAdminDialog]);

  const updateSelfError = !removeAdminDialogHidden && userName === user?.email;

  useEffect(() => {
    if (
      updateSelfError &&
      (!removeAdminDialogHidden || !addAdminDialogHidden)
    ) {
      showRemoveErrorDialog();
    } else {
      hideRemoveErrorDialog();
    }
  }, [
    removeAdminDialogHidden,
    addAdminDialogHidden,
    updateSelfError,
    showRemoveErrorDialog,
    hideRemoveErrorDialog,
  ]);
  return (
    <>
      <Dialog
        hidden={removeErrorDialogHidden}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <Text>You cannot remove the admin privilege from yourself.</Text>
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onConfirmClick} />
        </DialogFooter>
      </Dialog>
      {!updateSelfError && (
        <>
          <MailUserPrivilegeConfirmDialog
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
            onClose={hideRemoveAdminDialog}
            disabled={
              removeAdminDialogHidden ||
              isUpdatingPrivilege ||
              !!updatePrivilegeResponse
            }
            error={updatePrivilegeError}
            hidden={removeAdminDialogHidden}
            onConfirm={(): void => {
              if (user) {
                dispatch(userRemoveAdminPrivilege(user));
              }
            }}
            message={
              <>
                Are you sure you want to remove the admin privilege for{' '}
                <strong>{user?.email}?</strong>
              </>
            }
          />
          <MailUserPrivilegeConfirmDialog
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
            onClose={hideAddAdminDialog}
            disabled={
              addAdminDialogHidden ||
              isUpdatingPrivilege ||
              !!updatePrivilegeResponse
            }
            error={updatePrivilegeError}
            hidden={addAdminDialogHidden}
            onConfirm={(): void => {
              if (user) {
                dispatch(userAddAdminPrivilege(user));
              }
            }}
            message={
              <>
                Are you sure you want to add the admin privilege for{' '}
                <strong>{user?.email}?</strong>
              </>
            }
          />
        </>
      )}
    </>
  );
};
