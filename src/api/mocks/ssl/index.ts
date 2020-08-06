/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Mocks } from '../types';
import generateSSLCSR from './data/generateSSLCSR.json';
import getSSLStatus from './data/getSSLStatus.json';
import installSSLCertificate from './data/installSSLCertificate.json';
import provisionSSLCertificates from './data/provisionSSLCertificates.json';

export const ssl: Mocks = {
  '/admin/ssl/status': {
    get: getSSLStatus.response,
  },
  'express:/admin/ssl/csr/:domain': {
    post: generateSSLCSR.response,
  },
  '/admin/ssl/install': {
    post: installSSLCertificate.response,
  },
  '/admin/ssl/provision': {
    post: provisionSSLCertificates.response,
  },
};
