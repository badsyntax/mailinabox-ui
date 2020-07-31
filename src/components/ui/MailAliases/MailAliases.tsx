import {
  getTheme,
  mergeStyles,
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  PivotLinkSize,
  ProgressIndicator,
} from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import {
  getAliases,
  selectAliasesError,
  selectIsGettingAliases,
} from '../../../features/aliasesSlice';
import { MailAliasAdd } from '../MailAliasAdd/MailAliasAdd';
import { MailAliasesList } from '../MailAliasesList/MailAliasesList';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

export const MailAliases: React.FunctionComponent = () => {
  const openedGroupsState = useState<string[]>([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const isCheckingAliases = useSelector(selectIsGettingAliases);
  const aliasesError = useSelector(selectAliasesError);
  const { path, url } = useRouteMatch();

  const onPivotLinkClick = useCallback(
    (item?: PivotItem, ev?: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (item && item?.props.itemKey) {
        history.push(item.props.itemKey);
      }
    },
    [history]
  );

  useEffect(() => {
    dispatch(getAliases());
  }, [dispatch]);
  return (
    <>
      <Pivot
        linkSize={PivotLinkSize.large}
        selectedKey={location.pathname}
        onLinkClick={onPivotLinkClick}
      >
        <PivotItem itemKey={url} headerText="Existing Mail Aliases" />
        <PivotItem itemKey={`${url}/add`} headerText="Add a Mail Alias" />
      </Pivot>
      <Switch>
        <Route exact path={path}>
          <>
            {aliasesError && (
              <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline
                className={className}
              >
                {aliasesError}
              </MessageBar>
            )}
            {isCheckingAliases && (
              <ProgressIndicator label="Loading aliases..." />
            )}
            {!isCheckingAliases && !aliasesError && (
              <MailAliasesList
                className={className}
                openedGroupsState={openedGroupsState}
              />
            )}
          </>
        </Route>
        <Route exact path={`${path}/add`}>
          <MailAliasAdd />
        </Route>
      </Switch>
    </>
  );
};
