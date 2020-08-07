import {
  Link,
  mergeStyles,
  ScreenWidthMinXLarge,
  Stack,
  Text,
} from '@fluentui/react';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { BodyPanel } from '../BodyPanel/BodyPanel';
import { SyncListBrowser } from '../SyncListBrowser/SyncListBrowser';
import { SyncListMobile } from '../SyncListMobile/SyncListMobile';
import { SyncListMobileSettings } from '../SyncListMobile/SyncListMobileSettings';

const columnClassName = mergeStyles({
  flexBasis: 0,
  minWidth: 0,
});

export const SyncGuide: React.FunctionComponent = () => {
  const isMinXLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinXLarge,
  });
  return (
    <Stack horizontal={isMinXLargeScreen} gap="l1">
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
            Otherwise, here are some apps that can synchronize your contacts and
            calendar to your Android phone.
          </Text>
          <SyncListMobile />
          <Text>Use the following settings:</Text>
          <SyncListMobileSettings />
        </BodyPanel>
      </Stack>
    </Stack>
  );
};
