import {
  Breadcrumb,
  getTheme,
  IGroup,
  Link,
  mergeStyles,
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  PivotLinkSize,
  ProgressIndicator,
  Stack,
  Text,
} from '@fluentui/react';
import { DNSDumpDomainRecord, DNSDumpDomains } from 'mailinabox-api';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDump } from '../../../../../features/dnsSlice';
import { RootState } from '../../../../../store';
import { Body } from '../../../../ui/Body/Body';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { DnsDumpList } from '../../../../ui/DnsDumpList/DnsDumpList';
import { DnsZoneFileGenerator } from '../../../../ui/DnsZoneFileGenerator/DnsZoneFileGenerator';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

const ExternalDnsSections: React.FunctionComponent = () => {
  const { dump } = useSelector((state: RootState) => state.dns);

  const records: Array<DNSDumpDomainRecord> = [];
  const groups: Array<IGroup> = [];

  dump.forEach((dnsDomains: DNSDumpDomains) => {
    const [domainName, dnsRecords] = dnsDomains;
    groups.push({
      key: 'group' + groups.length,
      name: domainName as string,
      startIndex: records.length,
      isCollapsed: false,
      level: 0,
      count: dnsRecords.length,
    });
    records.push(...(dnsRecords as Array<DNSDumpDomainRecord>));
  });
  return (
    <Pivot linkSize={PivotLinkSize.large}>
      <PivotItem headerText="DNS Records">
        <DnsDumpList records={records} groups={groups} className={className} />
      </PivotItem>
      <PivotItem headerText="Zone File Generator" className={className}>
        <DnsZoneFileGenerator />
      </PivotItem>
    </Pivot>
  );
};

export const ExternalDns: React.FunctionComponent & {
  path: string;
} = () => {
  const { isGettingDump, getDumpError } = useSelector(
    (state: RootState) => state.dns
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDump());
  }, [dispatch]);

  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Breadcrumb
          styles={{
            root: {
              marginTop: 0,
            },
          }}
          items={[
            {
              text: 'System',
              key: 'system',
            },
            {
              text: 'External DNS',
              key: 'externaldns',
              as: 'h1',
            },
          ]}
        />
      </Stack>
      <MessageBar messageBarType={MessageBarType.warning} isMultiline>
        This is an advanced configuration page.
      </MessageBar>
      <BodyPanel>
        <Text>
          Although your box is configured to serve its own DNS, it is possible
          to host your DNS elsewhere — such as in the DNS control panel provided
          by your domain name registrar or virtual cloud provider — by copying
          the DNS zone information shown in the table below into your external
          DNS server’s control panel.
        </Text>
        <Text>
          If you do so, you are responsible for keeping your DNS entries up to
          date! If you previously enabled DNSSEC on your domain name by setting
          a DS record at your registrar, you will likely have to turn it off
          before changing nameservers.
        </Text>
        <MessageBar messageBarType={MessageBarType.info} isMultiline>
          You may encounter zone file errors when attempting to create a TXT
          record with a long string.
          <Link href="http://tools.ietf.org/html/rfc4408#section-3.1.3">
            RFC 4408
          </Link>{' '}
          states a TXT record is allowed to contain multiple strings, and this
          technique can be used to construct records that would exceed the
          255-byte maximum length. You may need to adopt this technique when
          adding DomainKeys. Use a tool like
          <Link href="http://manpages.ubuntu.com/manpages/bionic/man8/named-checkzone.8.html">
            <code>named-checkzone</code>
          </Link>{' '}
          to validate your zone file.
        </MessageBar>
      </BodyPanel>
      <BodyPanel>
        {getDumpError && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {getDumpError}
          </MessageBar>
        )}
        {isGettingDump && <ProgressIndicator label="Getting DNS dump..." />}
        {!isGettingDump && !getDumpError && <ExternalDnsSections />}
      </BodyPanel>
    </Body>
  );
};

ExternalDns.path = '/dns/external';
