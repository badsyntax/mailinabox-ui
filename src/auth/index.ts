import { StorageAuth, STORAGE_KEY, CREDENTIALS_SEPERATOR } from './StorageAuth';

export const storageAuth = new StorageAuth(
  sessionStorage.getItem(STORAGE_KEY) ||
    localStorage.getItem(STORAGE_KEY) ||
    CREDENTIALS_SEPERATOR
);
