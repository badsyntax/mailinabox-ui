import {
  Breadcrumb,
  getTheme,
  mergeStyles,
  MessageBarType,
  PivotItem,
  Stack,
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { getUsers } from '../../../../../features/usersSlice';
import { RootState } from '../../../../../store';
import { Body } from '../../../../ui/Body/Body';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { LoadingOverlay } from '../../../../ui/LoadingOverlay/LoadingOverlay';
import { MailUserAdd } from '../../../../ui/MailUserAdd/MailUserAdd';
import { MailUsersList } from '../../../../ui/MailUsersList/MailUsersList';
import { MessageBar } from '../../../../ui/MessageBar/MessageBar';
import { PivotRoutes } from '../../../../ui/PivotRoutes/PivotRoutes';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

const UsersSections: React.FunctionComponent = () => {
  const { isGettingUsers, users, getUsersError } = useSelector(
    (state: RootState) => state.users
  );
  const openedGroupsState = useState<string[]>([]);
  const { path, url } = useRouteMatch();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!users.length) {
      dispatch(getUsers());
    }
  }, [dispatch, users.length]);
  return (
    <>
      <PivotRoutes>
        <PivotItem itemKey={url} headerText="Existing Mail Users" />
        <PivotItem itemKey={`${url}/add`} headerText="Add a Mail User" />
      </PivotRoutes>
      <Switch>
        <Route exact path={path}>
          {getUsersError && (
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline
              className={className}
            >
              {getUsersError}
            </MessageBar>
          )}
          {isGettingUsers && (
            <LoadingOverlay
              loadingLabel="Loading aliases..."
              hasLoaded={Boolean(users.length)}
            />
          )}
          {!isGettingUsers && !getUsersError && (
            <MailUsersList
              className={className}
              openedGroupsState={openedGroupsState}
            />
          )}
        </Route>
        <Route exact path={`${path}/add`}>
          <MailUserAdd className={className} />
        </Route>
      </Switch>
    </>
  );
};

export const UsersRoute: React.FunctionComponent & {
  path: string;
} = () => {
  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Breadcrumb
          onReduceData={(): undefined => undefined}
          styles={{
            root: {
              marginTop: 0,
              width: '100%',
            },
          }}
          items={[
            {
              text: 'Mail',
              key: 'system',
            },
            {
              text: 'Users',
              key: 'users',
              as: 'h1',
            },
          ]}
        />
      </Stack>
      <BodyPanel>
        <UsersSections />
      </BodyPanel>
    </Body>
  );
};

UsersRoute.path = '/mail/users';
