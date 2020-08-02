import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  getTheme,
  IColumn,
  Link,
  SelectionMode,
  Text,
} from '@fluentui/react';
import React from 'react';
import config from '../../../config/index.json';

const theme = getTheme();

interface SyncBrowserItem {
  option: string;
  value: string;
}

const items: Array<SyncBrowserItem> = [
  {
    option: 'Contacts',
    value: `https://${config.hostname}/cloud/contacts`,
  },
  {
    option: 'Calendar',
    value: `https://${config.hostname}/cloud/calendar`,
  },
];

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'For...',
    minWidth: 50,
    maxWidth: 80,
    isRowHeader: true,
    onRender: (item: SyncBrowserItem): React.ReactNode => {
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
    onRender: (item: SyncBrowserItem): React.ReactNode => {
      return (
        <Text>
          <Link href={item.value}>{item.value}</Link>
        </Text>
      );
    },
  },
];

export const SyncListBrowser: React.FunctionComponent = () => {
  return (
    <DetailsList
      styles={{
        root: {
          marginTop: '-' + theme.spacing.m,
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
