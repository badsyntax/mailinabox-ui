/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Mocks } from '../types';
import getMe from './data/getMe.json';

export const user: Mocks = {
  'admin/me': {
    get: getMe.response,
  },
};
