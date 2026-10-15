// packages/ui/src/utils/storage.js
// Web / Desktop implementation — uses localStorage. No React Native imports.

export const storage = {
  async getItem(key) {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async setItem(key, value) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn('storage.setItem failed:', e);
    }
  },

  async removeItem(key) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn('storage.removeItem failed:', e);
    }
  },
};