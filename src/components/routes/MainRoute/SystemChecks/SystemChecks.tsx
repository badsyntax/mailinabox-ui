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
import { Body } from '../../../Body/Body';
import { BodyPanel } from '../../../BodyPanel/BodyPanel';
import {
  systemStatusCheck,
  selectIsCheckingStatus,
  selectSystemStatusItemsAndGroups,
  selectStatusError,
} from '../../../../features/system/statusSlice';
import { useDispatch, useSelector } from 'react-redux';
import { SystemChecksDetailsList } from '../../../SystemChecksDetailsList/SystemChecksDetailsList';
import { systemRebootCheck } from '../../../../features/system/rebootSlice';
import { systemPrivacyCheck } from '../../../../features/system/privacySlice';
import { StatusChart } from './StatusChart';
import { StatusActions } from './StatusActions';

const messageBarClassName = mergeStyles({
  ...AnimationStyles.fadeIn500,
});

export const SystemChecks: React.FunctionComponent & { path: string } = () => {
  const dispatch = useDispatch();
  const isCheckingState = useSelector(selectIsCheckingStatus);
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
      {!isCheckingState && (
        <Stack horizontal tokens={{ childrenGap: 'l1' }}>
          <BodyPanel grow={1} styles={{ root: { flexBasis: 0 } }}>
            <StatusChart />
          </BodyPanel>
          <BodyPanel
            grow={1}
            styles={{ root: { flexBasis: 0 } }}
            horizontalAlign="start"
          >
            <StatusActions />
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
        {isCheckingState && (
          <ProgressIndicator label="Checking system status..." />
        )}
        {!isCheckingState && !statusError && (
          <SystemChecksDetailsList items={items} groups={groups} />
        )}
      </BodyPanel>
    </Body>
  );
};

SystemChecks.path = '/system';
