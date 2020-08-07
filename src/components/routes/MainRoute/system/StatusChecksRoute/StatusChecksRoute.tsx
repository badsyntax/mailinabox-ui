import {
  AnimationStyles,
  mergeStyles,
  MessageBar,
  MessageBarType,
  ProgressIndicator,
  ScreenWidthMinLarge,
  Stack,
} from '@fluentui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { systemPrivacyCheck } from '../../../../../features/system/privacySlice';
import { systemRebootCheck } from '../../../../../features/system/rebootSlice';
import {
  selectSystemStatusItemsAndGroups,
  systemStatusCheck,
} from '../../../../../features/system/statusSlice';
import { RootState } from '../../../../../store';
import { Body } from '../../../../ui/Body/Body';
import { BodyBreadcrumb } from '../../../../ui/BodyBreadcrumb/BodyBreadcrumb';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { SystemChecksDetailsList } from '../../../../ui/SystemChecksDetailsList/SystemChecksDetailsList';
import { SystemStatusActions } from '../../../../ui/SystemStatusActions/SystemStatusActions';
import { SystemStatusChart } from '../../../../ui/SystemStatusChart/SystemStatusChart';

const messageBarClassName = mergeStyles({
  ...AnimationStyles.fadeIn500,
});

export const StatusChecksRoute: React.FunctionComponent & {
  path: string;
} = () => {
  const { isGettingStatus, getStatusError } = useSelector(
    (state: RootState) => state.system.status
  );

  const dispatch = useDispatch();
  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });

  const [items, groups] = useSelector(selectSystemStatusItemsAndGroups);

  useEffect(() => {
    dispatch(systemStatusCheck());
    dispatch(systemRebootCheck());
    dispatch(systemPrivacyCheck());
  }, [dispatch]);

  return (
    <Body>
      <Stack
        horizontal={isMinLargeScreen}
        horizontalAlign="space-between"
        verticalAlign="center"
      >
        <BodyBreadcrumb
          items={[
            {
              text: 'System',
              key: 'system',
            },
            {
              text: 'Status Checks',
              key: 'statuschecks',
              as: 'h1',
            },
          ]}
        />
      </Stack>
      <Stack gap="l1">
        {!isGettingStatus && !getStatusError && (
          <Stack horizontal={isMinLargeScreen} gap="l1">
            <BodyPanel grow={1} styles={{ root: { flexBasis: 0 } }}>
              <SystemStatusChart />
            </BodyPanel>
            <BodyPanel
              grow={1}
              styles={{ root: { flexBasis: 0 } }}
              horizontalAlign="start"
            >
              <SystemStatusActions />
            </BodyPanel>
          </Stack>
        )}
        <BodyPanel>
          {getStatusError && (
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline
              className={messageBarClassName}
            >
              {getStatusError}
            </MessageBar>
          )}
          {isGettingStatus && (
            <ProgressIndicator label="Checking system status..." />
          )}
          {!isGettingStatus && !getStatusError && (
            <SystemChecksDetailsList items={items} groups={groups} />
          )}
        </BodyPanel>
      </Stack>
    </Body>
  );
};

StatusChecksRoute.path = '/system/status';
