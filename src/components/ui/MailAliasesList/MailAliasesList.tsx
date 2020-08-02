import {
  IColumn,
  IStackProps,
  mergeStyles,
  Stack,
  Text,
} from '@fluentui/react';
import { MailAlias } from 'mailinabox-api';
import React, { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { selectAliasesWithGroups } from '../../../features/aliasesSlice';
import { GroupedDetailsList } from '../GroupedDetailsList/GroupedDetailsList';
import { MailAliasActions } from './MailAliasActions';
import { MailAliasActionsList } from './MailAliasActionsList';

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Alias',
    minWidth: 320,
    isMultiline: true,
    isRowHeader: true,
    fieldName: 'addressDisplay',
  },
  {
    key: 'column2',
    name: 'Forwards To',
    minWidth: 260,
    isMultiline: true,
    onRender: (item: MailAlias): React.ReactElement => {
      if (!item || !item.forwardsTo) {
        console.log('item');
        debugger;
      }
      return (
        <>
          {item.forwardsTo.map((forwardToAddress) => (
            <Text block>{forwardToAddress}</Text>
          ))}
        </>
      );
    },
  },
  {
    key: 'column3',
    name: 'Permitted Senders',
    minWidth: 260,
    isMultiline: true,
    onRender: (item: MailAlias): React.ReactElement => {
      return (
        <>
          {item.permittedSenders?.map((permittedSender) => (
            <Text block>{permittedSender}</Text>
          ))}
        </>
      );
    },
  },
  {
    key: 'column4',
    name: 'Actions',
    isMultiline: false,
    minWidth: 50,
    isPadded: false,
    onRender: (alias: MailAlias): React.ReactNode => {
      return <MailAliasActionsList alias={alias} />;
    },
    className: mergeStyles({
      displayName: 'DetailsRow-actions-cell',
    }),
  },
];

interface MailAliasesListProps {
  openedGroupsState: [string[], Dispatch<SetStateAction<string[]>>];
}

export const MailAliasesList: React.FunctionComponent<
  IStackProps & MailAliasesListProps
> = ({ openedGroupsState, ...props }) => {
  const [aliases, groups] = useSelector(selectAliasesWithGroups);
  return (
    <Stack as="section" {...props}>
      <MailAliasActions />
      <GroupedDetailsList
        openedGroupsState={openedGroupsState}
        items={aliases}
        groups={groups}
        columns={columns}
      />
    </Stack>
  );
};
