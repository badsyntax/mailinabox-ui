import { Link, ScreenWidthMinLarge, Stack, Text } from '@fluentui/react';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { config } from '../../../config';
import { MessageBar } from '../MessageBar/MessageBar';

export const WebInstructions: React.FunctionComponent = () => {
  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });
  return (
    <Stack gap="m">
      <MessageBar isMultiline={isMinLargeScreen} truncated={!isMinLargeScreen}>
        You can replace the default website with your own HTML pages and other
        static files. This control panel won’t help you design a website, but
        once you have <code>.html</code> files you can upload them following
        these instructions:
      </MessageBar>
      <Text as="ol">
        <li>
          Ensure that any domains you are publishing a website for have no
          problems on the <Link href="#system_status">Status Checks</Link> page.
        </li>
        <li>
          On your personal computer, install an SSH file transfer program such
          as <Link href="https://filezilla-project.org/">FileZilla</Link> or{' '}
          <Link href="http://linuxcommand.org/man_pages/scp1.html">scp</Link>.
        </li>
        <li>
          Log in to this machine with the file transfer program. The server is{' '}
          <strong>{config.hostname}</strong>, the protocol is SSH or SFTP, and
          use the <strong>SSH login credentials</strong> that you used when you
          originally created this machine at your cloud host provider. This is{' '}
          <strong>not</strong> what you use to log in either for email or this
          control panel. Your SSH credentials probably involves a private key
          file.
        </li>
        <li>
          Upload your <code>.html</code> or other files to the directory{' '}
          <code>/home/user-data/www/default</code> on this machine. They will
          appear directly and immediately on the web.
        </li>
        <li>
          The websites set up on this machine are listed in the{' '}
          <Link href="#">Domains List</Link> with where to put the files for
          each website.
        </li>
      </Text>
    </Stack>
  );
};
