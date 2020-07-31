import {
  getTheme,
  mergeStyles,
  MessageBar,
  MessageBarType,
  Overlay,
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
import { getAliases } from '../../../features/aliasesSlice';
import { RootState } from '../../../store';
import { MailAliasAdd } from '../MailAliasAdd/MailAliasAdd';
import { MailAliasesList } from '../MailAliasesList/MailAliasesList';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

export const MailAliases: React.FunctionComponent = () => {
  const { isGettingAliases, getAliasesError, aliases } = useSelector(
    (state: RootState) => state.aliases
  );
  const openedGroupsState = useState<string[]>([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { path, url } = useRouteMatch();

  const onPivotLinkClick = useCallback(
    (item?: PivotItem, _event?: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (item?.props.itemKey) {
        history.push(item.props.itemKey);
      }
    },
    [history]
  );

  useEffect(() => {
    if (!aliases.length) {
      dispatch(getAliases());
    }
  }, [aliases.length, dispatch]);
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
          <div
            style={{
              position: 'relative',
            }}
          >
            {getAliasesError && (
              <MessageBar
                messageBarType={MessageBarType.error}
                className={className}
              >
                {getAliasesError}
              </MessageBar>
            )}
            {isGettingAliases && Boolean(aliases.length) && (
              <Overlay
                styles={{
                  root: {
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                }}
              >
                <ProgressIndicator label="Loading aliases..." />
              </Overlay>
            )}
            {isGettingAliases && !Boolean(aliases.length) && (
              <ProgressIndicator label="Loading aliases..." />
            )}
            {!getAliasesError && Boolean(aliases.length) && (
              <MailAliasesList
                className={className}
                openedGroupsState={openedGroupsState}
              />
            )}
          </div>
        </Route>
        <Route exact path={`${path}/add`}>
          <MailAliasAdd />
        </Route>
      </Switch>
    </>
  );
};
