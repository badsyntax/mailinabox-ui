import {
  Breadcrumb,
  getTheme,
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
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCustomRecords,
  getSecondaryNameserver,
  getZones,
  selectCustomRecordsSorted,
} from '../../../../../features/dnsSlice';
import { RootState } from '../../../../../store';
import { Body } from '../../../../ui/Body/Body';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { CustomDnsAdd } from '../../../../ui/CustomDnsAdd/CustomDnsAdd';
import { CustomDnsRecordsList } from '../../../../ui/CustomDnsRecordsList/CustomDnsRecordsList';
import { CustomDnsSecondaryNameserver } from '../../../../ui/CustomDnsSecondaryNameserver/CustomDnsSecondaryNameserver';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

const CustomDnsSections: React.FunctionComponent = () => {
  const customDnsRecords = useSelector(selectCustomRecordsSorted);
  return (
    <Pivot linkSize={PivotLinkSize.large}>
      <PivotItem headerText="DNS Records">
        <CustomDnsRecordsList
          className={className}
          records={customDnsRecords}
        />
      </PivotItem>
      <PivotItem headerText="Add Custom Record">
        <CustomDnsAdd className={className} />
      </PivotItem>
      <PivotItem headerText="Secondary Nameserver">
        <CustomDnsSecondaryNameserver className={className} />
      </PivotItem>
    </Pivot>
  );
};

export const CustomDns: React.FunctionComponent & {
  path: string;
} = () => {
  const {
    isGettingSecondaryNameserver,
    isGettingZones,
    isGettingCustomRecords,
    getSecondaryNameserverError,
    getZonesError,
    getCustomRecordsError,
  } = useSelector((state: RootState) => state.dns);
  const dispatch = useDispatch();

  const error =
    getSecondaryNameserverError || getZonesError || getCustomRecordsError;
  const isChecking =
    isGettingSecondaryNameserver || isGettingZones || isGettingCustomRecords;

  useEffect(() => {
    dispatch(getSecondaryNameserver());
    dispatch(getZones());
    dispatch(getCustomRecords());
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
              text: 'Custom DNS',
              key: 'customdns',
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
          It is possible to set custom DNS records on domains hosted here.
        </Text>
      </BodyPanel>
      <BodyPanel>
        {Boolean(error) && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {error}
          </MessageBar>
        )}
        {isChecking && <ProgressIndicator label="Checking DNS status..." />}
        {!isChecking && !error && <CustomDnsSections />}
      </BodyPanel>
    </Body>
  );
};

CustomDns.path = '/dns/custom';
