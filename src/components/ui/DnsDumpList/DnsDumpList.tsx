import {
  FontSizes,
  IColumn,
  IStackProps,
  mergeStyles,
  Stack,
  Text,
} from '@fluentui/react';
import { DNSCustomRecord, DNSDumpDomainRecord } from 'mailinabox-api';
import React, { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { selectDumpWithGroups } from '../../../features/dnsSlice';
import { GroupedDetailsList } from '../GroupedDetailsList/GroupedDetailsList';
import { InfoButton } from '../InfoButton/InfoButton';

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Qname',
    minWidth: 260,
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
    minWidth: 280,
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
    className: mergeStyles({
      displayName: 'DetailsRow-actions-cell',
    }),
  },
];

interface DnsDumpListProps {
  openedGroupsState: [string[], Dispatch<SetStateAction<string[]>>];
}

export const DnsDumpList: React.FunctionComponent<
  IStackProps & DnsDumpListProps
> = ({ openedGroupsState, ...props }) => {
  const [records, groups] = useSelector(selectDumpWithGroups);
  return (
    <Stack as="section" {...props}>
      <GroupedDetailsList
        items={records}
        groups={groups}
        columns={columns}
        openedGroupsState={openedGroupsState}
      />
    </Stack>
  );
};
