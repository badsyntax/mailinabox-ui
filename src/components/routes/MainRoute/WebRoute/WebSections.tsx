import React, { useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { PivotRoutes } from '../../../ui/PivotRoutes/PivotRoutes';
import { WebDomainsList } from '../../../ui/WebDomainsList/WebDomainsList';
import { WebInstructions } from '../../../ui/WebInstructions/WebInstructions';

export const WebSections: React.FunctionComponent = () => {
  const { path, url } = useRouteMatch();
  const openedGroupsState = useState<string[]>([]);
  const pivotItems = [
    {
      itemKey: url,
      headerText: 'Domains',
    },
    {
      itemKey: `${url}/instructions`,
      headerText: 'Uploading Instructions',
    },
  ];
  return (
    <>
      <PivotRoutes items={pivotItems} />
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
