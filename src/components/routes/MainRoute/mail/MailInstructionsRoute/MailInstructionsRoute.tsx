import { DefaultButton, Stack, TooltipHost } from '@fluentui/react';
import { useId } from '@uifabric/react-hooks';
import { ScreenWidthMinMedium } from 'office-ui-fabric-react/lib/Styling';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Body } from '../../../../ui/Body/Body';
import { BodyBreadcrumb } from '../../../../ui/BodyBreadcrumb/BodyBreadcrumb';
import { MailInstructions } from '../../../../ui/MailInstructions/MailInstructions';

export const MailInstructionsRoute: React.FunctionComponent & {
  path: string;
} = () => {
  const isMinMediumScreen = useMediaQuery({
    minWidth: ScreenWidthMinMedium,
  });
  const tooltipId = useId('tooltip');
  return (
    <Body>
      <Stack
        horizontal={isMinMediumScreen}
        horizontalAlign="space-between"
        verticalAlign="center"
      >
        <BodyBreadcrumb
          items={[
            {
              text: 'Mail',
              key: 'mail',
            },
            {
              text: 'Checking and Sending Mail',
              key: 'checkingmail',
              as: 'h1',
            },
          ]}
        />
        <TooltipHost
          content="Download instructions in PDF format which you can use to send to users of this box."
          id={tooltipId}
        >
          <DefaultButton iconProps={{ iconName: 'Download' }}>
            Download Instructions
          </DefaultButton>
        </TooltipHost>
      </Stack>
      <MailInstructions />
    </Body>
  );
};

MailInstructionsRoute.path = '/mail/instructions';
