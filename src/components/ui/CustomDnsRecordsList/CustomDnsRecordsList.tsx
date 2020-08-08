import {
  IColumn,
  IStackProps,
  mergeStyles,
  Stack,
  Text,
} from '@fluentui/react';
import { DNSCustomRecord } from 'mailinabox-api';
import React, { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { selectCustomRecordsWithGroups } from '../../../features/dnsSlice';
import { GroupedDetailsList } from '../GroupedDetailsList/GroupedDetailsList';
import { CustomDnsRecordActions } from './CustomDnsRecordActions';
import { CustomDnsRecordsActionsList } from './CustomDnsRecordsActionsList';

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Domain Name',
    minWidth: 200,
    maxWidth: 300,
    isMultiline: true,
    isRowHeader: true,
    fieldName: 'qname',
  },
  {
    key: 'column2',
    name: 'Record Type',
    minWidth: 100,
    maxWidth: 100,
    isMultiline: false,
    onRender: (item: DNSCustomRecord): React.ReactNode => {
      return <Text>{item.rtype}</Text>;
    },
  },
  {
    key: 'column3',
    name: 'Value',
    minWidth: 180,
    isMultiline: true,
    onRender: (item: DNSCustomRecord): React.ReactNode => {
      return <Text>{item.value}</Text>;
    },
  },
  {
    key: 'column4',
    name: 'Actions',
    isMultiline: false,
    minWidth: 50,
    onRender: (dnsRecord: DNSCustomRecord): React.ReactNode => {
      return <CustomDnsRecordsActionsList dnsRecord={dnsRecord} />;
    },
    className: mergeStyles({
      displayName: 'DetailsRow-actions-cell',
    }),
  },
];

interface CustomDnsRecordsListProps {
  openedGroupsState: [string[], Dispatch<SetStateAction<string[]>>];
}

export const CustomDnsRecordsList: React.FunctionComponent<
  IStackProps & CustomDnsRecordsListProps
> = ({ openedGroupsState, ...props }) => {
  const [records, groups] = useSelector(selectCustomRecordsWithGroups);

  return (
    <Stack as="section" {...props}>
      <CustomDnsRecordActions />
      <GroupedDetailsList
        items={records}
        columns={columns}
        groups={groups}
        openedGroupsState={openedGroupsState}
      />
    </Stack>
  );
};
