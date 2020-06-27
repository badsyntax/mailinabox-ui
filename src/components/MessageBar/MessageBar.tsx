import {
  AnimationStyles,
  IMessageBarProps,
  mergeStyles,
  MessageBar as FluentMessageBar,
} from '@fluentui/react';
import React from 'react';

const messageBarClassName = mergeStyles({
  ...AnimationStyles.fadeIn400,
});

export const MessageBar: React.FunctionComponent<IMessageBarProps> = (
  props
) => <FluentMessageBar className={messageBarClassName} {...props} />;
