import {
  DefaultButton,
  ScreenWidthMinXLarge,
  Stack,
  TooltipHost,
} from '@fluentui/react';
import { useId } from '@uifabric/react-hooks';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Body } from '../../../ui/Body/Body';
import { BodyBreadcrumb } from '../../../ui/BodyBreadcrumb/BodyBreadcrumb';
import { SyncGuide } from '../../../ui/SyncGuide/SyncGuide';

export const SyncGuideRoute: React.FunctionComponent & {
  path: string;
} = () => {
  const tooltipId = useId('tooltip');
  const isMinXLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinXLarge,
  });
  return (
    <Body>
      <Stack
        horizontal={isMinXLargeScreen}
        horizontalAlign="space-between"
        verticalAlign="center"
      >
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
      <SyncGuide />
    </Body>
  );
};

SyncGuideRoute.path = '/sync-guide';
