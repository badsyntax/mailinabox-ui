import { DirectionalHint, IconButton } from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import { SSLStatus, SSLStatusType } from 'mailinabox-api';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setSSLAction, SSLActionType } from '../../../features/sslSlice';

interface CertificateActionsListProps {
  sslStatus: SSLStatus;
}

export const CertificateActionsList: React.FunctionComponent<CertificateActionsListProps> =
  React.memo(({ sslStatus }) => {
    const dispatch = useDispatch();
    const doAction = useConstCallback((type: SSLActionType): void => {
      dispatch(
        setSSLAction({
          sslStatus,
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
              key: 'installCertificate' + sslStatus.domain,
              text: `${
                sslStatus.status === SSLStatusType.Success
                  ? 'Replace'
                  : 'Install'
              } Certificate`,
              onClick: (): void => doAction(SSLActionType.install),
            },
          ],
        }}
      />
    );
  });
