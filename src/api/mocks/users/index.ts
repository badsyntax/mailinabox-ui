/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MockRequest, MockResponse } from 'fetch-mock';
import { MailUserPrivilege, MailUserStatus } from 'mailinabox-api';
import { Mocks } from '../types';
import addMailAlias from './data/addMailAlias.json';
import addMailUser from './data/addMailUser.json';
import addMailUserPrivilege from './data/addMailUserPrivilege.json';
import getMailAliases from './data/getMailAliases.json';
import getMailDomains from './data/getMailDomains.json';
import getMailUserPrivileges from './data/getMailUserPrivileges.json';
import getMailUsers from './data/getMailUsers.json';
import removeMailAlias from './data/removeMailAlias.json';
import removeMailUser from './data/removeMailUser.json';
import removeMailUserPrivilege from './data/removeMailUserPrivilege.json';
import setMailUserPassword from './data/setMailUserPassword.json';
import updateMailAlias from './data/updateMailAlias.json';

export const users: Mocks = {
  'admin/mail/users?format=json': {
    get: getMailUsers.response,
  },
  'admin/mail/users/add': {
    post: (_url: string, opts: MockRequest): MockResponse => {
      const email = (opts.body as URLSearchParams).get('email') as string;
      const privileges = (opts.body as URLSearchParams).get(
        'privileges'
      ) as string;
      const privilegesList =
        privileges === MailUserPrivilege.Empty ? [] : [privileges];
      const domain = email.split('@').pop() as string;
      getMailUsers.response.push({
        domain,
        users: [
          {
            email,
            privileges: privilegesList,
            status: MailUserStatus.Active,
          },
        ],
      });
      return addMailUser.response;
    },
  },
  'admin/mail/users/remove': {
    post: (_url: string, opts: MockRequest): MockResponse => {
      const email = (opts.body as URLSearchParams).get('email') as string;
      const userDomain = email.split('@').pop() as string;
      const domainObject = getMailUsers.response.find((domain) => {
        return domain.domain === userDomain;
      });
      const userIndex = domainObject!.users.findIndex(
        (user) => user.email === email
      );
      domainObject!.users.splice(userIndex, 1);
      if (!domainObject!.users.length) {
        const domainIndex = getMailUsers.response.indexOf(domainObject!);
        getMailUsers.response.splice(domainIndex, 1);
      }
      return removeMailUser.response;
    },
  },
  'admin/mail/users/privileges/remove': {
    post: (_url: string, opts: MockRequest): MockResponse => {
      const email = (opts.body as URLSearchParams).get('email') as string;
      const privilege = (opts.body as URLSearchParams).get(
        'privilege'
      ) as MailUserPrivilege;
      const userDomain = email.split('@').pop() as string;
      const domainObject = getMailUsers.response.find((domain) => {
        return domain.domain === userDomain;
      });
      const user = domainObject!.users.find((user) => user.email === email);
      const index = (user!.privileges as MailUserPrivilege[]).indexOf(
        privilege
      );
      user!.privileges.splice(index, 1);
      return removeMailUserPrivilege.response;
    },
  },
  'admin/mail/users/privileges/add': {
    post: (_url: string, opts: MockRequest): MockResponse => {
      const email = (opts.body as URLSearchParams).get('email') as string;
      const privilege = (opts.body as URLSearchParams).get(
        'privilege'
      ) as MailUserPrivilege;
      const userDomain = email.split('@').pop() as string;
      const domainObject = getMailUsers.response.find((domain) => {
        return domain.domain === userDomain;
      });
      const user = domainObject!.users.find((user) => user.email === email);
      (user!.privileges as MailUserPrivilege[]).push(privilege);
      return addMailUserPrivilege.response;
    },
  },
  'admin/mail/users/password': {
    post: setMailUserPassword.response,
  },
  'admin/mail/users/privileges': {
    get: getMailUserPrivileges.response,
  },
  'admin/mail/domains': {
    get: getMailDomains.response,
  },
  'admin/mail/aliases?format=json': {
    get: getMailAliases.response,
  },
  'admin/mail/aliases/add': {
    post: (_url: string, opts: MockRequest): MockResponse => {
      const address = (opts.body as URLSearchParams).get('address') as string;
      const updateIfExists = Number(
        (opts.body as URLSearchParams).get('update_if_exists')
      );
      const forwardsTo = (opts.body as URLSearchParams).get(
        'forwards_to'
      ) as string;
      const permittedSenders = (opts.body as URLSearchParams).get(
        'permitted_senders'
      ) as string;
      const aliasDomain = address.split('@').pop() as string;
      let domainObject = getMailAliases.response.find((domain) => {
        return domain.domain === aliasDomain;
      });
      const forwardToList =
        forwardsTo.indexOf(',') > -1
          ? forwardsTo.split(',')
          : forwardsTo.split('\n');
      const permittedSendersList =
        permittedSenders.indexOf(',') > -1
          ? permittedSenders.split(',')
          : permittedSenders.split('\n');
      if (updateIfExists) {
        const alias = domainObject!.aliases.find(
          (alias) => alias.address === address
        );
        alias!.address = address;
        alias!.address_display = address;
        alias!.forwards_to = forwardToList;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        alias!.permitted_senders = permittedSendersList;
        return updateMailAlias.response;
      } else {
        if (!domainObject) {
          domainObject = { domain: aliasDomain, aliases: [] };
          getMailAliases.response.push(domainObject);
        }
        domainObject!.aliases.push({
          address,
          address_display: address,
          forwards_to: forwardToList,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          permitted_senders: permittedSendersList,
          required: true,
        });
        return addMailAlias.response;
      }
    },
  },
  'admin/mail/aliases/remove': {
    post: (_url: string, opts: MockRequest): MockResponse => {
      const address = (opts.body as URLSearchParams).get('address') as string;
      const userDomain = address.split('@').pop() as string;
      const domainObject = getMailAliases.response.find((domain) => {
        return domain.domain === userDomain;
      });
      const aliasIndex = domainObject!.aliases.findIndex(
        (alias) => alias.address === address
      );
      domainObject!.aliases.splice(aliasIndex, 1);
      if (!domainObject!.aliases.length) {
        const domainIndex = getMailAliases.response.indexOf(domainObject!);
        getMailAliases.response.splice(domainIndex, 1);
      }
      return removeMailAlias.response;
    },
  },
};
