import { DialogType, Text } from '@fluentui/react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetDomainAction,
  updateWeb,
  updateWebReset,
  WebDomainActionType,
} from '../../../features/webSlice';
import { RootState } from '../../../store';
import { ActionConfirmDialog } from '../ActionConfirmDialog/ActionConfirmDialog';

export const WebDomainActions: React.FunctionComponent = () => {
  const {
    domainAction,
    updateWebError,
    updateWebResponse,
    isUpdatingWeb,
  } = useSelector((state: RootState) => state.web);
  const dispatch = useDispatch();

  const onActionDialogDismiss = useCallback((): void => {
    dispatch(resetDomainAction());
  }, [dispatch]);

  const onActionDialogDismissed = useCallback((): void => {
    dispatch(updateWebReset());
  }, [dispatch]);

  const update = useCallback((): void => {
    if (domainAction?.webDomain) {
      dispatch(updateWeb());
    }
  }, [dispatch, domainAction]);

  const dialogWidth = updateWebResponse ? 420 : 580;

  return (
    <ActionConfirmDialog
      hidden={domainAction?.action !== WebDomainActionType.update}
      isLoading={isUpdatingWeb}
      minWidth={dialogWidth}
      maxWidth={dialogWidth}
      onDismiss={onActionDialogDismiss}
      onDismissed={onActionDialogDismissed}
      onConfirm={update}
      error={updateWebError}
      actionResponse={updateWebResponse}
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
        <strong>{domainAction?.webDomain?.domain}</strong> to:
      </Text>
      <Text>
        <code>{domainAction?.webDomain?.customRoot}</code>
      </Text>
      <Text>
        First create this directory on the server. Then click Update to scan for
        the directory and update web settings.
      </Text>
    </ActionConfirmDialog>
  );
};
