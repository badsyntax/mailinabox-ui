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

const theme = getTheme();

interface SyncListItem {
  option: string;
  value: React.ReactNode;
}

const items: Array<SyncListItem> = [
  {
    option: 'Contacts and Calendar',
    value: (
      <Text>
        <Link href="https://play.google.com/store/apps/details?id=at.bitfire.davdroid">
          DAVdroid
        </Link>{' '}
        ($3.69; free{' '}
        <Link href="https://f-droid.org/packages/at.bitfire.davdroid/">
          here
        </Link>
        )
      </Text>
    ),
  },
  {
    option: 'Only Contacts',
    value: (
      <Text>
        <Link href="https://play.google.com/store/apps/details?id=org.dmfs.carddav.sync">
          CardDAV-Sync free beta
        </Link>{' '}
        (free)
      </Text>
    ),
  },
  {
    option: 'Only Calendar',
    value: (
      <Text>
        <Link href="https://play.google.com/store/apps/details?id=org.dmfs.caldav.lib">
          CalDAV-Sync
        </Link>{' '}
        ($2.89)
      </Text>
    ),
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
    fieldName: 'value',
  },
];

export const SyncListMobile: React.FunctionComponent = () => {
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
