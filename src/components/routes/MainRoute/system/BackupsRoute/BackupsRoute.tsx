import {
  BaseButton,
  Dialog,
  DialogFooter,
  DialogType,
  MessageBarType,
  PivotItem,
  PivotLinkSize,
  PrimaryButton,
  ProgressIndicator,
  ScreenWidthMinLarge,
  Stack,
  Text,
} from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {
  getConfig,
  getStatus,
} from '../../../../../features/system/backupsSlice';
import { RootState } from '../../../../../store';
import { BackupConfigure } from '../../../../ui/BackupConfigure/BackupConfigure';
import { BackupsList } from '../../../../ui/BackupsList/BackupsList';
import { Body } from '../../../../ui/Body/Body';
import { BodyBreadcrumb } from '../../../../ui/BodyBreadcrumb/BodyBreadcrumb';
import { BodyPanel } from '../../../../ui/BodyPanel/BodyPanel';
import { MessageBar } from '../../../../ui/MessageBar/MessageBar';
import { PivotRoutes } from '../../../../ui/PivotRoutes/PivotRoutes';

const BackupSections: React.FunctionComponent = () => {
  const { status } = useSelector((state: RootState) => state.system.backups);
  const { path, url } = useRouteMatch();
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const { backups, unmatchedFileSize, error } = status;

  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });
  const pivotProps = {
    linkSize: isMinLargeScreen ? PivotLinkSize.large : PivotLinkSize.normal,
  };

  const onDialogClose = useCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    },
    []
  );

  useEffect(() => {
    if (error) {
      setIsDialogHidden(false);
    }
  }, [error]);

  return (
    <>
      {/*
      TODO: when the dialog is shown it creates a whitespace gap due to the stacking and due
      to the dialog rendering a layer element
      */}
      <Dialog
        hidden={isDialogHidden}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'Backup error',
        }}
        modalProps={{
          isBlocking: true,
        }}
        minWidth={480}
        maxWidth={480}
      >
        {error}
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onDialogClose} />
        </DialogFooter>
      </Dialog>
      <PivotRoutes {...pivotProps}>
        <PivotItem itemKey={url} headerText="Backup Status" />
        <PivotItem
          itemKey={`${url}/config`}
          headerText="Backup Configuration"
        />
      </PivotRoutes>
      <Switch>
        <Route exact path={path}>
          {backups && backups.length > 0 && (
            <BackupsList
              backups={backups}
              unmatchedFileSize={unmatchedFileSize}
            />
          )}
          {!backups && (
            <MessageBar messageBarType={MessageBarType.warning}>
              Backups are turned off.
            </MessageBar>
          )}
          {backups && !backups.length && (
            <MessageBar messageBarType={MessageBarType.warning}>
              No backups have been made yet.
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
        <BodyBreadcrumb
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
      <Stack gap="l1">
        <BodyPanel>
          <Text>
            The box makes an incremental backup each night. By default the
            backup is stored on the machine itself, but you can also have it
            stored on Amazon S3.
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
      </Stack>
    </Body>
  );
};

BackupsRoute.path = '/system/backup';
