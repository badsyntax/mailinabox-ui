import { FontSizes, getTheme, Icon } from '@fluentui/react';
import { StatusEntryTypeEnum } from 'mailinabox-api';
import React from 'react';

const theme = getTheme();

function getIconName(type: string): string {
  switch (type) {
    case StatusEntryTypeEnum.Ok:
      return 'Accept';
    case StatusEntryTypeEnum.Error:
      return 'Error';
    case StatusEntryTypeEnum.Warning:
    default:
      return 'Warning';
  }
}

function getIconColor(type: string): string {
  switch (type) {
    case StatusEntryTypeEnum.Ok:
      return theme.palette.green;
    case StatusEntryTypeEnum.Error:
      return theme.palette.red;
    case StatusEntryTypeEnum.Warning:
    default:
      return theme.palette.yellowDark;
  }
}

interface SystemCheckIconProps {
  type: StatusEntryTypeEnum;
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
