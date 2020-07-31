import {
  DefaultButton,
  Dialog,
  DialogType,
  getTheme,
  IDialogContentProps,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { MailUser } from 'mailinabox-api';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserPassword, updateUserReset } from '../../../features/usersSlice';
import { RootState } from '../../../store';
import { DialogFooter } from '../DialogFooter/DialogFooter';
import { MessageBar } from '../MessageBar/MessageBar';
import { Pre } from '../Pre/Pre';

interface MailUserSetPasswordDialogProps {
  onDismiss: () => void;
  hidden: boolean;
  isUpdatingUser: boolean;
  updateUserError: string | null;
  updateUserResponse: string | null;
  user?: MailUser;
}

const changePasswordDialogContentProps: IDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Set Password',
};

export const MailUserSetPasswordDialog: React.FunctionComponent<MailUserSetPasswordDialogProps> = ({
  hidden,
  onDismiss,
  user,
  isUpdatingUser,
  updateUserError,
  updateUserResponse,
}) => {
  const { username } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const [password, setPassword] = useState<string>('');
  const onModalDismissed = useCallback((): void => {
    setPassword('');
    dispatch(updateUserReset());
  }, [dispatch]);
  const onPasswordChange = useCallback(
    (ev: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setPassword(newValue ?? '');
    },
    []
  );
  const onFormSubmit = useCallback(
    (ev: React.FormEvent<HTMLElement>): void => {
      ev.preventDefault();
      if (user) {
        dispatch(setUserPassword(user, password));
      }
    },
    [dispatch, password, user]
  );
  const updateSelf = username === user?.email;
  return (
    <Dialog
      hidden={hidden}
      dialogContentProps={changePasswordDialogContentProps}
      modalProps={{
        isBlocking: true,
        onDismissed: onModalDismissed,
      }}
      minWidth={480}
      maxWidth={480}
    >
      {updateUserResponse && (
        <>
          <Pre>{updateUserResponse}</Pre>
          <DialogFooter>
            <PrimaryButton text="OK" onClick={onDismiss} />
          </DialogFooter>
        </>
      )}
      {!updateUserResponse && (
        <form onSubmit={onFormSubmit}>
          <Stack gap="s1">
            {updateUserError && (
              <MessageBar messageBarType={MessageBarType.error} isMultiline>
                {updateUserError}
              </MessageBar>
            )}
            <Text block>
              Set a new password for <strong>{user?.email}</strong>
            </Text>
            <TextField
              label="New Password"
              type="password"
              value={password}
              required
              onChange={onPasswordChange}
              description="Passwords must be at least eight characters and may not contain spaces."
              styles={{ description: { ...getTheme().fonts.small } }}
            />
            {updateSelf && (
              <MessageBar messageBarType={MessageBarType.warning} isMultiline>
                If you change your own password, you will be logged out of this
                control panel and will need to log in again.
              </MessageBar>
            )}
          </Stack>
          <DialogFooter isLoading={isUpdatingUser}>
            <PrimaryButton
              text="Set Password"
              disabled={isUpdatingUser}
              type="submit"
            />
            <DefaultButton
              text="Cancel"
              disabled={isUpdatingUser}
              onClick={onDismiss}
            />
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
};
