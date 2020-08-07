import { DialogType, Text } from '@fluentui/react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DNSActionType,
  getCustomRecords,
  removeCustomRecord,
  removeCustomRecordReset,
  resetDNSAction,
} from '../../../features/dnsSlice';
import { RootState } from '../../../store';
import { ActionConfirmDialog } from '../ActionConfirmDialog/ActionConfirmDialog';
import { Pre } from '../Pre/Pre';

export const CustomDnsRecordActions: React.FunctionComponent = () => {
  const {
    isRemovingCustomRecord,
    dnsAction,
    removeCustomRecordError,
    removeCustomRecordResponse,
  } = useSelector((state: RootState) => state.dns);
  const dispatch = useDispatch();

  const onActionDialogDismiss = useCallback((): void => {
    dispatch(resetDNSAction());
  }, [dispatch]);

  const onActionDialogDismissed = useCallback((): void => {
    if (removeCustomRecordResponse) {
      dispatch(getCustomRecords());
    }
    dispatch(removeCustomRecordReset());
  }, [dispatch, removeCustomRecordResponse]);

  const onRemoveAliasConfirm = useCallback((): void => {
    if (dnsAction?.dnsRecord) {
      const { qname, rtype, value: body } = dnsAction.dnsRecord;
      dispatch(
        removeCustomRecord({
          qname,
          rtype,
          body,
        })
      );
    }
  }, [dispatch, dnsAction]);

  return (
    <ActionConfirmDialog
      hidden={dnsAction?.type !== DNSActionType.remove}
      isLoading={isRemovingCustomRecord}
      onDismiss={onActionDialogDismiss}
      onDismissed={onActionDialogDismissed}
      onConfirm={onRemoveAliasConfirm}
      error={removeCustomRecordError}
      actionResponse={removeCustomRecordResponse}
      confirmButtonText="Remove Record"
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: 'Remove DNS Record',
      }}
      modalProps={{
        isBlocking: true,
      }}
      minWidth={480}
    >
      <Text>Are you sure you want to remove the custom record:</Text>
      <Pre>
        {dnsAction?.dnsRecord?.qname}&nbsp;({dnsAction?.dnsRecord?.rtype})
      </Pre>
    </ActionConfirmDialog>
  );
};
