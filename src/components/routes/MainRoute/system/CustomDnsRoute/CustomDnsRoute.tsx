import {
  MessageBar,
  MessageBarType,
  ProgressIndicator,
  Stack,
  Text,
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {
  getCustomRecords,
  getSecondaryNameserver,
  getZones,
} from '../../../../../features/dnsSlice';
import { RootState } from '../../../../../store';
import { Body } from '../../../../ui/Body/Body';
import { BodyBreadcrumb } from '../../../../ui/BodyBreadcrumb/BodyBreadcrumb';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { CustomDnsAdd } from '../../../../ui/CustomDnsAdd/CustomDnsAdd';
import { CustomDnsRecordsList } from '../../../../ui/CustomDnsRecordsList/CustomDnsRecordsList';
import { CustomDnsSecondaryNameserver } from '../../../../ui/CustomDnsSecondaryNameserver/CustomDnsSecondaryNameserver';
import { LoadingOverlay } from '../../../../ui/LoadingOverlay/LoadingOverlay';
import { LoadingOverlayContainer } from '../../../../ui/LoadingOverlay/LoadingOverlayContainer';
import { PivotRoutes } from '../../../../ui/PivotRoutes/PivotRoutes';

const CustomDnsSections: React.FunctionComponent = () => {
  const {
    isGettingSecondaryNameserver,
    isGettingZones,
    isGettingCustomRecords,
    getSecondaryNameserverError,
    getZonesError,
    getCustomRecordsError,
    zones,
    customRecords,
  } = useSelector((state: RootState) => state.dns);
  const dispatch = useDispatch();
  const { path, url } = useRouteMatch();
  const openedGroupsState = useState<string[]>([]);

  const pivotItems = [
    {
      itemKey: url,
      headerText: 'DNS Records',
    },
    {
      itemKey: `${url}/add`,
      headerText: 'Add Custom Record',
    },
    {
      itemKey: `${url}/nameserver`,
      headerText: 'Secondary Nameserver',
    },
  ];

  useEffect(() => {
    if (!zones.length) {
      dispatch(getZones());
    }
  }, [dispatch, zones]);

  useEffect(() => {
    if (!customRecords.length) {
      dispatch(getCustomRecords());
    }
  }, [customRecords, dispatch]);

  useEffect(() => {
    dispatch(getSecondaryNameserver());
  }, [dispatch]);
  return (
    <>
      <PivotRoutes items={pivotItems} />
      <Switch>
        <Route exact path={path}>
          <LoadingOverlayContainer>
            {isGettingCustomRecords && (
              <LoadingOverlay
                loadingLabel="Checking DNS status..."
                hasLoaded={Boolean(customRecords.length)}
              />
            )}
            {Boolean(getCustomRecordsError) && (
              <MessageBar messageBarType={MessageBarType.error}>
                {getCustomRecordsError}
              </MessageBar>
            )}
            {!getCustomRecordsError && Boolean(customRecords.length) && (
              <CustomDnsRecordsList openedGroupsState={openedGroupsState} />
            )}
          </LoadingOverlayContainer>
        </Route>
        <Route exact path={`${path}/add`}>
          {isGettingZones && <ProgressIndicator label="Checking Zones..." />}
          {Boolean(getZonesError) && (
            <MessageBar messageBarType={MessageBarType.error}>
              {getZonesError}
            </MessageBar>
          )}
          {!getZonesError && Boolean(zones.length) && <CustomDnsAdd />}
        </Route>
        <Route exact path={`${path}/nameserver`}>
          {isGettingSecondaryNameserver && (
            <ProgressIndicator label="Checking Secondary Nameserver..." />
          )}
          {Boolean(getSecondaryNameserverError) && (
            <MessageBar messageBarType={MessageBarType.error}>
              {getSecondaryNameserverError}
            </MessageBar>
          )}
          {!getSecondaryNameserverError && !isGettingSecondaryNameserver && (
            <CustomDnsSecondaryNameserver />
          )}
        </Route>
      </Switch>
    </>
  );
};

export const CustomDnsRoute: React.FunctionComponent & {
  path: string;
} = () => {
  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <BodyBreadcrumb
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
      <Stack gap="l1">
        <MessageBar messageBarType={MessageBarType.warning} isMultiline>
          This is an advanced configuration page.
        </MessageBar>
        <BodyPanel>
          <Text>
            It is possible to set custom DNS records on domains hosted here.
          </Text>
        </BodyPanel>
        <BodyPanel>
          <CustomDnsSections />
        </BodyPanel>
      </Stack>
    </Body>
  );
};

CustomDnsRoute.path = '/dns/custom';
