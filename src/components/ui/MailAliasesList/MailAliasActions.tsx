import { DialogType, Text } from '@fluentui/react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AliasActionType,
  getAliases,
  removeAlias,
  removeAliasReset,
  resetAliasAction,
  selectAliasAction,
  selectIsRemovingAlias,
  selectRemoveAliasError,
  selectRemoveAliasResponse,
  selectUpsertAliasResponse,
  upsertAliasReset,
} from '../../../features/aliasesSlice';
import { ActionConfirmDialog } from '../ActionConfirmDialog/ActionConfirmDialog';
import { MailAliasUpdateDialog } from './MailAliasUpdateDialog';

export const MailAliasActions: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const isRemovingAlias = useSelector(selectIsRemovingAlias);
  const aliasAction = useSelector(selectAliasAction);
  const removeAliasError = useSelector(selectRemoveAliasError);
  const removeAliasResponse = useSelector(selectRemoveAliasResponse);
  const upsertAliasResponse = useSelector(selectUpsertAliasResponse);

  const onActionDialogDismiss = useCallback((): void => {
    dispatch(resetAliasAction());
  }, [dispatch]);

  const onConfirmDialogDismissed = useCallback((): void => {
    if (removeAliasResponse) {
      dispatch(getAliases());
    }
    dispatch(removeAliasReset());
  }, [dispatch, removeAliasResponse]);

  const onUpdateAliasDialogDismissed = useCallback((): void => {
    if (upsertAliasResponse) {
      dispatch(getAliases());
    }
    dispatch(upsertAliasReset());
  }, [dispatch, upsertAliasResponse]);

  const onRemoveAliasConfirm = useCallback((): void => {
    if (aliasAction?.alias) {
      dispatch(removeAlias(aliasAction?.alias.address));
    }
  }, [aliasAction, dispatch]);

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
