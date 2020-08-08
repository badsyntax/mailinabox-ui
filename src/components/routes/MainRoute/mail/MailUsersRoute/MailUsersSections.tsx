import { MessageBar, MessageBarType } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { getUsers } from '../../../../../features/usersSlice';
import { RootState } from '../../../../../store';
import { LoadingOverlay } from '../../../../ui/LoadingOverlay/LoadingOverlay';
import { LoadingOverlayContainer } from '../../../../ui/LoadingOverlay/LoadingOverlayContainer';
import { MailUserAdd } from '../../../../ui/MailUserAdd/MailUserAdd';
import { MailUsersList } from '../../../../ui/MailUsersList/MailUsersList';
import { PivotRoutes } from '../../../../ui/PivotRoutes/PivotRoutes';

export const MailUsersSections: React.FunctionComponent = () => {
  const { isGettingUsers, users, getUsersError } = useSelector(
    (state: RootState) => state.users
  );
  const openedGroupsState = useState<string[]>([]);
  const { path, url } = useRouteMatch();

  const dispatch = useDispatch();

  const pivotItems = [
    {
      itemKey: url,
      headerText: 'Mail Users',
    },
    {
      itemKey: `${url}/add`,
      headerText: 'Add a Mail User',
    },
  ];

  useEffect(() => {
    if (!users.length) {
      dispatch(getUsers());
    }
  }, [dispatch, users.length]);
  return (
    <>
      <PivotRoutes items={pivotItems} />
      <Switch>
        <Route exact path={path}>
          <LoadingOverlayContainer>
            {getUsersError && (
              <MessageBar messageBarType={MessageBarType.error} isMultiline>
                {getUsersError}
              </MessageBar>
            )}
            {isGettingUsers && (
              <LoadingOverlay
                loadingLabel="Loading users..."
                hasLoaded={Boolean(users.length)}
              />
            )}
            {!getUsersError && Boolean(users.length) && (
              <MailUsersList openedGroupsState={openedGroupsState} />
            )}
          </LoadingOverlayContainer>
        </Route>
        <Route exact path={`${path}/add`}>
          <MailUserAdd />
        </Route>
      </Switch>
    </>
  );
};
