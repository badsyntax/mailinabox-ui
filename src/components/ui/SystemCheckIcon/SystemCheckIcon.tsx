import { FontSizes, getTheme, Icon } from '@fluentui/react';
import { StatusEntryType } from 'mailinabox-api';
import React from 'react';

const theme = getTheme();

function getIconName(type: string): string {
  switch (type) {
    case StatusEntryType.Ok:
      return 'Accept';
    case StatusEntryType.Error:
      return 'Error';
    case StatusEntryType.Warning:
    default:
      return 'Warning';
  }
}

function getIconColor(type: string): string {
  switch (type) {
    case StatusEntryType.Ok:
      return theme.palette.green;
    case StatusEntryType.Error:
      return theme.palette.red;
    case StatusEntryType.Warning:
    default:
      return theme.palette.yellowDark;
  }
}

interface SystemCheckIconProps {
  type: StatusEntryType;
}

export const SystemCheckIcon: React.FunctionComponent<SystemCheckIconProps> = ({
  type,
}) => {
  return (
    <Icon
      iconName={getIconName(type)}
      styles={{
        root: {
          color: getIconColor(type),
          fontSize: FontSizes.medium,
          verticalAlign: 'middle',
        },
      }}
    />
  );
};
