import { DirectionalHint, IconButton } from '@fluentui/react';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  domainAction,
  WebDomainActionType,
  WebDomainWithDomainInfo,
} from '../../../features/webSlice';

interface WebDomainsActionsListProps {
  webDomain: WebDomainWithDomainInfo;
}

export const WebDomainsActionsList: React.FunctionComponent<WebDomainsActionsListProps> = ({
  webDomain,
}) => {
  const dispatch = useDispatch();
  const doAction = useCallback(
    (action: WebDomainActionType): void => {
      dispatch(
        domainAction({
          webDomain,
          action,
        })
      );
    },
    [dispatch, webDomain]
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
            key: 'changeroot',
            text: 'Change Root Directory',
            onClick: (): void => doAction(WebDomainActionType.update),
          },
        ],
      }}
    />
  );
};
