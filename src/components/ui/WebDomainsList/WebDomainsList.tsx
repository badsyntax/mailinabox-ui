import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
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
  selectOrderedAndGroupedStaticEnabledDomains,
  WebDomainWithDomainInfo,
} from '../../../features/webSlice';
import { RootState } from '../../../store';
import { MessageBar } from '../MessageBar/MessageBar';
import { WebDomainActions } from './WebDomainActions';
import { WebDomainsActionsList } from './WebDomainsActionsList';

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Site',
    minWidth: 100,
    maxWidth: 300,
    isRowHeader: true,
    onRender: (webDomain: WebDomain): React.ReactElement => (
      <Link href={`https://${webDomain.domain}`}>
        https://{webDomain.domain}
      </Link>
    ),
  },
  {
    key: 'column2',
    name: 'Directory for Files',
    minWidth: 300,
    isRowHeader: false,
    onRender: (webDomain: WebDomain): React.ReactElement => (
      <Text>{webDomain.root}</Text>
    ),
  },
  {
    key: 'column3',
    name: 'Actions',
    isMultiline: false,
    minWidth: 50,
    onRender: (webDomain: WebDomainWithDomainInfo): React.ReactNode => (
      <WebDomainsActionsList webDomain={webDomain} />
    ),
  },
];

interface WebDomainsListProps {
  className: string;
}

export const WebDomainsList: React.FunctionComponent<WebDomainsListProps> = ({
  className,
}) => {
  const { isGettingDomains, getDomainsError } = useSelector(
    (state: RootState) => state.web
  );
  const dispatch = useDispatch();
  const [domains, groups] = useSelector(
    selectOrderedAndGroupedStaticEnabledDomains
  );

  useEffect(() => {
    if (!domains.length && !isGettingDomains && !getDomainsError) {
      dispatch(getDomains());
    }
  }, [dispatch, domains, getDomainsError, isGettingDomains]);
  return (
    <Stack className={className}>
      <WebDomainActions />
      {getDomainsError && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline>
          {getDomainsError}
        </MessageBar>
      )}
      {isGettingDomains && <ProgressIndicator label="Loading domains..." />}
      {!isGettingDomains && !getDomainsError && (
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
            selectionMode={SelectionMode.none}
            constrainMode={ConstrainMode.horizontalConstrained}
          />
        </>
      )}
    </Stack>
  );
};
