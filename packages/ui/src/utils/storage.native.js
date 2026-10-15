// packages/ui/src/utils/storage.native.js
// Native (React Native / Expo) implementation — uses expo-secure-store.
// Metro automatically resolves `.native.js` over `.js` on iOS/Android.

import * as SecureStore from 'expo-secure-store';

export const storage = {
  async getItem(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn('storage.getItem failed:', e);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.warn('storage.setItem failed:', e);
    }
  },

  async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn('storage.removeItem failed:', e);
    }
  },
};