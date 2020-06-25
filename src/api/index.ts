import {
  Configuration,
  ConfigurationParameters,
  UserApi,
} from 'mailinabox-api';

export const apiConfigParams: ConfigurationParameters = {
  basePath: '/admin',
};

export const apiConfig = new Configuration(apiConfigParams);

export const userApi = new UserApi(apiConfig);
