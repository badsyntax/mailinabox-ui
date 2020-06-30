import {
  getTheme,
  mergeStyles,
  MessageBarType,
  Pivot,
  PivotItem,
  PivotLinkSize,
  ProgressIndicator,
  Stack,
  Text,
} from '@fluentui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBackupsStatus,
  selectBackupsStatusError,
  selectIsCheckingBackupsStatus,
  systemBackupsStatusCheck,
} from '../../../../../features/system/backupsSlice';
import { BackupConfigure } from '../../../../BackupConfigure/BackupConfigure';
import { BackupsList } from '../../../../BackupsList/BackupsList';
import { Body } from '../../../../Body/Body';
import { BodyPanel } from '../../../../BodyPanel/BodyPanel';
import { MessageBar } from '../../../../MessageBar/MessageBar';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

const BackupSections: React.FunctionComponent = () => {
  const { backups, unmatchedFileSize } = useSelector(selectBackupsStatus);
  return (
    <Pivot linkSize={PivotLinkSize.large}>
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
    </Pivot>
  );
};

export const Backups: React.FunctionComponent & {
  path: string;
} = () => {
  const dispatch = useDispatch();
  const isCheckingBackupsStatus = useSelector(selectIsCheckingBackupsStatus);
  const statusError = useSelector(selectBackupsStatusError);

  useEffect(() => {
    dispatch(systemBackupsStatusCheck());
  }, [dispatch]);

  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text as="h1" block variant="xLarge">
          Backup Status
        </Text>
      </Stack>
      <BodyPanel>
        <Text>
          The box makes an incremental backup each night. By default the backup
          is stored on the machine itself, but you can also have it stored on
          Amazon S3.
        </Text>
      </BodyPanel>
      <BodyPanel>
        {statusError && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {statusError}
          </MessageBar>
        )}
        {isCheckingBackupsStatus && (
          <ProgressIndicator label="Checking backup status..." />
        )}
        {!isCheckingBackupsStatus && !statusError && <BackupSections />}
      </BodyPanel>
    </Body>
  );
};

Backups.path = '/system/backup';
