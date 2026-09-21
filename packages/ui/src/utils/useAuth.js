import { useState, useEffect } from 'react';
import { apiUrl, authFetch, getStoredToken, clearAuth } from './apiConfig';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authFetch(apiUrl('/api/auth/me'));
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          clearAuth();
        }
      } catch (e) {
        console.error('Failed to load user', e);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return { user, loading, logout, setUser };
}