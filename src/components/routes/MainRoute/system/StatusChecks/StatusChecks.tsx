import React, { useEffect } from 'react';
import {
  Text,
  ProgressIndicator,
  Stack,
  MessageBar,
  MessageBarType,
  mergeStyles,
  AnimationStyles,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Body } from '../../../../Body/Body';
import { BodyPanel } from '../../../../BodyPanel/BodyPanel';
import {
  systemStatusCheck,
  selectIsCheckingStatus,
  selectSystemStatusItemsAndGroups,
  selectStatusError,
} from '../../../../../features/system/statusSlice';
import { SystemChecksDetailsList } from '../../../../SystemChecksDetailsList/SystemChecksDetailsList';
import { systemRebootCheck } from '../../../../../features/system/rebootSlice';
import { systemPrivacyCheck } from '../../../../../features/system/privacySlice';
import { SystemStatusChart } from '../../../../SystemStatusChart/SystemStatusChart';
import { SystemStatusActions } from '../../../../SystemStatusActions/SystemStatusActions';

const messageBarClassName = mergeStyles({
  ...AnimationStyles.fadeIn500,
});

export const StatusChecks: React.FunctionComponent & { path: string } = () => {
  const dispatch = useDispatch();
  const isCheckingStatus = useSelector(selectIsCheckingStatus);
  const statusError = useSelector(selectStatusError);

  const [items, groups] = useSelector(selectSystemStatusItemsAndGroups);

  useEffect(() => {
    dispatch(systemStatusCheck());
    dispatch(systemRebootCheck());
    dispatch(systemPrivacyCheck());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text as="h1" block variant="xLarge">
          Status Checks
        </Text>
      </Stack>
      {!isCheckingStatus && (
        <Stack horizontal tokens={{ childrenGap: 'l1' }}>
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
        {statusError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline
            className={messageBarClassName}
          >
            {statusError}
          </MessageBar>
        )}
        {isCheckingStatus && (
          <ProgressIndicator label="Checking system status..." />
        )}
        {!isCheckingStatus && !statusError && (
          <SystemChecksDetailsList items={items} groups={groups} />
        )}
      </BodyPanel>
    </Body>
  );
};

StatusChecks.path = '/system/status';
