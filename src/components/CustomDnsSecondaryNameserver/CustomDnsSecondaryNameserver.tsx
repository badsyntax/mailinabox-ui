import {
  IStackProps,
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

export const CustomDnsSecondaryNameserver: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  return (
    <Stack as="section" gap="l2" horizontal {...props}>
      <Stack gap="m" grow={1} className={columnClassName}>
        <Text>
          If your TLD requires you to have two separate nameservers, you can
          either set up external DNS and ignore the DNS server on this box
          entirely, or use the DNS server on this box but add a secondary (aka
          “slave”) nameserver.
        </Text>
        <Text>
          If you choose to use a secondary nameserver, you must find a secondary
          nameserver service provider. Your domain name registrar or virtual
          cloud provider may provide this service for you. Once you set up the
          secondary nameserver service, enter the hostname (not the IP address)
          of their secondary nameserver in field.
        </Text>
      </Stack>
      <Stack gap="m" grow={1} className={columnClassName}>
        <MessageBar messageBarType={MessageBarType.info} isMultiline>
          Multiple secondary servers can be separated with commas or spaces
          (i.e., ns2.hostingcompany.com ns3.hostingcompany.com).
          <br /> To enable zone transfers to additional servers without listing
          them as secondary nameservers, add an IP address or subnet using
          xfr:10.20.30.40 or xfr:10.20.30.40/24.
        </MessageBar>
        <TextField
          label="Hostname"
          required
          placeholder="ns1.cloudprovider.com"
        />
        <Stack horizontal>
          <PrimaryButton>Update</PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
