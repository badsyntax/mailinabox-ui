import {
  IPivotItemProps,
  IPivotProps,
  mergeStyles,
  Pivot,
  PivotItem,
  PivotLinkSize,
  ScreenWidthMinLarge,
} from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import React, { createRef, RefObject, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useHistory, useLocation } from 'react-router-dom';

const className = mergeStyles({
  overflowX: 'auto',
  overflowY: 'hidden',
});

interface PivotRoutes {
  items?: IPivotItemProps[];
}

export const PivotRoutes: React.FunctionComponent<
  PivotRoutes & IPivotProps
> = ({ children, items = [], ...props }) => {
  const history = useHistory();
  const { pathname: selectedKey } = useLocation();
  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });
  const refs = items.map(() => createRef<HTMLDivElement>());

  const onPivotLinkClick = useConstCallback((item?: PivotItem): void => {
    if (item?.props.itemKey) {
      history.push(item.props.itemKey);
    }
  });

  const onRenderItemLink = (ref: RefObject<HTMLDivElement>) => (
    props?: IPivotItemProps
  ): JSX.Element | null => {
    return props ? <div ref={ref}>{props.headerText}</div> : null;
  };

  useEffect(() => {
    const index = items.findIndex((item) => item.itemKey === selectedKey);
    refs[index]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [items, refs, selectedKey]);

  return (
    <Pivot
      className={className}
      linkSize={isMinLargeScreen ? PivotLinkSize.large : PivotLinkSize.normal}
      selectedKey={selectedKey}
      onLinkClick={onPivotLinkClick}
      {...props}
    >
      {items.map((item, i) => (
        <PivotItem {...item} onRenderItemLink={onRenderItemLink(refs[i])} />
      ))}
    </Pivot>
  );
};
