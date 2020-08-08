import { DirectionalHint, IconButton } from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  setDomainAction,
  WebDomainActionType,
  WebDomainWithDomainInfo,
} from '../../../features/webSlice';

interface WebDomainsActionsListProps {
  webDomain: WebDomainWithDomainInfo;
}

export const WebDomainsActionsList: React.FunctionComponent<WebDomainsActionsListProps> = React.memo(
  ({ webDomain }) => {
    const dispatch = useDispatch();
    const doAction = useConstCallback((action: WebDomainActionType): void => {
      dispatch(
        setDomainAction({
          webDomain,
          action,
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
              key: 'changeroot',
              text: 'Change Root Directory',
              onClick: (): void => doAction(WebDomainActionType.update),
            },
          ],
        }}
      />
    );
  }
);
