import {
  Dropdown,
  IDropdownOption,
  IStackProps,
  mergeStyles,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import { MessageBar } from '../MessageBar/MessageBar';

const recordTypes: {
  [key: string]: {
    hint: string;
    text: string;
  };
} = {
  A: {
    hint:
      "Enter an IPv4 address (i.e. a dotted quad, such as 123.456.789.012).  The 'local' alias sets the record to this box's public IPv4 address.",
    text: 'A (IPv4 address)',
  },
  AAAA: {
    hint:
      "Enter an IPv6 address.  The 'local' alias sets the record to this box's public IPv6 address.",
    text: 'AAAA (IPv6 address)',
  },
  CAA: {
    hint:
      'Enter a CA that can issue certificates for this domain in the form of FLAG TAG VALUE. (0 issuewild &quot;letsencrypt.org&quot;)',
    text: 'CAA (Certificate Authority Authorization)',
  },
  CNAME: {
    hint:
      'Enter another domain name followed by a period at the end (e.g. mypage.github.io.).',
    text: 'CNAME (DNS forwarding)',
  },
  TXT: {
    hint: 'Enter arbitrary text.',
    text: 'TXT (text record)',
  },
  MX: {
    hint:
      'Enter record in the form of PRIORITY DOMAIN., including trailing period (e.g. 20 mx.example.com.).',
    text: 'MX (mail exchanger)',
  },
  SRV: {
    hint:
      'Enter record in the form of PRIORITY WEIGHT PORT TARGET., including trailing period (e.g. 10 10 5060 sip.example.com.).',
    text: 'SRV (service record)',
  },
  SSHFP: {
    hint: 'Enter record in the form of ALGORITHM TYPE FINGERPRINT.',
    text: 'SSHFP (SSH fingerprint record)',
  },
  NS: {
    hint: 'Enter a hostname to which this subdomain should be delegated to',
    text: 'NS (DNS subdomain delegation)',
  },
};

const recordTypeOptions = Object.keys(recordTypes).map((key) => ({
  key,
  text: recordTypes[key].text,
}));

const columnClassName = mergeStyles({
  flexBasis: 0,
});

export const CustomDnsAdd: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  const [type, setType] = useState<IDropdownOption>();
  const onTypeChange = useCallback(
    (
      event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      setType(option);
    },
    []
  );
  return (
    <Stack as="section" gap="l2" horizontal {...props}>
      <Stack gap="m" grow={1} className={columnClassName}>
        <Text>
          You can set additional DNS records, such as if you have a website
          running on another server, to add DKIM records for external mail
          providers, or for various confirmation-of-ownership tests.
        </Text>
      </Stack>
      <Stack gap="m" grow={1} className={columnClassName}>
        <Dropdown
          label="Domain"
          required
          options={[
            {
              key: 'foo',
              text: 'box.proxima-mail',
            },
          ]}
        />
        <TextField label="Name" placeholder="subdomain" />
        <Dropdown
          label="Type"
          required
          options={recordTypeOptions}
          selectedKey={type?.key}
          onChange={onTypeChange}
        />
        {type?.key && (
          <MessageBar messageBarType={MessageBarType.info} isMultiline>
            {recordTypes[type.key].hint}
          </MessageBar>
        )}
        <TextField label="Value" required />
        <Stack horizontal>
          <PrimaryButton>Save Record</PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
