import { DialogType, Text } from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import React from 'react';
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

  const onActionDialogDismiss = useConstCallback((): void => {
    dispatch(resetDNSAction());
  });

  const onActionDialogDismissed = (): void => {
    if (removeCustomRecordResponse) {
      dispatch(getCustomRecords());
    }
    dispatch(removeCustomRecordReset());
  };

  const onRemoveAliasConfirm = (): void => {
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
  };

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
