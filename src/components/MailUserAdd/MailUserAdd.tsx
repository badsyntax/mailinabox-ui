import {
  Dialog,
  DialogType,
  Dropdown,
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
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAddUserError,
  selectAddUserResponse,
  selectIsAddingUser,
  userAdd,
} from '../../features/usersSlice';
import { MessageBar } from '../MessageBar/MessageBar';

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

export const MailUserAdd: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  const dispatch = useDispatch();
  const userAddResponse = useSelector(selectAddUserResponse);
  const userAddError = useSelector(selectAddUserError);
  const isAddingUser = useSelector(selectIsAddingUser);
  const [privilege, setPrivilege] = useState<IDropdownOption>(
    privilegeOptions[0]
  );

  const [email, setEmail] = useState<string>('');
  const onEmailChange = useCallback(
    (ev: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setEmail(newValue ?? '');
    },
    []
  );
  const [password, setPassword] = useState<string>('');
  const onPasswordChange = useCallback(
    (ev: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setPassword(newValue ?? '');
    },
    []
  );
  const onPrivilegeChange = useCallback(
    (
      event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      if (option) {
        setPrivilege(option);
      }
    },
    []
  );

  const onFormSubmit = useCallback(
    (ev: React.FormEvent<HTMLElement>): void => {
      ev.preventDefault();
      dispatch(userAdd(email, password, privilege.key as MailUserPrivilege));
    },
    [dispatch, email, password, privilege.key]
  );
  return (
    <>
      <Dialog
        hidden={!userAddResponse}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
        minWidth={480}
        maxWidth={480}
      >
        {userAddResponse}
      </Dialog>
      <Stack as="form" gap="l2" horizontal {...props} onSubmit={onFormSubmit}>
        <Stack gap="m" grow={1} className={columnClassName}>
          <Text>
            Add an email address to this system. This will create a new login
            username/password.
          </Text>
          <MessageBar messageBarType={MessageBarType.warning} isMultiline>
            Passwords must be at least eight characters consisting of English
            lettters and numbers only. For best results,
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
        <Stack gap="m" grow={1} className={columnClassName}>
          <TextField
            label="Email"
            type="email"
            required
            onChange={onEmailChange}
            value={email}
          />
          <TextField
            label="Password"
            type="password"
            required
            onChange={onPasswordChange}
            value={password}
          />
          <Dropdown
            label="Privilege"
            required
            options={privilegeOptions}
            selectedKey={privilege.key}
            onChange={onPrivilegeChange}
          />
          <Stack horizontal>
            <PrimaryButton type="submit">Add User</PrimaryButton>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
