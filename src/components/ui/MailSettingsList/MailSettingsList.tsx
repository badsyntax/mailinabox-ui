import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
} from '@fluentui/react';
import React from 'react';
import config from '../../../config/index.json';
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
    option: 'Protocol/Method',
    value: 'IMAP',
  },
  {
    option: 'Mail server',
    value: config.hostname,
  },
  {
    option: 'IMAP Port',
    value: '993',
  },
  {
    option: 'IMAP Security',
    value: 'SSL or TLS',
  },
  {
    option: 'SMTP Port',
    value: '587',
  },
  {
    option: 'SMTP Security',
    value: 'STARTTLS ("always" or "required", if prompted)',
  },
  {
    option: 'Username',
    value: 'Your whole email address.',
  },
  {
    option: 'Password',
    value: 'Your mail password.',
  },
];

export const MailSettingsList: React.FunctionComponent = () => {
  return (
    <DetailsList
      styles={{
        root: {
          marginTop: -16,
        },
      }}
      compact
      items={items}
      columns={columns}
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible
      onShouldVirtualize={(): boolean => false}
      selectionMode={SelectionMode.none}
      constrainMode={ConstrainMode.horizontalConstrained}
    />
  );
};
