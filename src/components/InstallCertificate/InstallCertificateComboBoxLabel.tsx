import React from 'react';
import {
  IOnRenderComboBoxLabelProps,
  Stack,
  IconButton,
  Callout,
  DefaultButton,
  Text,
} from '@fluentui/react';
import { useBoolean, useId } from '@uifabric/react-hooks';

export const InstallCertificateComboBoxLabel: React.FunctionComponent<
  IOnRenderComboBoxLabelProps & {
    defaultRender: (props?: IOnRenderComboBoxLabelProps) => JSX.Element | null;
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
          <Stack
            horizontalAlign="start"
            tokens={{ padding: 'm', childrenGap: 'm' }}
          >
            <Text>
              A multi-domain or wildcard certificate will be automatically
              applied to any domains it is valid for besides the one you choose
              above.
            </Text>
            <DefaultButton onClick={toggleIsCalloutVisible}>
              Close
            </DefaultButton>
          </Stack>
        </Callout>
      )}
    </>
  );
};
