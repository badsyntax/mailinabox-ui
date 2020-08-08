import { DirectionalHint, IconButton } from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import { DNSCustomRecord } from 'mailinabox-api';
import React from 'react';
import { useDispatch } from 'react-redux';
import { DNSActionType, setDNSAction } from '../../../features/dnsSlice';

interface CustomDnsRecordsActionsListProps {
  dnsRecord: DNSCustomRecord;
}

export const CustomDnsRecordsActionsList: React.FunctionComponent<CustomDnsRecordsActionsListProps> = React.memo(
  ({ dnsRecord }) => {
    const dispatch = useDispatch();
    const doAction = useConstCallback((type: DNSActionType): void => {
      dispatch(
        setDNSAction({
          dnsRecord,
          type,
        })
      );
    });
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
  }
);
