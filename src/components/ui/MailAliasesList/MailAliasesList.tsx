import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IDetailsGroupDividerProps,
  IGroup,
  IGroupHeaderProps,
  IRenderFunction,
  IStackProps,
  mergeStyleSets,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { MailAlias } from 'mailinabox-api';
import React from 'react';
import { MailAliasActions } from './MailAliasActions';
import { MailAliasActionsList } from './MailAliasActionsList';

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px',
  },
});

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

    // onRender: (item: MailAlias): React.ReactElement => {
    //   return (
    //     <IconButton
    //       menuIconProps={{
    //         iconName: 'MoreVertical',
    //       }}
    //       styles={{
    //         menuIcon: {
    //           fontWeight: 'bold',
    //         },
    //       }}
    //       role="button"
    //       aria-haspopup={true}
    //       aria-label="Show actions"
    //       menuProps={{
    //         directionalHint: DirectionalHint.bottomRightEdge,
    //         items: [
    //           {
    //             key: 'edit',
    //             text: 'Edit',
    //           },
    //           {
    //             key: 'delete',
    //             text: 'Delete',
    //           },
    //         ],
    //       }}
    //     />
    //   );
    // },
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
        groupProps={{
          isAllGroupsCollapsed: true,
          onRenderHeader: (
            props?: IDetailsGroupDividerProps,
            defaultRender?: IRenderFunction<IGroupHeaderProps>
          ): JSX.Element | null => {
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
