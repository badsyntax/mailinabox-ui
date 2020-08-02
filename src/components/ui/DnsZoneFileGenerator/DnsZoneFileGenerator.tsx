import {
  Checkbox,
  CommandBar,
  Dropdown,
  IStackProps,
  Label,
  mergeStyles,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import React from 'react';
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
	IN	A	116.203.113.82
	IN	AAAA	2a01:4f8:1c1c:e08a::2
	IN	MX	10 box.example.com.
	IN	TXT	"v=spf1 mx -all"
_dmarc	IN	TXT	"v=DMARC1; p=quarantine"
mail._domainkey	IN	TXT	"v=DKIM1; k=rsa; s=email; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMw2+7dZ3Iqukz2cuSBmtD3cizDYXEqGF3iJgPS82sHI+MxY6AikD0VidG3d/NU8MQo338KwQVloGG5yboREczs7eL+J6n+oJT8Mz01NNpUONcpuM/FlhgpmEUuBBvN/gA5xDVZ6CttCSnM2SaF/Lsba+o9YxSzUflx8JyQOUGvwIDAQAB"
_caldavs._tcp	IN	SRV	0 0 443 box.example.com.
_carddavs._tcp	IN	SRV	0 0 443 box.example.com.
autoconfig	IN	A	116.203.113.82
autoconfig	IN	AAAA	2a01:4f8:1c1c:e08a::1
autodiscover	IN	A	116.203.113.82
autodiscover	IN	AAAA	2a01:4f8:1c1c:e08a::1
box	IN	A	116.203.113.82
box	IN	AAAA	2a01:4f8:1c1c:e08a::1
box	IN	SSHFP	3 2 ( 4FB486A3269CB99075C486BF64591321A600213411EC948A25A32171331111C8 )
box	IN	SSHFP	4 2 ( D4FC3CFD95D0C3CD152D31F41B544024B0FC81D6AC23FA16B2142FC3D40247F6 )
box	IN	SSHFP	1 2 ( B0C57D5CAB76684F937745FD8D6E02FC4731C05D354DF6FFB15E6FA203C4F261 )
box	IN	MX	10 box.example.com.
box	IN	TXT	"v=spf1 mx -all"
_dmarc.box	IN	TXT	"v=DMARC1; p=quarantine"
mail._domainkey.box	IN	TXT	"v=DKIM1; k=rsa; s=email; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMw2+7dZ3Iqukz2cuSBmtD3cizDYXEqGF3iJgPS82sHI+MxY6AikD0VidG3d/NU8MQo338KwQVloGG5yboREczs7eL+J6n+oJT8Mz01NNpUONcpuM/FlhgpmEUuBBvN/gA5xDVZ6CttCSnM2SaF/Lsba+o9YxSzUflx8JyQOUGvwIDAQAB"
_25._tcp.box	IN	TLSA	3 1 1 5e92b2f8150bf467449a0e41f2d03db1dccfaddb076342404176b446ff5b30bb
_443._tcp.box	IN	TLSA	3 1 1 5e92b2f8150bf467449a0e41f2d03db1dccfaddb076342404176b446ff5b30bb
autoconfig.box	IN	A	116.203.113.82
autoconfig.box	IN	AAAA	2a01:4f8:1c1c:e08a::1
autoconfig.box	IN	TXT	"v=spf1 -all"
_dmarc.autoconfig.box	IN	TXT	"v=DMARC1; p=reject"
autodiscover.box	IN	A	116.203.113.82
autodiscover.box	IN	AAAA	2a01:4f8:1c1c:e08a::1
autodiscover.box	IN	TXT	"v=spf1 -all"
_dmarc.autodiscover.box	IN	TXT	"v=DMARC1; p=reject"
ns1.box	IN	A	116.203.113.82
ns1.box	IN	AAAA	2a01:4f8:1c1c:e08a::1
ns1.box	IN	TXT	"v=spf1 -all"
_dmarc.ns1.box	IN	TXT	"v=DMARC1; p=reject"
ns2.box	IN	A	116.203.113.82
ns2.box	IN	AAAA	2a01:4f8:1c1c:e08a::1
ns2.box	IN	TXT	"v=spf1 -all"
_dmarc.ns2.box	IN	TXT	"v=DMARC1; p=reject"
www	IN	A	116.203.113.82
www	IN	AAAA	2a01:4f8:1c1c:e08a::1
www	IN	TXT	"v=spf1 -all"
_dmarc.www	IN	TXT	"v=DMARC1; p=reject"`;

export const DnsZoneFileGenerator: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  return (
    <Stack as="section" gap="l2" horizontal {...props}>
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
