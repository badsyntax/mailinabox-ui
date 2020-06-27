import React from 'react';
import {
  Stack,
  MessageBarType,
  Link,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  ConstrainMode,
  IStackProps,
  IColumn,
  Text,
  getTheme,
  DefaultButton,
  PrimaryButton,
} from '@fluentui/react';
import {
  SSLStatusResponseStatus,
  SSLStatusResponseStatusStatusEnum,
} from 'mailinabox-api';
import { MessageBar } from '../MessageBar/MessageBar';

const theme = getTheme();

function getTextColor(status: SSLStatusResponseStatusStatusEnum) {
  switch (status) {
    case SSLStatusResponseStatusStatusEnum.Success:
      return theme.palette.greenDark;
    case SSLStatusResponseStatusStatusEnum.Danger:
      return theme.palette.redDark;
    case SSLStatusResponseStatusStatusEnum.NotApplicable:
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
    onRender: (item: SSLStatusResponseStatus) => {
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
    onRender: (item: SSLStatusResponseStatus) => {
      const textColor = getTextColor(item.status);
      return <Text styles={{ root: { color: textColor } }}>{item.text}</Text>;
    },
  },
  {
    key: 'column3',
    name: 'Actions',
    isMultiline: false,
    minWidth: 140,
    isPadded: false,
    onRender: (item: SSLStatusResponseStatus) => {
      switch (item.status) {
        case SSLStatusResponseStatusStatusEnum.NotApplicable:
          return null;
        case SSLStatusResponseStatusStatusEnum.Success:
          return (
            <DefaultButton
              styles={{
                textContainer: {
                  ...getTheme().fonts.small,
                },
              }}
            >
              Replace Certificate
            </DefaultButton>
          );
        default:
          return (
            <PrimaryButton
              styles={{
                textContainer: {
                  ...getTheme().fonts.small,
                },
              }}
            >
              Install Certificate
            </PrimaryButton>
          );
      }
    },
  },
];

export const CertificatesList: React.FunctionComponent<
  IStackProps & {
    items: Array<SSLStatusResponseStatus>;
  }
> = ({ items, ...props }) => {
  return (
    <Stack as="section" {...props}>
      <MessageBar messageBarType={MessageBarType.info} isMultiline>
        Certificates expire after a period of time. All certificates will be
        automatically renewed through
        <Link href="https://letsencrypt.org/">Let&rsquo;s Encrypt</Link> 14 days
        prior to expiration.
      </MessageBar>
      <DetailsList
        items={items}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible
        onShouldVirtualize={() => false}
        selectionMode={SelectionMode.none}
        constrainMode={ConstrainMode.horizontalConstrained}
      />
    </Stack>
  );
};
