import {
  AliasesApi,
  Configuration,
  ConfigurationParameters,
  DnsApi,
  SslApi,
  SystemApi,
  UserApi,
  UsersApi,
  WebApi,
} from 'mailinabox-api';
import { storageAuth } from '../auth';

// TODO: add middleware for handling token expiry

const apiConfigParams: ConfigurationParameters = {
  basePath: '/admin',
  username: storageAuth.getUsername(),
  password: storageAuth.getPassword(),
};

const apiConfig = new Configuration(apiConfigParams);

export const aliasesApi = new AliasesApi(apiConfig);
export const userApi = new UserApi(apiConfig);
export const systemApi = new SystemApi(apiConfig);
export const sslApi = new SslApi(apiConfig);
export const dnsApi = new DnsApi(apiConfig);
export const usersApi = new UsersApi(apiConfig);
export const webApi = new WebApi(apiConfig);

export function updateApiConfig(config: ConfigurationParameters): void {
  Object.assign(apiConfigParams, config);
}

async function getResponseText(response: Response): Promise<string | null> {
  const { status } = response;
  // Prevent returning the generic web server response for server errors
  // as it might contain large chunks of unwanted HTML
  if (status >= 500 && status <= 599) {
    return null;
  }
  return await response.text();
}

export async function getRequestFailMessage(
  response: Response | Error
): Promise<string> {
  if (response instanceof Error) {
    return response.message;
  }
  const { statusText, status } = response;
  const responseText = await getResponseText(response);
  return (
    responseText ||
    `Request error: ${statusText}${status ? ' (' + status + ')' : ''}`
  );
}
