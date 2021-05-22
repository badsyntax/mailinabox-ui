import {
  Callout,
  DefaultButton,
  IButtonStyles,
  IconButton,
  Stack,
  Text,
} from '@fluentui/react';
import { useBoolean, useId } from '@uifabric/react-hooks';
import React from 'react';

interface Props {
  maxWidth?: number;
  iconButtonClassName?: string;
  iconButtonStyles: IButtonStyles;
  text: string;
  showCloseButton?: boolean;
}

export const InfoButton: React.FunctionComponent<Props> = ({
  text,
  maxWidth = 320,
  showCloseButton = true,
  iconButtonClassName,
  iconButtonStyles,
}) => {
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const iconButtonId: string = useId('iconButton');
  return (
    <>
      <IconButton
        id={iconButtonId}
        title="Info"
        text="Info"
        ariaLabel="Info"
        iconProps={{
          iconName: 'Info',
        }}
        onClick={toggleIsCalloutVisible}
        className={iconButtonClassName}
        styles={iconButtonStyles}
      />
      {isCalloutVisible && (
        <Callout
          target={'#' + iconButtonId}
          setInitialFocus
          onDismiss={toggleIsCalloutVisible}
          role="alertdialog"
          styles={{
            root: {
              maxWidth,
            },
          }}
        >
          <Stack horizontalAlign="start" padding="m" gap="m">
            <Text>{text}</Text>
            {showCloseButton && (
              <DefaultButton onClick={toggleIsCalloutVisible}>
                Close
              </DefaultButton>
            )}
          </Stack>
        </Callout>
      )}
    </>
  );
};
