import {
  Breadcrumb,
  getTheme,
  Link,
  mergeStyles,
  Pivot,
  PivotItem,
  PivotLinkSize,
  Stack,
  Text,
} from '@fluentui/react';
import React from 'react';
import { Body } from '../../../ui/Body/Body';
import { BodyPanel } from '../../../ui/BodyPanel/BodyPanel';
import { MessageBar } from '../../../ui/MessageBar/MessageBar';
import { WebDomainsList } from '../../../ui/WebDomainsList/WebDomainsList';

const theme = getTheme();

const className = mergeStyles({
  marginTop: theme.spacing.m,
});

export const Web: React.FunctionComponent & {
  path: string;
} = () => {
  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Breadcrumb
          styles={{
            root: {
              marginTop: 0,
            },
          }}
          items={[
            {
              text: 'Static Web Hosting',
              key: 'web',
            },
          ]}
        />
      </Stack>
      <BodyPanel>
        <Text>
          This machine is serving a simple, static website at{' '}
          <Link href="#">https://box.proxima-mail.com</Link> and at all domain
          names that you set up an email user or alias for.
        </Text>
      </BodyPanel>
      <BodyPanel>
        <Pivot linkSize={PivotLinkSize.large}>
          <PivotItem headerText="Domains">
            <WebDomainsList className={className} />
          </PivotItem>
          <PivotItem headerText="Uploading web files">
            <Stack gap="m" className={className}>
              <MessageBar>
                You can replace the default website with your own HTML pages and
                other static files. This control panel won’t help you design a
                website, but once you have <code>.html</code> files you can
                upload them following these instructions:
              </MessageBar>
              <Text as="ol">
                <li>
                  Ensure that any domains you are publishing a website for have
                  no problems on the{' '}
                  <Link href="#system_status">Status Checks</Link> page.
                </li>
                <li>
                  On your personal computer, install an SSH file transfer
                  program such as{' '}
                  <Link href="https://filezilla-project.org/">FileZilla</Link>{' '}
                  or{' '}
                  <Link href="http://linuxcommand.org/man_pages/scp1.html">
                    scp
                  </Link>
                  .
                </li>
                <li>
                  Log in to this machine with the file transfer program. The
                  server is <strong>box.proxima-mail.com</strong>, the protocol
                  is SSH or SFTP, and use the{' '}
                  <strong>SSH login credentials</strong> that you used when you
                  originally created this machine at your cloud host provider.
                  This is <strong>not</strong> what you use to log in either for
                  email or this control panel. Your SSH credentials probably
                  involves a private key file.
                </li>
                <li>
                  Upload your <code>.html</code> or other files to the directory{' '}
                  <code>/home/user-data/www/default</code> on this machine. They
                  will appear directly and immediately on the web.
                </li>
                <li>
                  The websites set up on this machine are listed in the{' '}
                  <Link href="#">Domains List</Link> with where to put the files
                  for each website.
                </li>
              </Text>
            </Stack>
          </PivotItem>
        </Pivot>
      </BodyPanel>
    </Body>
  );
};

Web.path = '/web';
