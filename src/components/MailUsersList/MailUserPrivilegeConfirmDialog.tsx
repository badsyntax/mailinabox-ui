import {
  DefaultButton,
  Dialog,
  DialogFooter,
  IDialogContentProps,
  IModalProps,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
} from '@fluentui/react';
import React from 'react';
import { MessageBar } from '../MessageBar/MessageBar';

interface MailUserPrivilegeDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  hidden: boolean;
  disabled: boolean;
  message: React.ReactElement | null;
  error: string | null;
  dialogContentProps?: IDialogContentProps;
  modalProps?: IModalProps;
}

export const MailUserPrivilegeConfirmDialog: React.FunctionComponent<MailUserPrivilegeDialogProps> = ({
  hidden,
  onClose,
  onConfirm,
  disabled,
  message,
  error,
  dialogContentProps,
  modalProps,
}) => {
  return (
    <Dialog
      hidden={hidden}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
      onDismiss={onClose}
    >
      <Stack gap="m">
        <Text>{message}</Text>
        {error && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {error}
          </MessageBar>
        )}
      </Stack>
      <DialogFooter>
        <PrimaryButton disabled={disabled} text="Yes" onClick={onConfirm} />
        <DefaultButton disabled={disabled} text="Cancel" onClick={onClose} />
      </DialogFooter>
    </Dialog>
  );
};
