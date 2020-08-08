import { DirectionalHint, IconButton } from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import { MailAlias } from 'mailinabox-api';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  AliasActionType,
  setAliasAction,
} from '../../../features/aliasesSlice';

interface MailAliasActionsListProps {
  alias: MailAlias;
}

export const MailAliasActionsList: React.FunctionComponent<MailAliasActionsListProps> = React.memo(
  ({ alias }) => {
    const dispatch = useDispatch();
    const doAction = useConstCallback((type: AliasActionType): void => {
      dispatch(
        setAliasAction({
          alias,
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
              key: 'updatealias' + alias.address,
              text: 'Update',
              onClick: (): void => doAction(AliasActionType.update),
            },
            {
              key: 'removeealias' + alias.address,
              text: 'Remove',
              onClick: (): void => doAction(AliasActionType.remove),
            },
          ],
        }}
      />
    );
  }
);
