import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiUrl } from '../../utils/apiConfig';

export function useMobileAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(apiUrl('/api/auth/me'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setUser(await res.json());
        } else {
          await SecureStore.deleteItemAsync('authToken');
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    setUser(null);
  };

  return { user, loading, logout, setUser };
}