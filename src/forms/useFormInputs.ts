import { useConstCallback } from '@uifabric/react-hooks';
import { Dispatch, SetStateAction, useState } from 'react';

type FormField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface FormInputsReturnType<T> {
  onInputChange: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inputs: T;
  setInputs: Dispatch<SetStateAction<T>>;
  resetInputs: () => void;
}

export function useFormInputs<T>(initialState: T): FormInputsReturnType<T> {
  const [inputs, setInputs] = useState<T>(initialState);

  const onInputChange = useConstCallback(
    (event: React.SyntheticEvent<FormField>): void => {
      const { name: key, value } = event.target as FormField;
      if (!(key in initialState)) {
        throw new Error('Invalid key: ' + key);
      }
      setInputs((inputs) => ({
        ...inputs,
        [key]: value,
      }));
    }
  );

  const resetInputs = useConstCallback((): void => {
    setInputs(initialState);
  });

  return {
    inputs,
    setInputs,
    onInputChange,
    resetInputs,
  };
}
