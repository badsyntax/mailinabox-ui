import {
  BaseButton,
  Button,
  Dialog,
  DialogType,
  Dropdown,
  getTheme,
  IDialogContentProps,
  IDropdownOption,
  IModalProps,
  IStackProps,
  Link,
  mergeStyles,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { MailUserPrivilege } from 'mailinabox-api';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addUser,
  addUserReset,
  addUserResetError,
  getUsers,
} from '../../../features/usersSlice';
import { RootState } from '../../../store';
import { DialogFooter } from '../DialogFooter/DialogFooter';
import { MessageBar } from '../MessageBar/MessageBar';
import { Pre } from '../Pre/Pre';

const theme = getTheme();

const columnClassName = mergeStyles({
  flexBasis: 0,
});

const dialogContentProps: IDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'User Added',
};

const modalProps: IModalProps = {
  isBlocking: true,
};

const privilegeOptions: IDropdownOption[] = [
  {
    key: MailUserPrivilege.Empty,
    text: 'Normal User',
  },
  {
    key: MailUserPrivilege.Admin,
    text: 'Administrator',
  },
];

interface FormState {
  email: string;
  password: string;
  privilege: IDropdownOption;
}

const initialFormState: FormState = {
  email: '',
  password: '',
  privilege: privilegeOptions[0],
};

export const MailUserAdd: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  const { isAddingUser, addUserResponse, addUserError } = useSelector(
    (state: RootState) => state.users
  );

  const dispatch = useDispatch();
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);

  const [user, setUser] = useState<FormState>(initialFormState);

  const onEmailChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setUser({
        ...user,
        email: newValue ?? '',
      });
    },
    [user]
  );

  const onPasswordChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setUser({
        ...user,
        password: newValue ?? '',
      });
    },
    [user]
  );

  const onPrivilegeChange = useCallback(
    (
      _event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      if (option) {
        setUser({
          ...user,
          privilege: option,
        });
      }
    },
    [user]
  );

  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLElement>): void => {
      event.preventDefault();
      dispatch(
        addUser(
          user.email,
          user.password,
          user.privilege.key as MailUserPrivilege
        )
      );
    },
    [dispatch, user.email, user.password, user.privilege.key]
  );

  const onDialogClose = useCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    },
    []
  );

  const onDialogDismissed = useCallback((): void => {
    dispatch(addUserReset());
    setUser(initialFormState);
  }, [dispatch]);

  const onErrorMessageBarDismiss = useCallback(
    (
      _event?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
    ): void => {
      dispatch(addUserResetError());
    },
    [dispatch]
  );

  useEffect(() => {
    if (addUserResponse && isDialogHidden && !hasDialogOpened) {
      setIsDialogHidden(false);
    }
  }, [addUserResponse, hasDialogOpened, isDialogHidden]);

  useEffect(() => {
    if (!isDialogHidden) {
      setHasDialogOpened(true);
    }
  }, [isDialogHidden]);

  useEffect(() => {
    if (addUserResponse) {
      dispatch(getUsers());
    }
  }, [addUserResponse, dispatch]);

  useEffect(() => {
    return (): void => {
      dispatch(addUserReset());
    };
  }, [dispatch]);
  return (
    <>
      <Dialog
        hidden={isDialogHidden}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
        minWidth={480}
        maxWidth={480}
        onDismissed={onDialogDismissed}
      >
        <Pre>{addUserResponse}</Pre>
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onDialogClose} />
        </DialogFooter>
      </Dialog>
      <Stack gap="l2" horizontal {...props}>
        <Stack gap="m" grow={1} className={columnClassName}>
          <Text>
            Add an email address to this system. This will create a new login
            username/password.
          </Text>
          <MessageBar messageBarType={MessageBarType.warning} isMultiline>
            Passwords must be at least eight characters consisting of English
            letters and numbers only. For best results,
            <Link href="#">generate a random password</Link>.
            <br />
            <br />
            Use<Link href="#">aliases</Link> to create email addresses that
            forward to existing accounts.
            <br />
            <br />
            Administrators get access to this control panel.
            <br />
            <br />
            User accounts cannot contain any international (non-ASCII)
            characters, but<Link href="#">aliases</Link> can.
          </MessageBar>
        </Stack>
        <Stack
          gap="m"
          as="form"
          grow={1}
          className={columnClassName}
          onSubmit={onFormSubmit}
        >
          {addUserError && (
            <MessageBar
              messageBarType={MessageBarType.error}
              onDismiss={onErrorMessageBarDismiss}
              dismissButtonAriaLabel="Close"
            >
              {addUserError}
            </MessageBar>
          )}
          <TextField
            label="Email"
            type="email"
            required
            onChange={onEmailChange}
            value={user.email}
          />
          <TextField
            label="Password"
            type="password"
            required
            onChange={onPasswordChange}
            value={user.password}
            description="Passwords must be at least eight characters and may not contain spaces."
            styles={{ description: { ...theme.fonts.small } }}
          />
          <Dropdown
            label="Privilege"
            required
            options={privilegeOptions}
            selectedKey={user.privilege.key}
            onChange={onPrivilegeChange}
          />
          <Stack horizontal>
            <PrimaryButton type="submit" disabled={isAddingUser}>
              Add User
            </PrimaryButton>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
