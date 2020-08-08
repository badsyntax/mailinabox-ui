import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  DetailsRow,
  IDetailsGroupDividerProps,
  IDetailsHeaderProps,
  IDetailsListProps,
  IDetailsRowProps,
  IGroup,
  IGroupHeaderProps,
  IRenderFunction,
  SelectionMode,
} from '@fluentui/react';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

const onRenderRow = (props?: IDetailsRowProps): JSX.Element | null => {
  if (props) {
    return <DetailsRow {...props} />;
  }
  return null;
};

interface GroupHeader {
  props: IDetailsGroupDividerProps;
  defaultRender: IRenderFunction<IGroupHeaderProps>;
  onToggleGroupCollapse: (key: string, isCollapsed: boolean) => void;
}

const GroupHeader: React.FunctionComponent<GroupHeader> = React.memo(
  ({ props, defaultRender, onToggleGroupCollapse }) => {
    const toggleCollapse = (): void => {
      if (props?.group) {
        onToggleGroupCollapse(props.group.key, !props.group.isCollapsed);
      }
    };
    const onHeaderClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void => {
      if (props && props.group) {
        event.preventDefault();
        toggleCollapse();
      }
    };
    return (
      <div onClick={onHeaderClick}>
        {defaultRender({
          ...props,
          onToggleCollapse: toggleCollapse,
        })}
      </div>
    );
  }
);

interface GroupedDetailsListProps {
  openedGroupsState: [string[], Dispatch<SetStateAction<string[]>>];
  groups: IGroup[];
}

export const GroupedDetailsList: React.FunctionComponent<
  IDetailsListProps & GroupedDetailsListProps
> = ({ openedGroupsState, groups, ...props }) => {
  const [openedGroups, setOpenedGroups] = openedGroupsState;
  const [hasExpandedAllGroups, setHasExpandedAllGroups] = useState<boolean>(
    false
  );

  const onToggleGroupCollapse = useCallback(
    (groupKey: string, collapse: boolean): void => {
      if (collapse) {
        openedGroups.splice(openedGroups.indexOf(groupKey), 1);
      } else {
        openedGroups.push(groupKey);
      }
      setOpenedGroups(openedGroups.slice());
    },
    [openedGroups, setOpenedGroups]
  );

  const onToggleGroupCollapseAll = (): void => {
    const shouldCollapse =
      hasExpandedAllGroups || openedGroups.length === groups.length;
    if (shouldCollapse) {
      setOpenedGroups([]);
      setHasExpandedAllGroups(false);
    } else {
      setOpenedGroups(groups.map(({ key }) => key));
      setHasExpandedAllGroups(true);
    }
  };

  const onRenderDetailsHeader = (
    detailsHeaderProps?: IDetailsHeaderProps,
    defaultRender?: IRenderFunction<IDetailsHeaderProps>
  ): JSX.Element | null => {
    return (
      defaultRender?.({
        ...detailsHeaderProps,
        onToggleCollapseAll: onToggleGroupCollapseAll,
        styles: {
          root: {
            paddingTop: 0,
          },
        },
      } as IDetailsHeaderProps) || null
    );
  };

  const onRenderGroupHeader = (
    props?: IDetailsGroupDividerProps,
    defaultRender?: IRenderFunction<IGroupHeaderProps>
  ): JSX.Element | null => {
    if (defaultRender && props) {
      return (
        <GroupHeader
          props={props}
          defaultRender={defaultRender}
          onToggleGroupCollapse={onToggleGroupCollapse}
        />
      );
    }
    return null;
  };

  const groupsWithCollapsedState = groups.map((group) => ({
    ...group,
    isCollapsed: openedGroups.indexOf(group.key) === -1,
  }));

  return (
    <DetailsList
      {...props}
      groups={groupsWithCollapsedState}
      layoutMode={DetailsListLayoutMode.justified}
      selectionMode={SelectionMode.none}
      constrainMode={ConstrainMode.horizontalConstrained}
      isHeaderVisible
      onShouldVirtualize={(): boolean =>
        groupsWithCollapsedState.length > 20 || props.items.length > 50
      }
      onRenderDetailsHeader={onRenderDetailsHeader}
      onRenderRow={onRenderRow}
      groupProps={{
        isAllGroupsCollapsed: openedGroups.length === 0,
        onRenderHeader: onRenderGroupHeader,
      }}
    />
  );
};
