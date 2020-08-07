import { IPivotProps, Pivot, PivotItem, PivotLinkSize } from '@fluentui/react';
import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const PivotRoutes: React.FunctionComponent<IPivotProps> = ({
  children,
  ...props
}) => {
  const history = useHistory();
  const location = useLocation();
  const onPivotLinkClick = useCallback(
    (item?: PivotItem, _event?: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (item?.props.itemKey) {
        history.push(item.props.itemKey);
      }
    },
    [history]
  );
  return (
    <Pivot
      linkSize={PivotLinkSize.large}
      selectedKey={location.pathname}
      onLinkClick={onPivotLinkClick}
      {...props}
    >
      {children}
    </Pivot>
  );
};
