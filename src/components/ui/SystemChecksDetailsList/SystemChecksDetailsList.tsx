import {
  CollapseAllVisibility,
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IDetailsGroupDividerProps,
  IGroup,
  IGroupHeaderProps,
  IRenderFunction,
  SelectionMode,
} from '@fluentui/react';
import React from 'react';
import { SystemCheckIcon } from '../SystemCheckIcon/SystemCheckIcon';
import { SystemChecksDetailsListItem } from './SystemChecksDetailsListItem';

interface SystemChecksDetailsListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  groups: IGroup[];
}

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Status',
    minWidth: 16,
    maxWidth: 16,
    onRender: (item): React.ReactNode => <SystemCheckIcon type={item.type} />,
  },
  {
    key: 'column2',
    name: 'Text',
    isRowHeader: true,
    isMultiline: true,
    minWidth: 100,
    onRender: (item): React.ReactNode => (
      <SystemChecksDetailsListItem item={item} />
    ),
  },
];

export const SystemChecksDetailsList: React.FunctionComponent<SystemChecksDetailsListProps> = ({
  items,
  groups,
}) => {
  return (
    <DetailsList
      items={items}
      columns={columns}
      groups={groups}
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={false}
      onShouldVirtualize={(): boolean => false}
      groupProps={{
        onRenderHeader: (
          headerProps?: IDetailsGroupDividerProps,
          defaultRender?: IRenderFunction<IGroupHeaderProps>
        ): JSX.Element | null => {
          if (defaultRender) {
            return defaultRender({
              ...headerProps,
              styles: {
                headerCount: { display: 'none' },
              },
            });
          }
          return null;
        },
        isAllGroupsCollapsed: false,
        collapseAllVisibility: CollapseAllVisibility.hidden,
      }}
      selectionMode={SelectionMode.none}
      constrainMode={ConstrainMode.horizontalConstrained}
    />
  );
};
