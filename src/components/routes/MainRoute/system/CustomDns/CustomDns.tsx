import {
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
  dnsCustomRecordsCheck,
  dnsSecondaryNameserverCheck,
  dnsZonesCheck,
  selectGetCustomRecordsError,
  selectGetCustomRecordsSorted,
  selectGetSecondaryNameserverError,
  selectGetZonesError,
  selectIsCheckingCustomRecords,
  selectIsCheckingSecondaryNameserver,
  selectIsCheckingZones,
} from '../../../../../features/dnsSlice';
import { Body } from '../../../../Body/Body';
import { BodyPanel } from '../../../../BodyPanel/BodyPanel';
import { CustomDnsAdd } from '../../../../CustomDnsAdd/CustomDnsAdd';
import { CustomDnsRecordsList } from '../../../../CustomDnsRecordsList/CustomDnsRecordsList';
import { CustomDnsSecondaryNameserver } from '../../../../CustomDnsSecondaryNameserver/CustomDnsSecondaryNameserver';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

const CustomDnsSections: React.FunctionComponent = () => {
  const customDnsRecords = useSelector(selectGetCustomRecordsSorted);
  return (
    <Pivot linkSize={PivotLinkSize.large}>
      <PivotItem headerText="DNS Records">
        <CustomDnsRecordsList
          className={className}
          records={customDnsRecords}
        />
      </PivotItem>
      <PivotItem headerText="Add Record">
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
  const dispatch = useDispatch();
  const isCheckingSecondaryNameserver = useSelector(
    selectIsCheckingSecondaryNameserver
  );
  const isCheckingZones = useSelector(selectIsCheckingZones);
  const isCheckingCustom = useSelector(selectIsCheckingCustomRecords);

  const nameserverError = useSelector(selectGetSecondaryNameserverError);
  const zonesError = useSelector(selectGetZonesError);
  const customError = useSelector(selectGetCustomRecordsError);

  const hasError = nameserverError || zonesError || customError;
  const isChecking =
    isCheckingSecondaryNameserver || isCheckingZones || isCheckingCustom;

  useEffect(() => {
    dispatch(dnsSecondaryNameserverCheck());
    dispatch(dnsZonesCheck());
    dispatch(dnsCustomRecordsCheck());
  }, [dispatch]);

  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text as="h1" block variant="xLarge">
          Custom DNS
        </Text>
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
        {hasError && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {nameserverError || zonesError || customError}
          </MessageBar>
        )}
        {isChecking && <ProgressIndicator label="Checking DNS status..." />}
        {!isChecking && !hasError && <CustomDnsSections />}
      </BodyPanel>
    </Body>
  );
};

CustomDns.path = '/dns/custom';
