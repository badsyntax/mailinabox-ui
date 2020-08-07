import {
  IPivotProps,
  mergeStyles,
  Pivot,
  PivotItem,
  PivotLinkSize,
} from '@fluentui/react';
import React, { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const className = mergeStyles({
  overflowX: 'auto',
  overflowY: 'hidden',
});

interface PivotRoutes {
  refs?: {
    [key: string]: React.RefObject<HTMLDivElement | null>;
  };
}

export const PivotRoutes: React.FunctionComponent<
  PivotRoutes & IPivotProps
> = ({ children, refs, ...props }) => {
  const history = useHistory();
  const { pathname: selectedKey } = useLocation();
  const onPivotLinkClick = useCallback(
    (item?: PivotItem) => {
      if (item?.props.itemKey) {
        history.push(item.props.itemKey);
      }
    },
    [history]
  );

  useEffect(() => {
    refs?.[selectedKey]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [refs, selectedKey]);

  return (
    <Pivot
      className={className}
      linkSize={PivotLinkSize.large}
      selectedKey={selectedKey}
      onLinkClick={onPivotLinkClick}
      {...props}
    >
      {children}
    </Pivot>
  );
};
