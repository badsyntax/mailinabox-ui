import {
  Callout,
  getTheme,
  IconButton,
  ITextFieldProps,
  mergeStyles,
  Stack,
  Text,
} from '@fluentui/react';
import { useBoolean, useId } from '@uifabric/react-hooks';
import React from 'react';

const theme = getTheme();

const iconButtonClassName = mergeStyles({
  marginBottom: '-3px',
});

type Props = ITextFieldProps & {
  defaultRender?: (props?: ITextFieldProps) => JSX.Element | null;
  calloutText?: React.ReactNode;
  maxWidth?: number;
};

export const TextFieldWithInfo: React.FunctionComponent<Props> = (
  props
): JSX.Element => {
  const { maxWidth = 320, defaultRender, ...rest } = props;
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(
    false
  );
  const iconButtonId: string = useId('iconButton');
  return (
    <>
      <Stack horizontal verticalAlign="center">
        {defaultRender?.(rest)}
        <IconButton
          id={iconButtonId}
          title="Info"
          ariaLabel="Info"
          iconProps={{ iconName: 'Info' }}
          onClick={toggleIsCalloutVisible}
          className={iconButtonClassName}
        />
      </Stack>
      {isCalloutVisible && (
        <Callout
          target={'#' + iconButtonId}
          onDismiss={toggleIsCalloutVisible}
          role="alertdialog"
          styles={{
            root: {
              maxWidth,
            },
          }}
        >
          <Stack horizontalAlign="start" padding="m" gap="m">
            <Text>{props.calloutText}</Text>
          </Stack>
        </Callout>
      )}
    </>
  );
};

export const onRenderTextFieldLabel = (calloutText: React.ReactNode) => (
  props?: ITextFieldProps,
  defaultRender?: (props?: ITextFieldProps) => JSX.Element | null
): React.ReactElement | null => (
  <TextFieldWithInfo
    {...props}
    calloutText={calloutText}
    defaultRender={defaultRender}
  />
);

export const textfieldWithLabelInfoStyles = {
  subComponentStyles: {
    label: {
      root: {
        selectors: {
          ':after': {
            paddingRight: theme.spacing.s2,
          },
        },
      },
    },
  },
};
