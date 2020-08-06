import { MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { SystemStatusActionsMenu } from '../SystemStatusActionsMenu/SystemStatusActionsMenu';

export const SystemStatusActions: React.FunctionComponent = () => {
  const { status: rebootStatus } = useSelector(
    (state: RootState) => state.system.reboot
  );
  return (
    <>
      {!rebootStatus && (
        <MessageBar messageBarType={MessageBarType.success}>
          No reboot is necessary.
        </MessageBar>
      )}
      {rebootStatus && (
        <MessageBar messageBarType={MessageBarType.warning}>
          A reboot is required.
        </MessageBar>
      )}
      {/* TODO: SHOW ERRORS FOR UPDATING PRIVACY AND REBOOTING */}
      <SystemStatusActionsMenu />
    </>
  );
};
