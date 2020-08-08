import { MessageBar, MessageBarType } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { getAliases } from '../../../features/aliasesSlice';
import { RootState } from '../../../store';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { LoadingOverlayContainer } from '../LoadingOverlay/LoadingOverlayContainer';
import { MailAliasAdd } from '../MailAliasAdd/MailAliasAdd';
import { MailAliasesList } from '../MailAliasesList/MailAliasesList';
import { PivotRoutes } from '../PivotRoutes/PivotRoutes';

export const MailAliases: React.FunctionComponent = () => {
  const { isGettingAliases, getAliasesError, aliases } = useSelector(
    (state: RootState) => state.aliases
  );
  const openedGroupsState = useState<string[]>([]);
  const dispatch = useDispatch();
  const { path, url } = useRouteMatch();

  const pivotItems = [
    {
      itemKey: url,
      headerText: 'Mail Aliases',
    },
    {
      itemKey: `${url}/add`,
      headerText: 'Add a Mail Alias',
    },
  ];

  useEffect(() => {
    if (!aliases.length) {
      dispatch(getAliases());
    }
  }, [aliases.length, dispatch]);
  return (
    <>
      <PivotRoutes items={pivotItems} />
      <Switch>
        <Route exact path={path}>
          <LoadingOverlayContainer>
            {getAliasesError && (
              <MessageBar messageBarType={MessageBarType.error}>
                {getAliasesError}
              </MessageBar>
            )}
            {isGettingAliases && (
              <LoadingOverlay
                loadingLabel="Loading aliases..."
                hasLoaded={Boolean(aliases.length)}
              />
            )}
            {!getAliasesError && Boolean(aliases.length) && (
              <MailAliasesList openedGroupsState={openedGroupsState} />
            )}
          </LoadingOverlayContainer>
        </Route>
        <Route exact path={`${path}/add`}>
          <MailAliasAdd />
        </Route>
      </Switch>
    </>
  );
};
