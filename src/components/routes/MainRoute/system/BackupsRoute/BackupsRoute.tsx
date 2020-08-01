import {
  Breadcrumb,
  MessageBarType,
  PivotItem,
  ProgressIndicator,
  Stack,
  Text,
} from '@fluentui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {
  getConfig,
  getStatus,
} from '../../../../../features/system/backupsSlice';
import { RootState } from '../../../../../store';
import { BackupConfigure } from '../../../../ui/BackupConfigure/BackupConfigure';
import { BackupsList } from '../../../../ui/BackupsList/BackupsList';
import { Body } from '../../../../ui/Body/Body';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { MessageBar } from '../../../../ui/MessageBar/MessageBar';
import { PivotRoutes } from '../../../../ui/PivotRoutes/PivotRoutes';

const BackupSections: React.FunctionComponent = () => {
  const { status } = useSelector((state: RootState) => state.system.backups);
  const { backups, unmatchedFileSize } = status;
  const { path, url } = useRouteMatch();
  return (
    <>
      <PivotRoutes>
        <PivotItem itemKey={url} headerText="Backup Status" />
        <PivotItem
          itemKey={`${url}/config`}
          headerText="Backup Configuration"
        />
      </PivotRoutes>

      <Switch>
        <Route exact path={path}>
          {backups && (
            <BackupsList
              backups={backups}
              unmatchedFileSize={unmatchedFileSize}
            />
          )}
          {!backups && (
            <MessageBar messageBarType={MessageBarType.warning} isMultiline>
              Backups are turned off.
            </MessageBar>
          )}
        </Route>
        <Route exact path={`${path}/config`}>
          <BackupConfigure
            backups={backups}
            unmatchedFileSize={unmatchedFileSize}
          />
        </Route>
      </Switch>

      {/* <Pivot linkSize={PivotLinkSize.large}>
        <PivotItem headerText="Backup Status">
          {backups && (
            <BackupsList
              className={className}
              backups={backups}
              unmatchedFileSize={unmatchedFileSize}
            />
          )}
          {!backups && (
            <MessageBar messageBarType={MessageBarType.warning} isMultiline>
              Backups are turned off.
            </MessageBar>
          )}
        </PivotItem>
        <PivotItem headerText="Backup Configuration">
          <BackupConfigure
            className={className}
            backups={backups}
            unmatchedFileSize={unmatchedFileSize}
          />
        </PivotItem>
      </Pivot> */}
    </>
  );
};

export const BackupsRoute: React.FunctionComponent & {
  path: string;
} = () => {
  const {
    isGettingStatus,
    isGettingConfig,
    getStatusError,
    getConfigError,
  } = useSelector((state: RootState) => state.system.backups);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStatus());
    dispatch(getConfig());
  }, [dispatch]);

  const isLoading = isGettingStatus || isGettingConfig;
  const error = getStatusError || getConfigError;

  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Breadcrumb
          onReduceData={(): undefined => undefined}
          styles={{
            root: {
              marginTop: 0,
            },
          }}
          items={[
            {
              text: 'System',
              key: 'system',
            },
            {
              text: 'Backup Status',
              key: 'backupstatus',
              as: 'h1',
            },
          ]}
        />
      </Stack>
      <BodyPanel>
        <Text>
          The box makes an incremental backup each night. By default the backup
          is stored on the machine itself, but you can also have it stored on
          Amazon S3.
        </Text>
      </BodyPanel>
      <BodyPanel>
        {error && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {error}
          </MessageBar>
        )}
        {isLoading && <ProgressIndicator label="Checking backup status..." />}
        {!isLoading && !error && <BackupSections />}
      </BodyPanel>
    </Body>
  );
};

BackupsRoute.path = '/system/backup';
