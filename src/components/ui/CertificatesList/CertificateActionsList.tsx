import { DirectionalHint, IconButton } from '@fluentui/react';
import { SSLStatus, SSLStatusType } from 'mailinabox-api';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setSSLAction, SSLActionType } from '../../../features/sslSlice';

interface CertificateActionsListProps {
  sslStatus: SSLStatus;
}

export const CertificateActionsList: React.FunctionComponent<CertificateActionsListProps> = ({
  sslStatus,
}) => {
  const dispatch = useDispatch();
  const doAction = useCallback(
    (type: SSLActionType): void => {
      dispatch(
        setSSLAction({
          sslStatus,
          type,
        })
      );
    },
    [dispatch, sslStatus]
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
            key: 'installCertificate' + sslStatus.domain,
            text: `${
              sslStatus.status === SSLStatusType.Success ? 'Replace' : 'Install'
            } Certificate`,
            onClick: (): void => doAction(SSLActionType.install),
          },
        ],
      }}
    />
  );
};
