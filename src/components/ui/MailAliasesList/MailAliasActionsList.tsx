import { DirectionalHint, IconButton } from '@fluentui/react';
import { MailAlias } from 'mailinabox-api';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AliasAction, aliasUpdate } from '../../../features/aliasesSlice';

interface MailAliasActionsListProps {
  alias: MailAlias;
}

export const MailAliasActionsList: React.FunctionComponent<MailAliasActionsListProps> = ({
  alias,
}) => {
  const dispatch = useDispatch();
  const doAction = useCallback(
    (action: AliasAction): void => {
      dispatch(
        aliasUpdate({
          alias,
          action,
        })
      );
    },
    [dispatch, alias]
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
            key: 'updatealias' + alias.address,
            text: 'Update',
            onClick: (): void => doAction(AliasAction.update),
          },
          {
            key: 'removeealias' + alias.address,
            text: 'Remove',
            onClick: (): void => doAction(AliasAction.remove),
          },
        ],
      }}
    />
  );
};
