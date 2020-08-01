import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  DetailsRow,
  getTheme,
  IColumn,
  IDetailsRowProps,
  IStackProps,
  Link,
  mergeStyles,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { SSLStatus, SSLStatusType } from 'mailinabox-api';
import React from 'react';
import { MessageBar } from '../MessageBar/MessageBar';
import { CertificateActionsList } from './CertificateActionsList';

const theme = getTheme();

function getTextColor(status: SSLStatusType): string {
  switch (status) {
    case SSLStatusType.Success:
      return theme.palette.greenDark;
    case SSLStatusType.Danger:
      return theme.palette.redDark;
    case SSLStatusType.NotApplicable:
    default:
      return theme.semanticColors.bodyText;
  }
}

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Domain',
    minWidth: 100,
    maxWidth: 300,
    isMultiline: false,
    isRowHeader: true,
    isResizable: true,
    fieldName: 'domain',
    onRender: (item: SSLStatus): React.ReactElement => {
      return <Link href={`https://${item.domain}`}>{item.domain}</Link>;
    },
  },
  {
    key: 'column2',
    name: 'Certificate Status',
    isMultiline: true,
    isRowHeader: true,
    minWidth: 300,
    fieldName: 'text',
    onRender: (item: SSLStatus): React.ReactNode => {
      const textColor = getTextColor(item.status);
      return <Text styles={{ root: { color: textColor } }}>{item.text}</Text>;
    },
  },
  {
    key: 'column3',
    name: 'Actions',
    isMultiline: false,
    minWidth: 50,
    onRender: (sslStatus: SSLStatus): React.ReactNode => {
      return sslStatus.status === SSLStatusType.NotApplicable ? null : (
        <CertificateActionsList sslStatus={sslStatus} />
      );
    },
    className: mergeStyles({
      displayName: 'DetailsRow-actions-cell',
    }),
  },
];

export const CertificatesList: React.FunctionComponent<
  IStackProps & {
    items: Array<SSLStatus>;
  }
> = ({ items, ...props }) => {
  return (
    <Stack as="section" {...props}>
      <MessageBar>
        Certificates expire after a period of time. All certificates will be
        automatically renewed through
        <Link href="https://letsencrypt.org/">Let's Encrypt</Link> 14 days prior
        to expiration.
      </MessageBar>
      <DetailsList
        items={items}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible
        selectionMode={SelectionMode.none}
        constrainMode={ConstrainMode.horizontalConstrained}
        useReducedRowRenderer
        onRenderRow={(props?: IDetailsRowProps): JSX.Element | null => {
          if (props) {
            return (
              <DetailsRow
                {...props}
                styles={{
                  root: {
                    animation: 'none',
                  },
                }}
              />
            );
          }
          return null;
        }}
      />
    </Stack>
  );
};
