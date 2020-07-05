import {
  DefaultButton,
  Dialog,
  IDialogContentProps,
  IModalProps,
  MessageBarType,
  PrimaryButton,
  Stack,
} from '@fluentui/react';
import React from 'react';
import { DialogFooter } from '../DialogFooter/DialogFooter';
import { MessageBar } from '../MessageBar/MessageBar';
import { Pre } from '../Pre/Pre';

interface MailUserUpdateConfirmDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  hidden: boolean;
  isLoading: boolean;
  error: string | null;
  dialogContentProps?: IDialogContentProps;
  modalProps?: IModalProps;
  confirmButtonText: string;
  showCancelButton?: boolean;
  updateUserResponse?: string | null;
}

export const MailUserUpdateConfirmDialog: React.FunctionComponent<MailUserUpdateConfirmDialogProps> = ({
  hidden,
  onClose,
  onConfirm,
  isLoading,
  error,
  dialogContentProps,
  modalProps,
  confirmButtonText,
  children,
  updateUserResponse,
}) => {
  return (
    <Dialog
      hidden={hidden}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
      onDismiss={onClose}
      minWidth={380}
      maxWidth={480}
    >
      <Stack gap="m">
        {error && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {error}
          </MessageBar>
        )}
        {updateUserResponse && <Pre>{updateUserResponse}</Pre>}
        {!updateUserResponse && children}
      </Stack>
      <DialogFooter isLoading={isLoading}>
        <PrimaryButton
          disabled={isLoading}
          text={!updateUserResponse ? confirmButtonText : 'OK'}
          onClick={!updateUserResponse ? onConfirm : onClose}
        />
        {!updateUserResponse && (
          <DefaultButton disabled={isLoading} text="Cancel" onClick={onClose} />
        )}
      </DialogFooter>
    </Dialog>
  );
};
