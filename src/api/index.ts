import {
  AliasesApi,
  Configuration,
  ConfigurationParameters,
  DnsApi,
  SslApi,
  SystemApi,
  UserApi,
  UsersApi,
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

export const aliasesApi = new AliasesApi(apiConfig);
export const userApi = new UserApi(apiConfig);
export const systemApi = new SystemApi(apiConfig);
export const sslApi = new SslApi(apiConfig);
export const dnsApi = new DnsApi(apiConfig);
export const usersApi = new UsersApi(apiConfig);

export async function getRequestFailMessage(
  response: Response
): Promise<string> {
  const { statusText, status } = response;
  const responseText = await response.text();
  return (
    responseText ??
    `Request error: ${statusText}${status ? ' (' + status + ')' : ''}`
  );
}
