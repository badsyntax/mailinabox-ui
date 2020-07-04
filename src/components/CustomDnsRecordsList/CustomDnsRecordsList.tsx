import {
  ConstrainMode,
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  getTheme,
  IColumn,
  IStackProps,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { DNSCustomRecord } from 'mailinabox-api';
import React from 'react';

const theme = getTheme();

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Domain Name',
    minWidth: 140,
    maxWidth: 300,
    isMultiline: false,
    isRowHeader: true,
    fieldName: 'qname',
  },
  {
    key: 'column2',
    name: 'Record Type',
    minWidth: 100,
    maxWidth: 120,
    isMultiline: false,
    onRender: (item: DNSCustomRecord): React.ReactNode => {
      return <Text>{item.rtype}</Text>;
    },
  },
  {
    key: 'column3',
    name: 'Value',
    isMultiline: false,
    minWidth: 180,
    onRender: (item: DNSCustomRecord): React.ReactNode => {
      return <Text>{item.value}</Text>;
    },
  },
  {
    key: 'column4',
    name: 'Actions',
    isMultiline: false,
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: DNSCustomRecord): React.ReactNode => {
      return (
        <DefaultButton
          styles={{
            textContainer: {
              ...theme.fonts.small,
            },
          }}
        >
          Delete
        </DefaultButton>
      );
    },
  },
];

export const CustomDnsRecordsList: React.FunctionComponent<
  IStackProps & {
    records: Array<DNSCustomRecord>;
  }
> = ({ records = [], ...props }) => {
  return (
    <Stack as="section" {...props}>
      <DetailsList
        items={records}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible
        onShouldVirtualize={(): boolean => false}
        selectionMode={SelectionMode.none}
        constrainMode={ConstrainMode.horizontalConstrained}
      />
    </Stack>
  );
};