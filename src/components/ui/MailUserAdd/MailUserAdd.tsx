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
  ScreenWidthMinLarge,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import { MailUserPrivilege } from 'mailinabox-api';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { getDump } from '../../../features/dnsSlice';
import { getSSLStatus } from '../../../features/sslSlice';
import {
  addUser,
  addUserReset,
  addUserResetError,
  getUsers,
} from '../../../features/usersSlice';
import { useFormInputs } from '../../../forms/useFormInputs';
import { RootState } from '../../../store';
import { DialogFooter } from '../DialogFooter/DialogFooter';
import { MessageBar } from '../MessageBar/MessageBar';
import { Pre } from '../Pre/Pre';

const theme = getTheme();

const columnClassName = mergeStyles({
  flexBasis: 0,
  minWidth: 0,
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

type FormState = {
  email: string;
  password: string;
  privilege: IDropdownOption;
};

const initialFormState: FormState = {
  email: '',
  password: '',
  privilege: privilegeOptions[0],
};

export const MailUserAdd: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  const { inputs, resetInputs, setInputs, onInputChange } =
    useFormInputs<FormState>(initialFormState);
  const { isAddingUser, addUserResponse, addUserError } = useSelector(
    (state: RootState) => state.users
  );

  const dispatch = useDispatch();
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);

  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });

  const nonMobileContainerProps = {
    horizontal: isMinLargeScreen,
    gap: isMinLargeScreen ? 'l2' : 'm',
  };

  const onDropdownChange =
    (name: string) =>
    (
      _event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      if (option) {
        setInputs({
          ...inputs,
          [name]: option,
        });
      }
    };

  const onFormSubmit = (event: React.FormEvent<HTMLElement>): void => {
    event.preventDefault();
    dispatch(
      addUser(
        inputs.email,
        inputs.password,
        inputs.privilege.key as MailUserPrivilege
      )
    );
  };

  const onDialogClose = useConstCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    }
  );

  const onDialogDismissed = useConstCallback((): void => {
    dispatch(addUserReset());
    resetInputs();
    setHasDialogOpened(false);
  });

  const onErrorMessageBarDismiss = useConstCallback(
    (
      _event?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
    ): void => {
      dispatch(addUserResetError());
    }
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
      dispatch(getSSLStatus());
      dispatch(getDump());
    }
  }, [addUserResponse, dispatch]);

  useEffect(() => {
    return (): void => {
      dispatch(addUserReset());
    };
  }, [dispatch]);
  return (
    <Stack>
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
      <Stack {...props} {...nonMobileContainerProps}>
        <Stack gap="m" grow={1} className={columnClassName}>
          <Text>
            Add an email address to this system. This will create a new login
            username/password.
          </Text>
          <MessageBar
            messageBarType={MessageBarType.warning}
            isMultiline={isMinLargeScreen}
            truncated={!isMinLargeScreen}
          >
            Passwords must be at least eight characters consisting of English
            letters and numbers only. For best results,
            <Link href="#">generate a random password</Link>. Use
            <Link href="#">aliases</Link> to create email addresses that forward
            to existing accounts. Administrators get access to this control
            panel. User accounts cannot contain any international (non-ASCII)
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
            name="email"
            required
            onChange={onInputChange}
            value={inputs.email}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            required
            onChange={onInputChange}
            value={inputs.password}
            description="Passwords must be at least eight characters and may not contain spaces."
            styles={{ description: { ...theme.fonts.small } }}
          />
          <Dropdown
            label="Privilege"
            required
            options={privilegeOptions}
            selectedKey={inputs.privilege.key}
            onChange={onDropdownChange('privilege')}
          />
          <Stack horizontal>
            <PrimaryButton type="submit" disabled={isAddingUser}>
              Add User
            </PrimaryButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
