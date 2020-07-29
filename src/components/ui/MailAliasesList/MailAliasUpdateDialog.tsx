import {
  DefaultButton,
  Dialog,
  DialogType,
  IDialogContentProps,
  PrimaryButton,
  Stack,
} from '@fluentui/react';
import { MailAlias } from 'mailinabox-api';
import React from 'react';
import { DialogFooter } from '../DialogFooter/DialogFooter';

interface MailAliasUpdateDialogProps {
  onDismiss: () => void;
  hidden: boolean;
  alias?: MailAlias;
}

const updateAliasDialogContentProps: IDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Update Alias',
};

export const MailAliasUpdateDialog: React.FunctionComponent<MailAliasUpdateDialogProps> = ({
  hidden,
  onDismiss,
  alias,
}) => {
  return (
    <Dialog
      hidden={hidden}
      dialogContentProps={updateAliasDialogContentProps}
      modalProps={{
        isBlocking: true,
      }}
      minWidth={480}
      maxWidth={480}
    >
      {/* {updateUserResponse && (
        <>
          <Pre>{updateUserResponse}</Pre>
          <DialogFooter>
            <PrimaryButton text="OK" onClick={onDismiss} />
          </DialogFooter>
        </>
      )} */}
      <form>
        <Stack gap="s1">Update alias</Stack>
        <DialogFooter>
          <PrimaryButton text="Update Alias" type="submit" />
          <DefaultButton text="Cancel" onClick={onDismiss} />
        </DialogFooter>
      </form>
    </Dialog>
  );
};
