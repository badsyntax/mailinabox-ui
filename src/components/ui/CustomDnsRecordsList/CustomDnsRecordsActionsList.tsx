import { DirectionalHint, IconButton } from '@fluentui/react';
import { DNSCustomRecord } from 'mailinabox-api';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { DNSActionType, setDNSAction } from '../../../features/dnsSlice';

interface CustomDnsRecordsActionsListProps {
  dnsRecord: DNSCustomRecord;
}

export const CustomDnsRecordsActionsList: React.FunctionComponent<CustomDnsRecordsActionsListProps> = ({
  dnsRecord,
}) => {
  const dispatch = useDispatch();
  const doAction = useCallback(
    (type: DNSActionType): void => {
      dispatch(
        setDNSAction({
          dnsRecord,
          type,
        })
      );
    },
    [dispatch, dnsRecord]
  );
  return (
    <IconButton
      menuIconProps={{
        iconName: 'MoreVertical',
      }}
      styles={{
        menuIcon: {
          fontWeight: 'bold',
        },
      }}
      role="button"
      aria-haspopup={true}
      aria-label="Show actions"
      menuProps={{
        directionalHint: DirectionalHint.bottomRightEdge,
        items: [
          {
            key: 'removeDnsRecord' + dnsRecord.qname + dnsRecord.rtype,
            text: 'Remove',
            onClick: (): void => doAction(DNSActionType.remove),
          },
        ],
      }}
    />
  );
};
