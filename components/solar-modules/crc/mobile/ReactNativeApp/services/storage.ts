import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

interface StorageItem {
  key: string;
  value: any;
  timestamp: number;
  expiry?: number;
}

class StorageService {
  private prefix = '@SolarGenius:';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const item: StorageItem = {
      key: this.getKey(key),
      value,
      timestamp: Date.now(),
      expiry: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined
    };
    await AsyncStorage.setItem(item.key, JSON.stringify(item));
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await AsyncStorage.getItem(this.getKey(key));
    if (!data) return null;

    const item: StorageItem = JSON.parse(data);
    
    if (item.expiry && Date.now() > item.expiry) {
      await this.remove(key);
      return null;
    }

    return item.value as T;
  }

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(this.getKey(key));
  }

  async clear(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const ourKeys = keys.filter(k => k.startsWith(this.prefix));
    await AsyncStorage.multiRemove(ourKeys);
  }

  async getAllKeys(): Promise<string[]> {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter(k => k.startsWith(this.prefix)).map(k => k.replace(this.prefix, ''));
  }

  async saveFile(uri: string, destination: string): Promise<string> {
    const newPath = `${FileSystem.documentDirectory}${destination}`;
    await FileSystem.copyAsync({ from: uri, to: newPath });
    return newPath;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = `${FileSystem.documentDirectory}${filePath}`;
    const info = await FileSystem.getInfoAsync(fullPath);
    if (info.exists) {
      await FileSystem.deleteAsync(fullPath);
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    const fullPath = `${FileSystem.documentDirectory}${filePath}`;
    const info = await FileSystem.getInfoAsync(fullPath);
    return info.exists;
  }

  async getFileUri(filePath: string): Promise<string> {
    return `${FileSystem.documentDirectory}${filePath}`;
  }

  async getStorageSize(): Promise<number> {
    const keys = await this.getAllKeys();
    let totalSize = 0;
    
    for (const key of keys) {
      const value = await this.get(key);
      if (value) {
        totalSize += JSON.stringify(value).length;
      }
    }
    
    return totalSize;
  }
}

export const storage = new StorageService();