import {
  Configuration,
  ConfigurationParameters,
  UserApi,
  SystemApi,
  SslApi,
} from 'mailinabox-api';
import { storageAuth } from '../auth';

// TODO: add middleware for handling token expiry

const apiConfigParams: ConfigurationParameters = {
  basePath: '/admin',
  username: storageAuth.getUsername(),
  password: storageAuth.getPassword(),
};

const apiConfig = new Configuration(apiConfigParams);

export function updateApiConfig(config: ConfigurationParameters): void {
  Object.assign(apiConfigParams, config);
}

export const userApi = new UserApi(apiConfig);
export const systemApi = new SystemApi(apiConfig);
export const sslApi = new SslApi(apiConfig);

export function getRequestFailMessage(response: Response): string {
  const { statusText, status } = response;
  return `Request error: ${statusText}${
    status ? ' (' + status + ')' : ''
  }. Refresh the page to try again.`;
}
