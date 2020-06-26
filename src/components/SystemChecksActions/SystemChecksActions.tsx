import React from 'react';
import {
  IContextualMenuProps,
  DirectionalHint,
  DefaultButton,
} from '@fluentui/react';

const menuProps: IContextualMenuProps = {
  directionalHint: DirectionalHint.bottomRightEdge,
  items: [
    {
      key: 'disableVersionCheck',
      text: 'Disable New-Version Check',
      iconProps: { iconName: 'DisableUpdates' },
    },
    {
      key: 'reboot',
      text: 'Reboot Server',
      iconProps: { iconName: 'Sync' },
      disabled: true,
    },
  ],
};

export const SystemChecksActions: React.FunctionComponent = () => {
  return (
    <DefaultButton
      text="Status Check Actions"
      iconProps={{ iconName: 'Settings' }}
      menuProps={menuProps}
    />
  );
};
