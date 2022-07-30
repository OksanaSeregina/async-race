import { STORAGE_KEY } from '../../constants';

export class StorageService {
  private static _instance: StorageService;

  constructor() {
    if (!StorageService._instance) {
      StorageService._instance = this;
    }
    return StorageService._instance;
  }

  public set(key: keyof object, value: object): void {
    const storage: object = this.getStorage();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage ? { ...storage, [key]: value } : { [key]: value }));
  }

  public get(key: keyof object): unknown {
    const storage: object = this.getStorage();
    if (storage) {
      return storage[key];
    }
  }

  public clear(): void {
    localStorage.setItem(STORAGE_KEY, '');
  }

  private getStorage(): object {
    const storage: string | null = localStorage.getItem(STORAGE_KEY);
    return storage ? <object>JSON.parse(storage) : <object>{};
  }
}
