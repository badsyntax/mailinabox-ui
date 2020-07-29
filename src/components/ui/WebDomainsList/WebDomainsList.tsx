import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  DirectionalHint,
  IColumn,
  IconButton,
  IDetailsGroupDividerProps,
  IGroupHeaderProps,
  IRenderFunction,
  Link,
  MessageBarType,
  ProgressIndicator,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { WebDomain } from 'mailinabox-api';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDomains,
  selectGetDomainsError,
  selectIsGettingDomains,
  selectOrderedAndGroupedStaticEnabledDomains,
} from '../../../features/webSlice';
import { MessageBar } from '../MessageBar/MessageBar';

interface WebActionsListProps {
  webDomain: WebDomain;
}

export const WebActionsList: React.FunctionComponent<WebActionsListProps> = ({
  webDomain,
}) => {
  return (
    <IconButton
      menuIconProps={{
        iconName: 'MoreVertical',
      }}
      styles={{
        menuIcon: {
          fontWeight: 'bold',
        },
      }}
      role="button"
      aria-haspopup={true}
      aria-label="Show actions"
      menuProps={{
        directionalHint: DirectionalHint.bottomRightEdge,
        items: [
          {
            key: 'changeroot',
            text: 'Change Root Directory',
            onClick: (): void => undefined,
          },
        ],
      }}
    />
  );
};

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Site',
    minWidth: 100,
    maxWidth: 300,
    isRowHeader: true,
    onRender: (webDomain: WebDomain): React.ReactElement => {
      return <Link href={webDomain.domain}>{webDomain.domain}</Link>;
    },
  },
  {
    key: 'column2',
    name: 'Directory for Files',
    minWidth: 300,
    isRowHeader: false,
    onRender: (webDomain: WebDomain): React.ReactElement => {
      return <Text>{webDomain.root}</Text>;
    },
  },
  {
    key: 'column3',
    name: 'Actions',
    isMultiline: false,
    minWidth: 50,
    onRender: (webDomain: WebDomain): React.ReactNode => {
      return <WebActionsList webDomain={webDomain} />;
    },
  },
];

interface WebDomainsListProps {
  className: string;
}

export const WebDomainsList: React.FunctionComponent<WebDomainsListProps> = ({
  className,
}) => {
  const dispatch = useDispatch();
  const [domains, groups] = useSelector(
    selectOrderedAndGroupedStaticEnabledDomains
  );
  const isGettingDomains = useSelector(selectIsGettingDomains);
  const getDomainsError = useSelector(selectGetDomainsError);

  useEffect(() => {
    if (!domains.length && !isGettingDomains) {
      dispatch(getDomains());
    }
  }, [dispatch, domains, isGettingDomains]);
  return (
    <Stack className={className}>
      {getDomainsError && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline>
          {getDomainsError}
        </MessageBar>
      )}
      {isGettingDomains && <ProgressIndicator label="Loading domains..." />}
      {!isGettingDomains && (
        <>
          <MessageBar>
            To add a domain to this table, create a dummy
            <Link href="#users">mail user</Link> or
            <Link href="#aliases">alias</Link> on the domain first and see the
            <Link href="https://mailinabox.email/guide.html#domain-name-configuration">
              setup guide
            </Link>{' '}
            for adding nameserver records to the new domain at your registrar
            (but <i>not</i> glue records).
          </MessageBar>
          <DetailsList
            items={domains}
            columns={columns}
            groups={groups}
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
            layoutMode={DetailsListLayoutMode.justified}
            onShouldVirtualize={(): boolean => false}
            selectionMode={SelectionMode.none}
            constrainMode={ConstrainMode.horizontalConstrained}
          />
        </>
      )}
    </Stack>
  );
};
