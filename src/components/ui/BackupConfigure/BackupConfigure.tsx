import {
  BaseButton,
  Button,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IDropdownOption,
  IStackProps,
  mergeStyles,
  MessageBarType,
  PrimaryButton,
  ScreenWidthMinLarge,
  Stack,
} from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import {
  SystemBackupConfigResponse,
  SystemBackupConfigUpdateRequest,
  SystemBackupStatusResponse,
} from 'mailinabox-api';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { config } from '../../../config';
import {
  getStatus,
  updateConfig,
  updateConfigReset,
  updateConfigResetError,
} from '../../../features/system/backupsSlice';
import { RootState } from '../../../store';
import { MessageBar } from '../MessageBar/MessageBar';
import { BackupConfigureLocal } from './local/BackupConfigureLocal';
import { BackupInfoLocal } from './local/BackupInfoLocal';
import { BackupConfigureRsync } from './rsync/BackupConfigureRsync';
import { BackupInfoRsync } from './rsync/BackupInfoRsync';
import { BackupConfigureS3 } from './s3/BackupConfigureS3';
import { BackupInfoS3 } from './s3/BackupInfoS3';
import { BackupType } from './types';

const columnClassName = mergeStyles({
  flexBasis: 0,
});

const backupOptions: IDropdownOption[] = [
  {
    key: BackupType.off,
    text: 'Nowhere (Disable Backups)',
  },
  {
    key: BackupType.local,
    text: config.hostname,
  },
  {
    key: BackupType.rsync,
    text: 'rsync',
  },
  {
    key: BackupType.s3,
    text: 'Amazon S3',
  },
];

const daysDescription =
  'This is the minimum number of days backup data is kept for. The box makes an incremental backup, so backup data is often kept much longer. An incremental backup file that is less than this number of days old requires that all previous increments back to the most recent full backup, plus that full backup, remain available.';

function getBackupType(
  config: SystemBackupConfigResponse
): BackupType | undefined {
  if (config.target === 'file://' + config.fileTargetDirectory) {
    return BackupType.local;
  } else if (config.target === 'off') {
    return BackupType.off;
  } else if (config.target.substring(0, 8) === 'rsync://') {
    return BackupType.rsync;
  } else if (config.target.substring(0, 5) === 's3://') {
    return BackupType.s3;
  }
}

export const BackupConfigure: React.FunctionComponent<
  IStackProps & SystemBackupStatusResponse
> = ({ backups, unmatchedFileSize, ...props }) => {
  const {
    updateConfigError,
    updateConfigResponse,
    isUpdatingConfig,
    config: backupConfig,
  } = useSelector((state: RootState) => state.system.backups);

  const dispatch = useDispatch();
  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);

  const backupType = getBackupType(backupConfig);
  const selectedBackupOption = backupOptions.find(
    (option) => option.key === backupType
  );
  const [backupOption, setBackupOption] = useState<IDropdownOption | undefined>(
    selectedBackupOption
  );
  const [updateBackupConfig, setUpdateBackupConfig] = useState<
    SystemBackupConfigUpdateRequest | undefined
  >();

  const onDialogDismissed = (): void => {
    if (updateConfigResponse === 'OK') {
      dispatch(getStatus());
    }
    dispatch(updateConfigReset());
  };

  const onDialogClose = useConstCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    }
  );

  const onBackupOptionChange = useConstCallback(
    (
      _event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      setBackupOption(option);
    }
  );

  const onBackupConfigChange = useConstCallback(
    (config: SystemBackupConfigUpdateRequest): void => {
      setUpdateBackupConfig(config);
    }
  );

  const onFormSubmit = (event: React.FormEvent<HTMLElement>): void => {
    event.preventDefault();
    if (updateBackupConfig) {
      dispatch(updateConfig(updateBackupConfig));
    }
  };

  const onMessageBarDismiss = useConstCallback(
    (
      _event?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
    ): void => {
      dispatch(updateConfigResetError());
    }
  );

  useEffect(() => {
    if (updateConfigResponse && isDialogHidden && !hasDialogOpened) {
      setIsDialogHidden(false);
    }
  }, [updateConfigResponse, hasDialogOpened, isDialogHidden]);

  useEffect(() => {
    if (!isDialogHidden) {
      setHasDialogOpened(true);
    }
  }, [isDialogHidden]);

  useEffect(() => {
    return (): void => {
      dispatch(updateConfigReset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (backupOption?.key === BackupType.off) {
      setUpdateBackupConfig({
        target: BackupType.off,
        targetUser: '',
        targetPass: '',
        minAge: backupConfig.minAgeInDays || 1,
      });
    }
  }, [backupConfig.minAgeInDays, backupOption]);

  return (
    <Stack as="section" gap="l2" horizontal={isMinLargeScreen} {...props}>
      <Dialog
        hidden={isDialogHidden}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'Backup configuration',
        }}
        modalProps={{
          isBlocking: true,
        }}
        minWidth={480}
        maxWidth={480}
        onDismissed={onDialogDismissed}
      >
        {updateConfigResponse}
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onDialogClose} />
        </DialogFooter>
      </Dialog>
      <Stack gap="m" grow={1} className={columnClassName}>
        <Dropdown
          label="Backup to"
          options={backupOptions}
          selectedKey={backupOption?.key}
          required
          onChange={onBackupOptionChange}
        />
        {backupOption?.key === BackupType.local && (
          <BackupInfoLocal config={backupConfig} />
        )}
        {backupOption?.key === BackupType.rsync && (
          <BackupInfoRsync config={backupConfig} />
        )}
        {backupOption?.key === BackupType.s3 && (
          <BackupInfoS3 config={backupConfig} />
        )}
      </Stack>
      <Stack
        gap="m"
        grow={1}
        className={columnClassName}
        verticalAlign={backupOption?.key === BackupType.off ? 'end' : 'start'}
        as="form"
        onSubmit={onFormSubmit}
      >
        {updateConfigError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            onDismiss={onMessageBarDismiss}
          >
            {updateConfigError}
          </MessageBar>
        )}
        {backupOption?.key === BackupType.local && (
          <BackupConfigureLocal
            backupConfig={backupConfig}
            isCurrentType={backupType === BackupType.local}
            daysDescription={daysDescription}
            onConfigChange={onBackupConfigChange}
          />
        )}
        {backupOption?.key === BackupType.rsync && (
          <BackupConfigureRsync
            backupConfig={backupConfig}
            isCurrentType={backupType === BackupType.rsync}
            daysDescription={daysDescription}
            onConfigChange={onBackupConfigChange}
          />
        )}
        {backupOption?.key === BackupType.s3 && (
          <BackupConfigureS3
            backupConfig={backupConfig}
            isCurrentType={backupType === BackupType.s3}
            daysDescription={daysDescription}
            onConfigChange={onBackupConfigChange}
          />
        )}
        <Stack horizontal>
          <PrimaryButton type="submit" disabled={isUpdatingConfig}>
            Save
          </PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
