import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import {
  Configuration,
  ConfigurationParameters,
  DNSApi,
  MailApi,
  SSLApi,
  SystemApi,
  UserApi,
  WebApi,
} from 'mailinabox-api';
import { storageAuth } from '../auth';
import { updateAuth } from '../features/authSlice';
import { AppDispatch } from '../store';

const apiConfigParams: ConfigurationParameters = {
  basePath: '/admin',
  username: storageAuth.getUsername(),
  password: storageAuth.getPassword(),
  middleware: [],
};

const apiConfig = new Configuration(apiConfigParams);

export const userApi = new UserApi(apiConfig);
export const systemApi = new SystemApi(apiConfig);
export const sslApi = new SSLApi(apiConfig);
export const dnsApi = new DNSApi(apiConfig);
export const mailApi = new MailApi(apiConfig);
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

export async function handleRequestError(
  response: Response | Error,
  dispatch: AppDispatch,
  onErrorAction: ActionCreatorWithPayload<unknown>
): Promise<void> {
  if (!(response instanceof Error) && response.status === 403) {
    dispatch(
      updateAuth({
        username: '',
        password: '',
        isAuthenticated: false,
        error: 'Your token is no longer valid.',
      })
    );
  } else {
    dispatch(onErrorAction(await getRequestFailMessage(response)));
  }
}
