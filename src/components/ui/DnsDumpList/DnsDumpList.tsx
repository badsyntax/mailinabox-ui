import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  FontSizes,
  IColumn,
  IDetailsGroupDividerProps,
  IGroup,
  IGroupHeaderProps,
  IRenderFunction,
  IStackProps,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { DNSCustomRecord, DNSDumpDomainRecord } from 'mailinabox-api';
import React from 'react';
import { InfoButton } from '../InfoButton/InfoButton';

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Qname',
    minWidth: 140,
    maxWidth: 300,
    isMultiline: false,
    isRowHeader: true,
    isPadded: false,
    fieldName: 'qname',
  },
  {
    key: 'column2',
    name: 'Record Type',
    minWidth: 80,
    maxWidth: 100,
    isPadded: false,
    isMultiline: false,
    fieldName: 'rtype',
    onRender: (item: DNSCustomRecord): React.ReactNode => {
      return <Text>{item.rtype}</Text>;
    },
  },
  {
    key: 'column3',
    name: 'Value',
    isMultiline: true,
    minWidth: 180,
    isPadded: true,
    fieldName: 'value',
    onRender: (item: DNSCustomRecord): React.ReactNode => {
      return <Text>{item.value}</Text>;
    },
  },
  {
    key: 'column4',
    name: 'Info',
    isMultiline: false,
    minWidth: 40,
    isIconOnly: true,
    isPadded: false,
    onRender: (item: DNSDumpDomainRecord): React.ReactNode => {
      return (
        <InfoButton
          text={item.explanation}
          showCloseButton={false}
          iconButtonStyles={{
            root: {
              height: 'auto',
            },
            icon: {
              fontSize: FontSizes.xLarge,
            },
          }}
        />
      );
    },
  },
];

export const DnsDumpList: React.FunctionComponent<
  IStackProps & {
    records: Array<DNSDumpDomainRecord>;
    groups: Array<IGroup>;
  }
> = ({ records = [], groups = [], ...props }) => {
  return (
    <Stack as="section" {...props}>
      <DetailsList
        items={records}
        groups={groups}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        constrainMode={ConstrainMode.horizontalConstrained}
        useReducedRowRenderer
        usePageCache
        groupProps={{
          isAllGroupsCollapsed: true,
          onRenderHeader: (
            props?: IDetailsGroupDividerProps,
            defaultRender?: IRenderFunction<IGroupHeaderProps>
          ): JSX.Element | null => {
            if (defaultRender) {
              return (
                <div
                  onClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>
                  ): void => {
                    if (props && props.group) {
                      event.preventDefault();
                      props.onToggleCollapse?.(props.group);
                    }
                  }}
                >
                  {defaultRender(props)}
                </div>
              );
            }
            return null;
          },
        }}
      />
    </Stack>
  );
};
