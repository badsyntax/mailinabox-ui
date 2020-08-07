import { PivotItem, PivotLinkSize, ScreenWidthMinLarge } from '@fluentui/react';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { PivotRoutes } from '../../../ui/PivotRoutes/PivotRoutes';
import { WebDomainsList } from '../../../ui/WebDomainsList/WebDomainsList';
import { WebInstructions } from '../../../ui/WebInstructions/WebInstructions';

export const WebSections: React.FunctionComponent = () => {
  const { path, url } = useRouteMatch();
  const openedGroupsState = useState<string[]>([]);
  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });
  const pivotProps = {
    linkSize: isMinLargeScreen ? PivotLinkSize.large : PivotLinkSize.normal,
  };
  return (
    <>
      <PivotRoutes {...pivotProps}>
        <PivotItem itemKey={url} headerText="Domains" />
        <PivotItem
          itemKey={`${url}/instructions`}
          headerText="Uploading Instructions"
        />
      </PivotRoutes>
      <Switch>
        <Route exact path={path}>
          <WebDomainsList openedGroupsState={openedGroupsState} />
        </Route>
        <Route exact path={`${path}/instructions`}>
          <WebInstructions />
        </Route>
      </Switch>
    </>
  );
};
