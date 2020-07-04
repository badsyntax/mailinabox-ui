import { CREDENTIALS_SEPERATOR, StorageAuth, STORAGE_KEY } from './StorageAuth';

export const storageAuth = new StorageAuth(
  sessionStorage.getItem(STORAGE_KEY) ||
    localStorage.getItem(STORAGE_KEY) ||
    CREDENTIALS_SEPERATOR
);
