import React from 'react';
import {
  mergeStyles,
  AnimationStyles,
  IMessageBarProps,
  MessageBar as FluentMessageBar,
} from '@fluentui/react';

const messageBarClassName = mergeStyles({
  ...AnimationStyles.fadeIn200,
});

export const MessageBar: React.FunctionComponent<IMessageBarProps> = (
  props
) => <FluentMessageBar className={messageBarClassName} {...props} />;
