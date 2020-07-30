import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  DetailsRow,
  getTheme,
  IColumn,
  IDetailsRowProps,
  IDetailsRowStyles,
  IStackProps,
  mergeStyles,
  MessageBarType,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { SystemBackupStatus, SystemBackupStatusResponse } from 'mailinabox-api';
import React from 'react';
import { MessageBar } from '../MessageBar/MessageBar';

const theme = getTheme();

function niceSize(bytes: number): string {
  const powers = ['bytes', 'KB', 'MB', 'GB', 'TB'];
  while (true) {
    if (powers.length === 1) {
      break;
    }
    if (bytes < 1000) {
      break;
    }
    bytes /= 1024;
    powers.shift();
  }
  // round to have three significant figures but at most one decimal place
  if (bytes >= 100) {
    bytes = Math.round(bytes);
  } else {
    bytes = Math.round(bytes * 10) / 10;
  }
  return bytes + ' ' + powers[0];
}

function getTotalBackupsSize(
  items: Array<SystemBackupStatus>,
  unmatchedFileSize: number
): string {
  const totalSize =
    items.reduce((total, item) => total + item.size, 0) + unmatchedFileSize;
  return niceSize(totalSize);
}

const strongCellClassName = mergeStyles({
  fontWeight: 'bold',
});

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'When',
    minWidth: 100,
    maxWidth: 180,
    isMultiline: false,
    isRowHeader: true,
    onRender: (item: SystemBackupStatus): React.ReactNode => {
      return (
        <Text className={item.full ? strongCellClassName : undefined}>
          {item.dateStr}
        </Text>
      );
    },
  },
  {
    key: 'column2',
    name: '',
    minWidth: 100,
    isMultiline: false,
    isRowHeader: true,
    onRender: (item: SystemBackupStatus): React.ReactNode => {
      return (
        <Text className={item.full ? strongCellClassName : undefined}>
          {item.dateDelta} ago
        </Text>
      );
    },
  },
  {
    key: 'column3',
    name: 'Type',
    isMultiline: false,
    minWidth: 100,
    fieldName: 'text',
    onRender: (item: SystemBackupStatus): React.ReactNode => {
      return (
        <Text className={item.full ? strongCellClassName : undefined}>
          {item.full ? 'full' : 'increment'}
        </Text>
      );
    },
  },
  {
    key: 'column4',
    name: 'Size',
    isMultiline: false,
    minWidth: 100,
    onRender: (item: SystemBackupStatus): React.ReactNode => {
      return (
        <Text className={item.full ? strongCellClassName : undefined}>
          {niceSize(item.size)}
        </Text>
      );
    },
  },
  {
    key: 'column5',
    name: 'Deleted In',
    isMultiline: false,
    minWidth: 160,
    onRender: (item: SystemBackupStatus): React.ReactNode => {
      return (
        <Text className={item.full ? strongCellClassName : undefined}>
          {item.deletedIn ?? 'unknown'}
        </Text>
      );
    },
  },
];

export const BackupsList: React.FunctionComponent<
  IStackProps & SystemBackupStatusResponse
> = ({ backups = [], unmatchedFileSize, ...props }) => {
  return (
    <Stack as="section" {...props}>
      {!backups.length && (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline>
          No backups have been made yet.
        </MessageBar>
      )}
      {backups.length && (
        <>
          <MessageBar messageBarType={MessageBarType.info} isMultiline>
            The backup location currently contains the backups listed below. The
            total size of the backups is currently{' '}
            {getTotalBackupsSize(backups, unmatchedFileSize)}.
          </MessageBar>
          <DetailsList
            items={backups}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible
            onShouldVirtualize={(): boolean => false}
            selectionMode={SelectionMode.none}
            constrainMode={ConstrainMode.horizontalConstrained}
            onRenderRow={(props?: IDetailsRowProps): JSX.Element | null => {
              const customStyles: Partial<IDetailsRowStyles> = {};
              if (props) {
                if (props.itemIndex % 2 === 0) {
                  // Every other row renders with a different background color
                  customStyles.root = {
                    backgroundColor: theme.palette.themeLighterAlt,
                  };
                }

                return (
                  <DetailsRow
                    {...props}
                    styles={customStyles}
                    enableUpdateAnimations={false}
                  />
                );
              }
              return null;
            }}
          />
        </>
      )}
    </Stack>
  );
};
