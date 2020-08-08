import {
  DefaultButton,
  Dialog,
  IDialogProps,
  MessageBarType,
  PrimaryButton,
  Stack,
} from '@fluentui/react';
import React from 'react';
import { DialogFooter } from '../DialogFooter/DialogFooter';
import { MessageBar } from '../MessageBar/MessageBar';
import { Pre } from '../Pre/Pre';

interface ActionConfirmDialogProps {
  onConfirm: () => void;
  hidden: boolean;
  isLoading: boolean;
  error: string | null;
  confirmButtonText: string;
  showCancelButton?: boolean;
  actionResponse?: string | null;
}

export const ActionConfirmDialog: React.FunctionComponent<
  IDialogProps & ActionConfirmDialogProps
> = ({
  hidden,
  onConfirm,
  isLoading,
  error,
  confirmButtonText,
  children,
  actionResponse,
  ...rest
}) => {
  const onConfirmButtonClick = (): void => {
    if (!actionResponse) {
      onConfirm();
    } else if (rest.onDismiss) {
      rest.onDismiss();
    }
  };
  const onCancelButtonClick = (): void => {
    if (rest.onDismiss) {
      rest.onDismiss();
    }
  };
  return (
    <Dialog hidden={hidden} minWidth={380} maxWidth={480} {...rest}>
      <Stack gap="m">
        {error && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {error}
          </MessageBar>
        )}
        {actionResponse && <Pre>{actionResponse}</Pre>}
        {!actionResponse && children}
      </Stack>
      <DialogFooter isLoading={isLoading}>
        <PrimaryButton
          disabled={isLoading}
          text={!actionResponse ? confirmButtonText : 'OK'}
          onClick={onConfirmButtonClick}
        />
        {!actionResponse && (
          <DefaultButton
            disabled={isLoading}
            text="Cancel"
            onClick={onCancelButtonClick}
          />
        )}
      </DialogFooter>
    </Dialog>
  );
};
