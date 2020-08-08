import {
  Dialog,
  DialogFooter,
  DialogType,
  IDialogContentProps,
  PrimaryButton,
  Stack,
  Text,
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUsers,
  removeUser,
  updateUserReset,
  UserAction,
} from '../../../features/usersSlice';
import { RootState } from '../../../store';
import { ActionConfirmDialog } from '../ActionConfirmDialog/ActionConfirmDialog';

const dialogContentProps: IDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Archive User',
};

interface MailUserArchiveDialogProps {
  onDismiss: () => void;
  hidden: boolean;
  isUpdatingUser: boolean;
  updateUserError: string | null;
  updateUserResponse: string | null;
  userAction: UserAction | null;
}

export const MailUserArchiveDialog: React.FunctionComponent<MailUserArchiveDialogProps> = ({
  hidden,
  onDismiss,
  userAction,
  isUpdatingUser,
  updateUserError,
  updateUserResponse,
}) => {
  const { username } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const [
    archiveSelfErrorDialogHidden,
    setArchiveSelfErrorDialogHidden,
  ] = useState<boolean>(true);

  const onModalDismissed = (): void => {
    if (updateUserResponse) {
      dispatch(getUsers());
    }
    dispatch(updateUserReset());
  };

  const onArchiveConfirm = (): void => {
    if (userAction?.user) {
      dispatch(removeUser(userAction.user));
    }
  };

  const modalProps = {
    isBlocking: true,
    onDismissed: onModalDismissed,
  };

  const updateSelfError = !hidden && username === userAction?.user?.email;

  useEffect(() => {
    setArchiveSelfErrorDialogHidden(!updateSelfError);
  }, [setArchiveSelfErrorDialogHidden, updateSelfError]);
  return (
    <>
      <Dialog
        hidden={archiveSelfErrorDialogHidden}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <Text>You cannot archive your own account.</Text>
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onDismiss} />
        </DialogFooter>
      </Dialog>
      <ActionConfirmDialog
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
        onDismiss={onDismiss}
        isLoading={isUpdatingUser}
        error={updateUserError}
        hidden={hidden || !archiveSelfErrorDialogHidden}
        confirmButtonText="Archive"
        actionResponse={updateUserResponse}
        onConfirm={onArchiveConfirm}
      >
        <Stack gap="m">
          <Text>
            Are you sure you want to archive{' '}
            <strong>{userAction?.user?.email}</strong>?
          </Text>
          <Text>
            The user's mailboxes will not be deleted (you can do that later),
            but the user will no longer be able to log into any services on this
            machine.
          </Text>
        </Stack>
      </ActionConfirmDialog>
    </>
  );
};
