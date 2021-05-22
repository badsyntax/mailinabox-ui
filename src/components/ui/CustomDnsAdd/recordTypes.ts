import { DNSRecordType } from 'mailinabox-api';

type RecordTypes = {
  [key in DNSRecordType]: {
    hint: string;
    text: string;
  };
};

export const recordTypes: RecordTypes = {
  [DNSRecordType.A]: {
    hint: "Enter an IPv4 address (i.e. a dotted quad, such as 123.456.789.012).  The 'local' alias sets the record to this box's public IPv4 address.",
    text: 'A (IPv4 address)',
  },
  [DNSRecordType.AAAA]: {
    hint: "Enter an IPv6 address.  The 'local' alias sets the record to this box's public IPv6 address.",
    text: 'AAAA (IPv6 address)',
  },
  [DNSRecordType.CAA]: {
    hint: 'Enter a CA that can issue certificates for this domain in the form of FLAG TAG VALUE. (0 issuewild &quot;letsencrypt.org&quot;)',
    text: 'CAA (Certificate Authority Authorization)',
  },
  [DNSRecordType.CNAME]: {
    hint: 'Enter another domain name followed by a period at the end (e.g. mypage.github.io.).',
    text: 'CNAME (DNS forwarding)',
  },
  [DNSRecordType.TXT]: {
    hint: 'Enter arbitrary text.',
    text: 'TXT (text record)',
  },
  [DNSRecordType.MX]: {
    hint: 'Enter record in the form of PRIORITY DOMAIN., including trailing period (e.g. 20 mx.example.com.).',
    text: 'MX (mail exchanger)',
  },
  [DNSRecordType.SRV]: {
    hint: 'Enter record in the form of PRIORITY WEIGHT PORT TARGET., including trailing period (e.g. 10 10 5060 sip.example.com.).',
    text: 'SRV (service record)',
  },
  [DNSRecordType.SSHFP]: {
    hint: 'Enter record in the form of ALGORITHM TYPE FINGERPRINT.',
    text: 'SSHFP (SSH fingerprint record)',
  },
  [DNSRecordType.NS]: {
    hint: 'Enter a hostname to which this subdomain should be delegated to.',
    text: 'NS (DNS subdomain delegation)',
  },
};
