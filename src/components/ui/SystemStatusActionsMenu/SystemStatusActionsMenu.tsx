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
import { updatePrivacy } from '../../../features/system/privacySlice';
import { RootState } from '../../../store';

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

export const SystemStatusActionsMenu: React.FunctionComponent = () => {
  const { isUpdatingPrivacy, status: privacyStatus } = useSelector(
    (state: RootState) => state.system.privacy
  );
  const { status: rebootStatus } = useSelector(
    (state: RootState) => state.system.reboot
  );

  const dispatch = useDispatch();
  const onPrivacyButtonClick = useCallback(() => {
    dispatch(updatePrivacy(!privacyStatus));
  }, [dispatch, privacyStatus]);
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
          name: `${privacyStatus ? 'Enable' : 'Disable'} New-Version Check`,
          tooltip: privacyStatus
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
          disabled: !rebootStatus,
        },
      ]}
      onRenderOverflowButton={onRenderOverflowButton}
      onRenderItem={onRenderItem}
    />
  );
};
