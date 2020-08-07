import {
  IColumn,
  IStackProps,
  Link,
  mergeStyles,
  MessageBarType,
  ScreenWidthMinLarge,
  Stack,
  Text,
} from '@fluentui/react';
import { WebDomain } from 'mailinabox-api';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import {
  getDomains,
  selectOrderedAndGroupedStaticEnabledDomains,
  WebDomainWithDomainInfo,
} from '../../../features/webSlice';
import { RootState } from '../../../store';
import { GroupedDetailsList } from '../GroupedDetailsList/GroupedDetailsList';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { LoadingOverlayContainer } from '../LoadingOverlay/LoadingOverlayContainer';
import { MessageBar } from '../MessageBar/MessageBar';
import { WebDomainActions } from './WebDomainActions';
import { WebDomainsActionsList } from './WebDomainsActionsList';

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Site',
    minWidth: 300,
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
    className: mergeStyles({
      displayName: 'DetailsRow-actions-cell',
    }),
  },
];

interface WebDomainsListProps {
  openedGroupsState: [string[], Dispatch<SetStateAction<string[]>>];
}

export const WebDomainsList: React.FunctionComponent<
  IStackProps & WebDomainsListProps
> = ({ openedGroupsState, ...props }) => {
  const { isGettingDomains, getDomainsError } = useSelector(
    (state: RootState) => state.web
  );
  const dispatch = useDispatch();
  const [domains, groups] = useSelector(
    selectOrderedAndGroupedStaticEnabledDomains
  );
  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });

  useEffect(() => {
    if (!domains.length && !isGettingDomains && !getDomainsError) {
      dispatch(getDomains());
    }
  }, [dispatch, domains, getDomainsError, isGettingDomains]);
  return (
    <Stack {...props}>
      <WebDomainActions />
      {getDomainsError && (
        <MessageBar messageBarType={MessageBarType.error}>
          {getDomainsError}
        </MessageBar>
      )}
      <LoadingOverlayContainer>
        {isGettingDomains && (
          <LoadingOverlay
            loadingLabel="Loading domains..."
            hasLoaded={Boolean(domains.length)}
          />
        )}
        {!isGettingDomains && !getDomainsError && (
          <Stack gap="m">
            <MessageBar
              isMultiline={isMinLargeScreen}
              truncated={!isMinLargeScreen}
            >
              To add a domain to this table, create a dummy
              <Link href="#users">mail user</Link> or
              <Link href="#aliases">alias</Link> on the domain first and see the
              <Link href="https://mailinabox.email/guide.html#domain-name-configuration">
                setup guide
              </Link>{' '}
              for adding nameserver records to the new domain at your registrar
              (but <i>not</i> glue records).
            </MessageBar>
            <GroupedDetailsList
              items={domains}
              columns={columns}
              groups={groups}
              openedGroupsState={openedGroupsState}
            />
          </Stack>
        )}
      </LoadingOverlayContainer>
    </Stack>
  );
};
