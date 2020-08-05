import { Dispatch, SetStateAction, useState } from 'react';
import { getRequestFailMessage } from '.';

type PerformRequest = () => void;

type Request<T> = [
  PerformRequest,
  {
    response: T | null;
    error: string | null;
    isLoading: boolean;
    setResponse: Dispatch<SetStateAction<T | null>>;
    setError: Dispatch<SetStateAction<string | null>>;
    reset: () => void;
  }
];

export function useRequest<T>(
  queryFunc: () => Promise<T>,
  responseHandler?: (response: T) => void | null
): Request<T> {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function performRequest(): void {
    setIsLoading(true);
    queryFunc()
      .then(
        (response) => {
          if (responseHandler) {
            responseHandler(response);
          } else {
            setResponse(response);
          }
        },
        async (err) => {
          setError(await getRequestFailMessage(err));
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  }

  function reset(): void {
    setResponse(null);
    setError(null);
    setIsLoading(false);
  }

  return [
    performRequest,
    { response, setResponse, error, setError, isLoading, reset },
  ];
}
