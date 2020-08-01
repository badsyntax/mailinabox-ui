import {
  Dialog,
  DialogFooter,
  DialogType,
  IDialogContentProps,
  PrimaryButton,
  Stack,
  Text,
} from '@fluentui/react';
import { useBoolean } from '@uifabric/react-hooks';
import { MailUser } from 'mailinabox-api';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser, updateUserReset } from '../../../features/usersSlice';
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
  user?: MailUser;
}

export const MailUserArchiveDialog: React.FunctionComponent<MailUserArchiveDialogProps> = ({
  hidden,
  onDismiss,
  user,
  isUpdatingUser,
  updateUserError,
  updateUserResponse,
}) => {
  const { username } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const [
    archiveErrorDialogHidden,
    { setFalse: showArchiveErrorDialog, setTrue: hideArchiveErrorDialog },
  ] = useBoolean(true);

  const onModalDismissed = useCallback((): void => {
    dispatch(updateUserReset());
    onDismiss();
  }, [dispatch, onDismiss]);

  const onConfirmClick = useCallback((): void => {
    hideArchiveErrorDialog();
  }, [hideArchiveErrorDialog]);

  const modalProps = {
    isBlocking: true,
    onDismissed: onModalDismissed,
  };

  const updateSelfError = !hidden && username === user?.email;

  useEffect(() => {
    if (updateSelfError) {
      showArchiveErrorDialog();
    } else {
      hideArchiveErrorDialog();
    }
  }, [hideArchiveErrorDialog, showArchiveErrorDialog, updateSelfError]);
  return (
    <>
      <Dialog
        hidden={archiveErrorDialogHidden}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <Text>You cannot archive your own account.</Text>
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onConfirmClick} />
        </DialogFooter>
      </Dialog>

      <ActionConfirmDialog
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
        onDismiss={onDismiss}
        isLoading={isUpdatingUser}
        error={updateUserError}
        hidden={hidden || !archiveErrorDialogHidden}
        confirmButtonText="Archive"
        actionResponse={updateUserResponse}
        onConfirm={(): void => {
          if (user) {
            dispatch(removeUser(user));
          }
        }}
      >
        <Stack gap="m">
          <Text>
            Are you sure you want to archive <strong>{user?.email}</strong>?
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
