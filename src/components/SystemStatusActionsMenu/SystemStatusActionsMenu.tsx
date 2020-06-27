import {
  CommandBarButton,
  DirectionalHint,
  getTheme,
  IOverflowSetItemProps,
  OverflowSet,
  TooltipDelay,
  TooltipHost,
} from '@fluentui/react';
import { useId } from '@uifabric/react-hooks';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsUpdatingPrivacy,
  systemPrivacyUpdate,
} from '../../features/system/privacySlice';

const theme = getTheme();

const calloutProps = { gapSpace: 0 };
const actionButtonContainerStyles = {
  root: { width: '100%' },
};

const onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
  const button = (
    <CommandBarButton
      role="menuitem"
      aria-label={item.name}
      styles={{
        root: {
          padding: theme.spacing.m,
          textAlign: 'left',
          ...actionButtonContainerStyles.root,
        },
      }}
      disabled={item.disabled}
      iconProps={{ iconName: item.icon }}
      text={item.name}
      onClick={item.onClick}
    />
  );
  return item.tooltip ? (
    <TooltipHost
      content={item.tooltip}
      id={item.tooltipId}
      calloutProps={calloutProps}
      styles={actionButtonContainerStyles}
      delay={TooltipDelay.zero}
      directionalHint={DirectionalHint.topCenter}
    >
      {button}
    </TooltipHost>
  ) : (
    button
  );
};

const onRenderOverflowButton = (): null => null;

interface StatusActionsMenuProps {
  privacy: boolean;
  reboot: boolean;
}

export const SystemStatusActionsMenu: React.FunctionComponent<StatusActionsMenuProps> = ({
  privacy,
  reboot,
}) => {
  const dispatch = useDispatch();
  const isUpdatingPrivacy = useSelector(selectIsUpdatingPrivacy);
  const onPrivacyButtonClick = useCallback(() => {
    dispatch(systemPrivacyUpdate(!privacy));
  }, [dispatch, privacy]);
  return (
    <OverflowSet
      role="menubar"
      vertical
      styles={{
        root: {
          width: '100%',
          boxShadow: theme.effects.elevation4,
          backgroundColor: theme.palette.white,
        },
      }}
      items={[
        {
          key: 'item1',
          icon: 'DisableUpdates',
          name: `${privacy ? 'Enable' : 'Disable'} New-Version Check`,
          tooltip: privacy
            ? 'When enabled, status checks phone-home to check for a new release of Mail-in-a-Box.'
            : null,
          tooltipId: useId('tooltip'),
          disabled: isUpdatingPrivacy,
          onClick: onPrivacyButtonClick,
        },
        {
          key: 'item2',
          icon: 'Sync',
          name: 'Reboot Server',
          disabled: !reboot,
        },
      ]}
      onRenderOverflowButton={onRenderOverflowButton}
      onRenderItem={onRenderItem}
    />
  );
};
