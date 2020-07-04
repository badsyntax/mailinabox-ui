import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
} from '@fluentui/react';
import React from 'react';

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Option',
    minWidth: 100,
    maxWidth: 160,
    isRowHeader: true,
    fieldName: 'option',
  },
  {
    key: 'column2',
    name: 'Value',
    minWidth: 100,
    isRowHeader: false,
    fieldName: 'value',
  },
];

const items = [
  {
    option: 'Server',
    value: 'box.proxima-mail.com',
  },
  {
    option: 'Options',
    value: 'Secure Connection',
  },
];

export const MailExchangeSettingsList: React.FunctionComponent = () => {
  return (
    <DetailsList
      compact
      items={items}
      columns={columns}
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={false}
      onShouldVirtualize={(): boolean => false}
      selectionMode={SelectionMode.none}
      constrainMode={ConstrainMode.horizontalConstrained}
    />
  );
};
