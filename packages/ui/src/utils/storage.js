// packages/ui/src/utils/storage.js
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Cross-platform storage helper.
 * - On native (Android/iOS): uses expo-secure-store (encrypted)
 * - On web: falls back to localStorage (SecureStore is native-only)
 */
export const storage = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      try {
        return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      } catch {
        return null;
      }
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn('storage.getItem failed:', e);
      return null;
    }
  },

  async setItem(key, value) {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
      } catch (e) {
        console.warn('storage.setItem failed:', e);
      }
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.warn('storage.setItem failed:', e);
    }
  },

  async removeItem(key) {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      } catch (e) {
        console.warn('storage.removeItem failed:', e);
      }
      return;
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn('storage.removeItem failed:', e);
    }
  },
};