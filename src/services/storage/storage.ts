// src/services/storage/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum StorageKeys {
  AUTH_TOKEN = 'auth_token',
  USER_DATA = 'user_data',
  THEME_MODE = 'theme_mode',
}

class StorageService {
  async setItem(key: StorageKeys, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('StorageService: Error setting item', error);
      throw error;
    }
  }

  async getItem(key: StorageKeys): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('StorageService: Error getting item', error);
      throw error;
    }
  }

  async removeItem(key: StorageKeys): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('StorageService: Error removing item', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('StorageService: Error clearing storage', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();