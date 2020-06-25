import {
  Configuration,
  ConfigurationParameters,
  UserApi,
} from 'mailinabox-api';
import { storageAuth } from '../auth';

const apiConfigParams: ConfigurationParameters = {
  basePath: '/admin',
  username: storageAuth.getUsername(),
  password: storageAuth.getPassword(),
};

const apiConfig = new Configuration(apiConfigParams);

export const userApi = new UserApi(apiConfig);

export function updateApiConfig(config: ConfigurationParameters): void {
  Object.assign(apiConfigParams, config);
}
