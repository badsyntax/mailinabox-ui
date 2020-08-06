import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
  Text,
} from '@fluentui/react';
import React from 'react';
import { config } from '../../../config';

interface SyncListItem {
  option: string;
  value: string;
}

const items: Array<SyncListItem> = [
  {
    option: 'Account Type',
    value: 'CardDAV or CalDAV',
  },
  {
    option: 'Server Name',
    value: config.hostname,
  },
  {
    option: 'Use SSL',
    value: 'Yes',
  },
  {
    option: 'Username',
    value: 'Your complete email address',
  },
  {
    option: 'Password',
    value: 'Your mail password',
  },
];

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'For...',
    minWidth: 50,
    maxWidth: 180,
    isRowHeader: true,
    onRender: (item: SyncListItem): React.ReactNode => {
      return (
        <Text>
          <strong>{item.option}</strong>
        </Text>
      );
    },
  },
  {
    key: 'column2',
    name: '	Visit this URL',
    minWidth: 100,
    isRowHeader: false,
    isMultiline: true,
    onRender: (item: SyncListItem): React.ReactNode => {
      return <Text>{item.value}</Text>;
    },
  },
];

export const SyncListMobileSettings: React.FunctionComponent = () => {
  return (
    <DetailsList
      compact
      items={items}
      columns={columns}
      isHeaderVisible={false}
      layoutMode={DetailsListLayoutMode.justified}
      onShouldVirtualize={(): boolean => false}
      selectionMode={SelectionMode.none}
      constrainMode={ConstrainMode.horizontalConstrained}
    />
  );
};
