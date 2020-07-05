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
import { selectUsername } from '../../features/authSlice';
import { userRemove, userUpdateReset } from '../../features/usersSlice';
import { MailUserUpdateConfirmDialog } from './MailUserUpdateConfirmDialog';

const dialogContentProps: IDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Archive User',
};

interface MailUserArchiveDialogProps {
  onClose: () => void;
  hidden: boolean;
  isUpdatingUser: boolean;
  updateUserError: string | null;
  updateUserResponse: string | null;
  user?: MailUser;
}

export const MailUserArchiveDialog: React.FunctionComponent<MailUserArchiveDialogProps> = ({
  hidden,
  onClose,
  user,
  isUpdatingUser,
  updateUserError,
  updateUserResponse,
}) => {
  const dispatch = useDispatch();
  const [
    archiveErrorDialogHidden,
    { setFalse: showArchiveErrorDialog, setTrue: hideArchiveErrorDialog },
  ] = useBoolean(true);
  const userName = useSelector(selectUsername);

  const onModalDismissed = useCallback((): void => {
    dispatch(userUpdateReset());
  }, [dispatch]);

  const onConfirmClick = useCallback((): void => {
    hideArchiveErrorDialog();
    onClose();
  }, [hideArchiveErrorDialog, onClose]);

  const modalProps = {
    isBlocking: true,
    onDismissed: onModalDismissed,
  };

  const updateSelfError = !hidden && userName === user?.email;

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

      <MailUserUpdateConfirmDialog
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
        onClose={onClose}
        isLoading={isUpdatingUser}
        error={updateUserError}
        hidden={hidden || !archiveErrorDialogHidden}
        confirmButtonText="Archive"
        updateUserResponse={updateUserResponse}
        onConfirm={(): void => {
          if (user) {
            dispatch(userRemove(user));
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
      </MailUserUpdateConfirmDialog>
    </>
  );
};
