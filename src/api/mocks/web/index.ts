/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Mocks } from '../types';
import getWebDomains from './data/getWebDomains.json';
import updateWeb from './data/updateWeb.json';

export const web: Mocks = {
  'admin/web/domains': {
    get: getWebDomains.response,
  },
  'admin/web/update': {
    post: updateWeb.response,
  },
};
