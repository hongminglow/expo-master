import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { KeyValueStorage } from './types';

const webSecureFallback = new Map<string, string>();

export const asyncStorageAdapter: KeyValueStorage = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
};

export const secureStorageAdapter: KeyValueStorage = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      return webSecureFallback.get(key) ?? null;
    }

    return SecureStore.getItemAsync(key);
  },
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      webSecureFallback.set(key, value);
      return;
    }

    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key) {
    if (Platform.OS === 'web') {
      webSecureFallback.delete(key);
      return;
    }

    await SecureStore.deleteItemAsync(key);
  },
};
