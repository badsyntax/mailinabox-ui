import fetchMock from 'fetch-mock';
import { mocks } from './mocks';

Object.keys(mocks).forEach((url) => {
  const methods = mocks[url];
  Object.keys(methods).forEach((method) => {
    const data = mocks[url][method];
    fetchMock.mock(
      {
        url,
        method,
        delay: 500,
      },
      data
    );
  });
});
