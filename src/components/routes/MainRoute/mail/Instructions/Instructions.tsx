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
import { Body } from '../../../../Body/Body';
import { BodyPanel } from '../../../../BodyPanel/BodyPanel';

const columnClassName = mergeStyles({
  flexBasis: 0,
});

export const Instructions: React.FunctionComponent & {
  path: string;
} = () => {
  const tooltipId = useId('tooltip');
  return (
    <Body>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text as="h1" block variant="xLarge">
          Checking and Sending Mail
        </Text>
        <TooltipHost
          content="Download instructions in PDF format which you can use to send to users of this box."
          id={tooltipId}
        >
          <DefaultButton iconProps={{ iconName: 'Download' }}>
            Download Instructions
          </DefaultButton>
        </TooltipHost>
      </Stack>
      <Stack horizontal gap="l1">
        <Stack gap="m" grow={4} className={columnClassName}>
          <BodyPanel>
            <Text variant="large">Webmail</Text>
            <Text>
              Webmail lets you check your email from any web browser. Your
              webmail site is:
            </Text>
            <Text>
              <Link href="https://box.proxima-mail.com/mail">
                https://box.proxima-mail.com/mail
              </Link>
            </Text>
            <Text>Your username is your whole email address.</Text>
            <Text variant="large">Mobile/desktop apps</Text>
            <Text variant="mediumPlus">Automatic configuration</Text>
            <Text>
              iOS and OS X only: Open{' '}
              <Link href="https://box.proxima-mail.com/mailinabox.mobileconfig">
                this configuration link
              </Link>{' '}
              on your iOS device or on your Mac desktop to easily set up mail
              (IMAP/SMTP), Contacts, and Calendar. Your username is your whole
              email address.
            </Text>
            <Text variant="mediumPlus">Manual configuration</Text>
            <Text>
              Use the following settings when you set up your email on your
              phone, desktop, or other device:
            </Text>
            <table>
              <thead>
                <tr>
                  <th>
                    <Text>Option</Text>
                  </th>{' '}
                  <th>
                    <Text>Value</Text>
                  </th>
                </tr>
              </thead>
              <tr>
                <th>
                  <Text>Protocol/Method</Text>
                </th>{' '}
                <td>IMAP</td>
              </tr>
              <tr>
                <th>
                  <Text>Mail server</Text>
                </th>{' '}
                <td>box.proxima-mail.com</td>
              </tr>
              <tr>
                <th>
                  <Text>IMAP Port</Text>
                </th>{' '}
                <td>993</td>
              </tr>
              <tr>
                <th>
                  <Text>IMAP Security</Text>
                </th>{' '}
                <td>SSL or TLS</td>
              </tr>
              <tr>
                <th>
                  <Text>SMTP Port</Text>
                </th>{' '}
                <td>587</td>
              </tr>
              <tr>
                <th>
                  <Text>SMTP Security</Text>
                </th>{' '}
                <td>
                  STARTTLS{' '}
                  <small>
                    (&ldquo;always&rdquo; or &ldquo;required&rdquo;, if
                    prompted)
                  </small>
                </td>
              </tr>
              <tr>
                <th>
                  <Text>Username:</Text>
                </th>{' '}
                <td>Your whole email address.</td>
              </tr>
              <tr>
                <th>
                  <Text>Password:</Text>
                </th>{' '}
                <td>Your mail password.</td>
              </tr>
            </table>

            <Text>
              In addition to setting up your email, you&rsquo;ll also need to
              set up <Link>contacts and calendar synchronization</Link>{' '}
              separately.
            </Text>

            <Text block>
              As an alternative to IMAP you can also use the POP protocol:
              choose POP as the protocol, port 995, and SSL or TLS security in
              your mail client. The SMTP settings and usernames and passwords
              remain the same. However, we recommend you use IMAP instead.
            </Text>

            <Text variant="mediumPlus">Exchange/ActiveSync settings</Text>

            <Text block>
              On iOS devices, devices on this{' '}
              <Link href="https://wiki.z-hub.io/display/ZP/Compatibility">
                compatibility list
              </Link>
              , or using Outlook 2007 or later on Windows 7 and later, you may
              set up your mail as an Exchange or ActiveSync server. However,
              we&rsquo;ve found this to be more buggy than using IMAP as
              described above. If you encounter any problems, please use the
              manual settings above.
            </Text>
            <table>
              <tr>
                <th>
                  <Text>Server</Text>
                </th>
                <td>
                  <Text>box.proxima-mail.com</Text>
                </td>
              </tr>
              <tr>
                <th>
                  <Text>Options</Text>
                </th>{' '}
                <td>
                  <Text>Secure Connection</Text>
                </td>
              </tr>
            </table>
            <Text>
              Your device should also provide a contacts list and calendar that
              syncs to this box when you use this method.
            </Text>
          </BodyPanel>
        </Stack>
        <Stack grow={3} className={columnClassName}>
          <BodyPanel>
            <Text variant="large">
              Other information about mail on your box
            </Text>
            <Text variant="mediumPlus">Automatic configuration</Text>
            <Text>
              Your box uses a technique called greylisting to cut down on spam.
              Greylisting works by initially rejecting mail from people you
              haven’t received mail from before. Legitimate mail servers will
              attempt redelivery shortly afterwards, but the vast majority of
              spam gets tricked by this. If you are waiting for an email from
              someone new, such as if you are registering on a new website and
              are waiting for an email confirmation, please be aware there will
              be a minimum of 3 minutes delay, depending how soon the remote
              server attempts redelivery.
            </Text>
            <Text variant="mediumPlus">+tag addresses</Text>
            <Text>
              Every incoming email address also receives mail for{' '}
              <code>+tag</code> addresses. If your email address is{' '}
              <code>you@yourdomain.com</code>, you&rsquo;ll also automatically
              get mail sent to <code>you+anythinghere@yourdomain.com</code>. Use
              this as a fast way to segment incoming mail for your own filtering
              rules without having to create aliases in this control panel.
            </Text>
            <Text variant="mediumPlus">Use only this box to send as you</Text>
            <Text>
              Your box sets strict email sending policies for your domain names
              to make it harder for spam and other fraudulent mail to claim to
              be you. Only this machine is authorized to send email on behalf of
              your domain names. If you use any other service to send email as
              you, it will likely get spam filtered by recipients.
            </Text>
          </BodyPanel>
        </Stack>
      </Stack>
    </Body>
  );
};

Instructions.path = '/mail/instructions';
