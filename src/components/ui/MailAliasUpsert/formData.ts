export enum AliasType {
  regular = 'REGULAR',
  catchAll = 'CATCH_ALL',
  domainAlias = 'DOMAIN_ALIAS',
}

export enum SenderType {
  any = 'ANY',
  manual = 'MANUAL',
}

interface FormData {
  [key: string]: {
    info?: string;
    text: string;
    alias: {
      placeholder: string;
      info: string;
    };
    forwardsTo: {
      placeholder: string;
      info?: string;
    };
    permittedSenders: {
      any: string;
      manual: string;
      placeholder: string;
      info: string;
    };
  };
}

export const formData: FormData = {
  [AliasType.regular]: {
    text: 'Regular',
    alias: {
      placeholder: 'you@yourdomain.com (incoming email address)',
      info:
        'You may use international (non-ASCII) characters for the domain part of the email address only.',
    },
    forwardsTo: {
      placeholder: 'you@yourdomain.com (forward to email address)',
      info: 'One address per line or separated by commas.',
    },
    permittedSenders: {
      placeholder: 'you@yourdomain.com',
      info: 'One address per line or separated by commas.',
      any:
        'Any mail user listed in the Forwards To box can send mail claiming to be from the alias address.',
      manual:
        'I’ll enter the mail users that can send mail claiming to be from the alias address.',
    },
  },
  [AliasType.catchAll]: {
    text: 'Catch-All',
    info:
      'A catch-all alias captures all otherwise unmatched email to a domain.',
    alias: {
      placeholder: '@yourdomain.com (incoming catch-all domain)',
      info:
        'Enter just the part of an email address starting with the @-sign. You may use international (non-ASCII) characters for the domain part of the email address only.',
    },
    forwardsTo: {
      placeholder: 'you@yourdomain.com (forward to email address)',
      info: 'One address per line or separated by commas.',
    },
    permittedSenders: {
      placeholder: 'you@yourdomain.com',
      info: 'One address per line or separated by commas.',
      any:
        'Any mail user listed in the Forwards To box can send mail claiming to be from any address on the alias domain.',
      manual:
        'I’ll enter the mail users that can send mail claiming to be from any address on the alias domain.',
    },
  },
  [AliasType.domainAlias]: {
    text: 'Domain Alias',
    info:
      'A domain alias forwards all otherwise unmatched email from one domain to another domain, preserving the part before the @-sign.',
    alias: {
      placeholder: '@yourdomain.com (incoming catch-all domain)',
      info:
        'Enter just the part of an email address starting with the @-sign. You may use international (non-ASCII) characters for the domain part of the email address only.',
    },
    forwardsTo: {
      placeholder: '@otherdomain.com (forward to other domain)',
      info: 'Enter just the part of an email address starting with the @-sign.',
    },
    permittedSenders: {
      placeholder: 'you@yourdomain.com',
      info: 'One address per line or separated by commas.',
      any:
        'Any mail user listed in the Forwards To box can send mail claiming to be from any address on the alias domain.',
      manual:
        'I’ll enter the mail users that can send mail claiming to be from any address on the alias domain.',
    },
  },
};
