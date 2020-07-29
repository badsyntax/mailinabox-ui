import { DialogType, Text } from '@fluentui/react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetDomainAction,
  selectDomainAction,
  selectIsUpdating,
  selectUpdateError,
  selectUpdateResponse,
  updateReset,
  updateWeb,
  WebDomainActionType,
} from '../../../features/webSlice';
import { ActionConfirmDialog } from '../ActionConfirmDialog/ActionConfirmDialog';

export const WebDomainActions: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const webDomainAction = useSelector(selectDomainAction);
  const updateError = useSelector(selectUpdateError);
  const updateResponse = useSelector(selectUpdateResponse);
  const isUpdating = useSelector(selectIsUpdating);

  const onActionDialogDismiss = useCallback((): void => {
    dispatch(resetDomainAction());
  }, [dispatch]);

  const onActionDialogDismissed = useCallback((): void => {
    dispatch(updateReset());
  }, [dispatch]);

  const update = useCallback((): void => {
    if (webDomainAction?.webDomain) {
      dispatch(updateWeb());
    }
  }, [webDomainAction, dispatch]);

  const dialogWidth = updateResponse ? 420 : 580;

  return (
    <ActionConfirmDialog
      hidden={webDomainAction?.action !== WebDomainActionType.update}
      isLoading={isUpdating}
      minWidth={dialogWidth}
      maxWidth={dialogWidth}
      onDismiss={onActionDialogDismiss}
      onDismissed={onActionDialogDismissed}
      onConfirm={update}
      error={updateError}
      actionResponse={updateResponse}
      confirmButtonText="Update"
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: 'Change Root Directory',
      }}
      modalProps={{
        isBlocking: true,
      }}
    >
      <Text>
        You can change the static directory for{' '}
        <strong>{webDomainAction?.webDomain?.domain}</strong> to:
      </Text>
      <Text>
        <code>{webDomainAction?.webDomain?.customRoot}</code>
      </Text>
      <Text>
        First create this directory on the server. Then click Update to scan for
        the directory and update web settings.
      </Text>
    </ActionConfirmDialog>
  );
};
