import {
  Dropdown,
  IStackProps,
  Link,
  mergeStyles,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import React from 'react';
import { MessageBar } from '../MessageBar/MessageBar';

const columnClassName = mergeStyles({
  flexBasis: 0,
});

export const MailUserAdd: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  // const [type, setType] = useState<IDropdownOption>();
  // const onTypeChange = useCallback(
  //   (
  //     event: React.FormEvent<HTMLDivElement>,
  //     option?: IDropdownOption
  //   ): void => {
  //     setType(option);
  //   },
  //   []
  // );
  return (
    <Stack as="section" gap="l2" horizontal {...props}>
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
          User accounts cannot contain any international (non-ASCII) characters,
          but<Link href="#">aliases</Link> can.
        </MessageBar>
      </Stack>
      <Stack gap="m" grow={1} className={columnClassName}>
        <TextField label="Email" type="email" required />
        <TextField label="Password" type="password" required />
        <Dropdown
          label="Privilege"
          required
          options={[
            {
              key: '',
              text: 'Normal User',
            },
            {
              key: 'admin',
              text: 'Administrator',
            },
          ]}
        />
        <Stack horizontal>
          <PrimaryButton>Add User</PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
