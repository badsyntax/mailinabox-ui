import {
  DefaultButton,
  Dialog,
  DialogType,
  IDialogContentProps,
  IDialogProps,
  PrimaryButton,
} from '@fluentui/react';
import { MailAlias, UpsertAliasRequest } from 'mailinabox-api';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  selectIsUpsertingAlias,
  selectUpsertAliasResponse,
} from '../../../features/aliasesSlice';
import { DialogFooter } from '../DialogFooter/DialogFooter';
import { MailAliasUpsert } from '../MailAliasUpsert/MailAliasUpsert';
import { Pre } from '../Pre/Pre';

interface MailAliasUpdateDialogProps {
  alias?: MailAlias;
}

const updateAliasDialogContentProps: IDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Update Alias',
};

export const MailAliasUpdateDialog: React.FunctionComponent<
  IDialogProps & MailAliasUpdateDialogProps
> = ({ alias, ...dialogProps }) => {
  const upsertAliasResponse = useSelector(selectUpsertAliasResponse);
  const isUpsertingAlias = useSelector(selectIsUpsertingAlias);

  const onDialogCloseButtonClick = useCallback(() => {
    dialogProps.onDismiss?.();
  }, [dialogProps]);

  const updateAlias: UpsertAliasRequest = {
    address: alias?.address || '',
    forwardsTo: alias?.forwardsTo.join('\n') ?? '',
    permittedSenders: alias?.permittedSenders?.join('\n') ?? null,
    updateIfExists: 1,
  };

  const dialogWidth = upsertAliasResponse ? 480 : 580;
  return (
    <Dialog
      {...dialogProps}
      dialogContentProps={updateAliasDialogContentProps}
      modalProps={{
        isBlocking: true,
      }}
      minWidth={dialogWidth}
      maxWidth={dialogWidth}
    >
      {upsertAliasResponse && (
        <>
          <Pre>{upsertAliasResponse}</Pre>
          <DialogFooter>
            <PrimaryButton text="OK" onClick={onDialogCloseButtonClick} />
          </DialogFooter>
        </>
      )}
      {!upsertAliasResponse && (
        <MailAliasUpsert updateAlias={updateAlias}>
          <DialogFooter isLoading={isUpsertingAlias}>
            <PrimaryButton
              text="Update Alias"
              type="submit"
              disabled={isUpsertingAlias}
            />
            <DefaultButton
              text="Cancel"
              onClick={onDialogCloseButtonClick}
              disabled={isUpsertingAlias}
            />
          </DialogFooter>
        </MailAliasUpsert>
      )}
    </Dialog>
  );
};
