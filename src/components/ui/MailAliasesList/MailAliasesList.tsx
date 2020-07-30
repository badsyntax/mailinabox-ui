import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  DetailsRow,
  IColumn,
  IDetailsGroupDividerProps,
  IDetailsRowProps,
  IGroup,
  IGroupHeaderProps,
  IRenderFunction,
  IStackProps,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { MailAlias } from 'mailinabox-api';
import React from 'react';
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
    onRender: (alias: MailAlias): React.ReactNode => {
      return <MailAliasActionsList alias={alias} />;
    },
  },
];

export const MailAliasesList: React.FunctionComponent<
  IStackProps & {
    aliases: Array<MailAlias>;
    groups: Array<IGroup>;
  }
> = ({ aliases = [], groups = [], ...props }) => {
  return (
    <Stack as="section" {...props}>
      <MailAliasActions />
      <DetailsList
        items={aliases}
        groups={groups}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        constrainMode={ConstrainMode.horizontalConstrained}
        useReducedRowRenderer
        usePageCache
        onRenderRow={(props?: IDetailsRowProps): JSX.Element | null => {
          if (props) {
            return (
              <DetailsRow
                {...props}
                styles={{
                  root: {
                    animation: 'none',
                  },
                }}
              />
            );
          }
          return null;
        }}
        groupProps={{
          isAllGroupsCollapsed: true,
          onRenderHeader: (
            props?: IDetailsGroupDividerProps,
            defaultRender?: IRenderFunction<IGroupHeaderProps>
          ): JSX.Element | null => {
            console.log('props', props);

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
