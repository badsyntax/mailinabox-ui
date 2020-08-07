import {
  Checkbox,
  CommandBar,
  Dropdown,
  IStackProps,
  Label,
  mergeStyles,
  PrimaryButton,
  ScreenWidthMinLarge,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Pre } from '../Pre/Pre';

const columnClassName = mergeStyles({
  flexBasis: 0,
});

const text = `$ORIGIN example.com.
$TTL 1800

@ IN SOA ns1.box.example.com. hostmaster.box.example.com. (
           2020062800
           7200
           1800
           1209600
           1800
           )
	IN	NS	ns1.box.example.com.
	IN	NS	ns2.box.example.com.
	IN	A	111.222.333.444
	IN	AAAA	1111:4f8:1c1c:e08a::2
	IN	MX	10 box.example.com.
	IN	TXT	"v=spf1 mx -all"
_dmarc	IN	TXT	"v=DMARC1; p=quarantine"
mail._domainkey	IN	TXT	"v=DKIM1; k=rsa; s=email; p=1234+56789"
_caldavs._tcp	IN	SRV	0 0 443 box.example.com.
_carddavs._tcp	IN	SRV	0 0 443 box.example.com.
autoconfig	IN	A	111.222.333.444
autoconfig	IN	AAAA	1111:2222:1c1c:e08a::1
autodiscover	IN	A	111.222.333.444
autodiscover	IN	AAAA	1111:2222:1c1c:e08a::1
box	IN	A	111.222.333.444
box	IN	AAAA	1111:2222:1c1c:e08a::1
box	IN	SSHFP	3 2 ( 123456789 )
box	IN	SSHFP	4 2 ( 123456789 )
box	IN	SSHFP	1 2 ( 123456789 )
box	IN	MX	10 box.example.com.
box	IN	TXT	"v=spf1 mx -all"
_dmarc.box	IN	TXT	"v=DMARC1; p=quarantine"
mail._domainkey.box	IN	TXT	"v=DKIM1; k=rsa; s=email; p=1234+56789"
_25._tcp.box	IN	TLSA	3 1 1 123456789
_443._tcp.box	IN	TLSA	3 1 1 123456789
autoconfig.box	IN	A	111.222.333.444
autoconfig.box	IN	AAAA	1111:2222:1c1c:e08a::1
autoconfig.box	IN	TXT	"v=spf1 -all"
_dmarc.autoconfig.box	IN	TXT	"v=DMARC1; p=reject"
autodiscover.box	IN	A	111.222.333.444
autodiscover.box	IN	AAAA	1111:2222:1c1c:e08a::1
autodiscover.box	IN	TXT	"v=spf1 -all"
_dmarc.autodiscover.box	IN	TXT	"v=DMARC1; p=reject"
ns1.box	IN	A	111.222.333.444
ns1.box	IN	AAAA	1111:2222:1c1c:e08a::1
ns1.box	IN	TXT	"v=spf1 -all"
_dmarc.ns1.box	IN	TXT	"v=DMARC1; p=reject"
ns2.box	IN	A	111.222.333.444
ns2.box	IN	AAAA	1111:2222:1c1c:e08a::1
ns2.box	IN	TXT	"v=spf1 -all"
_dmarc.ns2.box	IN	TXT	"v=DMARC1; p=reject"
www	IN	A	111.222.333.444
www	IN	AAAA	1111:2222:1c1c:e08a::1
www	IN	TXT	"v=spf1 -all"
_dmarc.www	IN	TXT	"v=DMARC1; p=reject"`;

export const DnsZoneFileGenerator: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });

  return (
    <Stack as="section" gap="l2" horizontal={isMinLargeScreen} {...props}>
      <Stack gap="m" grow={1} className={columnClassName}>
        <Text>Use this tool to generate zone files.</Text>
        <Dropdown
          label="Domain"
          required
          placeholder="Select a domain"
          options={[
            {
              key: 'foo',
              text: 'box.proxima-mail',
            },
          ]}
        />
        <TextField label="SOA Records" required multiline rows={5} />
        <TextField label="Nameservers" required />
        <Stack gap="s2">
          <Label>Generation Options</Label>
          <Checkbox label="Split long TXT entries" checked={false} />
        </Stack>
        <Stack horizontal>
          <PrimaryButton>Generate</PrimaryButton>
        </Stack>
      </Stack>
      <Stack
        gap="m"
        grow={2}
        className={columnClassName}
        style={{ minWidth: 0 }}
      >
        <CommandBar
          styles={{
            root: {
              paddingLeft: 0,
            },
          }}
          items={[
            {
              key: 'copy',
              text: 'Copy',
              iconProps: { iconName: 'Copy' },
            },
            {
              key: 'download',
              text: 'Download',
              iconProps: { iconName: 'Download' },
            },
          ]}
          ariaLabel="Use left and right arrow keys to navigate between commands"
        />
        <Pre>{text}</Pre>
      </Stack>
    </Stack>
  );
};
