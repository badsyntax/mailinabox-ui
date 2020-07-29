import {
  Callout,
  DefaultButton,
  IconButton,
  IOnRenderComboBoxLabelProps,
  Stack,
  Text,
} from '@fluentui/react';
import { useBoolean, useId } from '@uifabric/react-hooks';
import React from 'react';

export const InstallCertificateComboBoxLabel: React.FunctionComponent<
  IOnRenderComboBoxLabelProps & {
    defaultRender: (props?: IOnRenderComboBoxLabelProps) => JSX.Element | null;
    calloutText: string;
  }
> = (props?): JSX.Element => {
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(
    false
  );
  const descriptionId: string = useId('description');
  const iconButtonId: string = useId('iconButton');

  return (
    <>
      <Stack horizontal verticalAlign="center">
        {props?.defaultRender(props)}
        <IconButton
          id={iconButtonId}
          title="Info"
          ariaLabel="Info"
          iconProps={{ iconName: 'Info' }}
          onClick={toggleIsCalloutVisible}
        />
      </Stack>
      {isCalloutVisible && (
        <Callout
          target={'#' + iconButtonId}
          setInitialFocus
          onDismiss={toggleIsCalloutVisible}
          ariaDescribedBy={descriptionId}
          role="alertdialog"
          styles={{
            root: {
              maxWidth: 320,
            },
          }}
        >
          <Stack horizontalAlign="start" padding="m" gap="m">
            <Text>{props.calloutText}</Text>
            <DefaultButton onClick={toggleIsCalloutVisible}>
              Close
            </DefaultButton>
          </Stack>
        </Callout>
      )}
    </>
  );
};
