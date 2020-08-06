import { MockResponse, MockResponseFunction } from 'fetch-mock';

export interface Mocks {
  [url: string]: {
    [method: string]: MockResponse | MockResponseFunction;
  };
}
