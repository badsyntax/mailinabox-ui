import { MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectPrivacy } from '../../../features/system/privacySlice';
import { selectReboot } from '../../../features/system/rebootSlice';
import { SystemStatusActionsMenu } from '../SystemStatusActionsMenu/SystemStatusActionsMenu';

export const SystemStatusActions: React.FunctionComponent = () => {
  const privacy = useSelector(selectPrivacy);
  const reboot = useSelector(selectReboot);
  return (
    <>
      {!reboot && (
        <MessageBar messageBarType={MessageBarType.success} isMultiline>
          No reboot is necessary.
        </MessageBar>
      )}
      {reboot && (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline>
          A reboot is required.
        </MessageBar>
      )}
      {/* TODO: SHOW ERRORS FOR UPDATING PRIVACY AND REBOOTING */}
      <SystemStatusActionsMenu privacy={privacy} reboot={reboot} />
    </>
  );
};
