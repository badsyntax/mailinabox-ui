import {
  DefaultButton,
  Link,
  mergeStyles,
  Stack,
  Text,
  TooltipHost,
} from '@fluentui/react';
import { useId } from '@uifabric/react-hooks';
import React from 'react';
import { Body } from '../../../ui/Body/Body';
import { BodyBreadcrumb } from '../../../ui/BodyBreadcrumb/BodyBreadcrumb';
import { BodyPanel } from '../../../ui/BodyPanel/BodyPanel';
import { SyncListBrowser } from '../../../ui/SyncListBrowser/SyncListBrowser';
import { SyncListMobile } from '../../../ui/SyncListMobile/SyncListMobile';
import { SyncListMobileSettings } from '../../../ui/SyncListMobile/SyncListMobileSettings';

const columnClassName = mergeStyles({
  flexBasis: 0,
});

export const SyncGuideRoute: React.FunctionComponent & {
  path: string;
} = () => {
  const tooltipId = useId('tooltip');
  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <BodyBreadcrumb
          items={[
            {
              text: 'Contacts & Calendar Synchronization',
              key: 'syncguide',
              as: 'h1',
            },
          ]}
        />
        <TooltipHost
          content="Download instructions in PDF format which you can use to send to users of this box."
          id={tooltipId}
        >
          <DefaultButton iconProps={{ iconName: 'Download' }}>
            Download Sync Guide
          </DefaultButton>
        </TooltipHost>
      </Stack>
      <Stack horizontal gap="l1">
        <Stack gap="m" grow={1} className={columnClassName}>
          <BodyPanel>
            <Text block variant="large">
              In your browser
            </Text>
            <Text block>
              You can edit your contacts and calendar from your web browser.
            </Text>
            <SyncListBrowser />
            <Text>
              Log in settings are the same as with <Link href="#">mail</Link>:
              your complete email address and your mail password.
            </Text>
          </BodyPanel>
        </Stack>
        <Stack grow={1} className={columnClassName}>
          <BodyPanel>
            <Text block variant="large">
              On your mobile device
            </Text>
            <Text>
              If you set up your <Link href="#">mail</Link> using
              Exchange/ActiveSync, your contacts and calendar may already appear
              on your device.
            </Text>
            <Text>
              Otherwise, here are some apps that can synchronize your contacts
              and calendar to your Android phone.
            </Text>
            <SyncListMobile />
            <Text>Use the following settings:</Text>
            <SyncListMobileSettings />
          </BodyPanel>
        </Stack>
      </Stack>
    </Body>
  );
};

SyncGuideRoute.path = '/sync-guide';
