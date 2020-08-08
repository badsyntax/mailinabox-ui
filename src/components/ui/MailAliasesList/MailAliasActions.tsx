import { DialogType, Text } from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AliasActionType,
  getAliases,
  removeAlias,
  removeAliasReset,
  resetAliasAction,
  upsertAliasReset,
} from '../../../features/aliasesSlice';
import { RootState } from '../../../store';
import { ActionConfirmDialog } from '../ActionConfirmDialog/ActionConfirmDialog';
import { MailAliasUpdateDialog } from './MailAliasUpdateDialog';

export const MailAliasActions: React.FunctionComponent = () => {
  const {
    isRemovingAlias,
    aliasAction,
    removeAliasError,
    removeAliasResponse,
    upsertAliasResponse,
  } = useSelector((state: RootState) => state.aliases);

  const dispatch = useDispatch();

  const onActionDialogDismiss = useConstCallback((): void => {
    dispatch(resetAliasAction());
  });

  const onConfirmDialogDismissed = (): void => {
    if (removeAliasResponse) {
      dispatch(getAliases());
    }
    dispatch(removeAliasReset());
  };

  const onUpdateAliasDialogDismissed = (): void => {
    if (upsertAliasResponse) {
      dispatch(getAliases());
    }
    dispatch(upsertAliasReset());
  };

  const onRemoveAliasConfirm = (): void => {
    if (aliasAction?.alias) {
      dispatch(removeAlias(aliasAction?.alias.address));
    }
  };

  return (
    <>
      <ActionConfirmDialog
        hidden={aliasAction?.type !== AliasActionType.remove}
        isLoading={isRemovingAlias}
        onDismiss={onActionDialogDismiss}
        onDismissed={onConfirmDialogDismissed}
        onConfirm={onRemoveAliasConfirm}
        error={removeAliasError}
        actionResponse={removeAliasResponse}
        confirmButtonText="Remove Alias"
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'Remove Alias',
        }}
        modalProps={{
          isBlocking: true,
        }}
      >
        <Text>
          Are you sure you want to remove alias:{' '}
          <strong>{aliasAction?.alias?.addressDisplay}</strong>?
        </Text>
      </ActionConfirmDialog>
      <MailAliasUpdateDialog
        hidden={aliasAction?.type !== AliasActionType.update}
        alias={aliasAction?.alias}
        onDismiss={onActionDialogDismiss}
        onDismissed={onUpdateAliasDialogDismissed}
      ></MailAliasUpdateDialog>
    </>
  );
};
