import { DialogType, Text } from '@fluentui/react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AliasAction,
  aliasesCheck,
  aliasRemove,
  aliasRemoveReset,
  aliasResetUpdateAction,
  selectAliasUpdate,
  selectIsRemovingAlias,
  selectRemoveAliasError,
  selectRemoveAliasResponse,
} from '../../../features/aliasesSlice';
import { ActionConfirmDialog } from '../ActionConfirmDialog/ActionConfirmDialog';
import { MailAliasUpdateDialog } from './MailAliasUpdateDialog';

export const MailAliasActions: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const isRemovingAlias = useSelector(selectIsRemovingAlias);
  const aliasUpdate = useSelector(selectAliasUpdate);
  const removeAliasError = useSelector(selectRemoveAliasError);
  const removeAliasResponse = useSelector(selectRemoveAliasResponse);

  const onActionDialogDismiss = useCallback((): void => {
    dispatch(aliasResetUpdateAction());
  }, [dispatch]);

  const onConfirmDialogDismissed = useCallback((): void => {
    if (removeAliasResponse) {
      dispatch(aliasesCheck());
    }
    dispatch(aliasRemoveReset());
  }, [dispatch, removeAliasResponse]);

  const removeAlias = useCallback((): void => {
    if (aliasUpdate?.alias) {
      dispatch(aliasRemove(aliasUpdate?.alias.address));
    }
  }, [aliasUpdate, dispatch]);

  return (
    <>
      <ActionConfirmDialog
        hidden={aliasUpdate?.action !== AliasAction.remove}
        isLoading={isRemovingAlias}
        onDismiss={onActionDialogDismiss}
        onDismissed={onConfirmDialogDismissed}
        onConfirm={removeAlias}
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
          <strong>{aliasUpdate?.alias?.addressDisplay}</strong>?
        </Text>
      </ActionConfirmDialog>
      <MailAliasUpdateDialog
        hidden={aliasUpdate?.action !== AliasAction.update}
        alias={aliasUpdate?.alias}
        onDismiss={onActionDialogDismiss}
      ></MailAliasUpdateDialog>
    </>
  );
};
