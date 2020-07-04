export const STORAGE_KEY = 'miab-cp-credentials';
export const CREDENTIALS_SEPERATOR = ':';

function buildStorageCredentials(username: string, password: string): string {
  return `${username}${CREDENTIALS_SEPERATOR}${password}`;
}

export class StorageAuth {
  private username: string;
  private password: string;
  private isAuthenticated = false;
  constructor(private readonly credentials: string) {
    const [username = '', password = ''] = this.credentials.split(
      CREDENTIALS_SEPERATOR
    );
    this.username = username;
    this.password = password;
    this.isAuthenticated = Boolean(username && password);
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  persistToStorage(remember: boolean): void {
    const credentials = buildStorageCredentials(this.username, this.password);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, credentials);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.setItem(STORAGE_KEY, credentials);
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
