import {
  Breadcrumb,
  getTheme,
  mergeStyles,
  MessageBar,
  MessageBarType,
  PivotItem,
  ProgressIndicator,
  Stack,
  Text,
} from '@fluentui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
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
import { PivotRoutes } from '../../../../ui/PivotRoutes/PivotRoutes';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

const CustomDnsSections: React.FunctionComponent = () => {
  const customDnsRecords = useSelector(selectCustomRecordsSorted);
  const { path, url } = useRouteMatch();
  return (
    <>
      <PivotRoutes>
        <PivotItem itemKey={url} headerText="DNS Records" />
        <PivotItem itemKey={`${url}/add`} headerText="Add Custom Record" />
        <PivotItem
          itemKey={`${url}/nameserver`}
          headerText="Secondary Nameserver"
        />
      </PivotRoutes>
      <Switch>
        <Route exact path={path}>
          <CustomDnsRecordsList
            className={className}
            records={customDnsRecords}
          />
        </Route>
        <Route exact path={`${path}/add`}>
          <CustomDnsAdd className={className} />
        </Route>
        <Route exact path={`${path}/nameserver`}>
          <CustomDnsSecondaryNameserver className={className} />
        </Route>
      </Switch>
    </>
  );
};

export const CustomDnsRoute: React.FunctionComponent & {
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

CustomDnsRoute.path = '/dns/custom';
