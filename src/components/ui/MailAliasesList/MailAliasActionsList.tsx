import { DirectionalHint, IconButton } from '@fluentui/react';
import { MailAlias } from 'mailinabox-api';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  AliasActionType,
  setAliasAction,
} from '../../../features/aliasesSlice';

interface MailAliasActionsListProps {
  alias: MailAlias;
}

export const MailAliasActionsList: React.FunctionComponent<MailAliasActionsListProps> = ({
  alias,
}) => {
  const dispatch = useDispatch();
  const doAction = useCallback(
    (type: AliasActionType): void => {
      dispatch(
        setAliasAction({
          alias,
          type,
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
};
