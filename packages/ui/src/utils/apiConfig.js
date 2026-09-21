let API_BASE_URL = '';

export const setApiBaseUrl = (url) => {
  API_BASE_URL = url ? url.replace(/\/$/, '') : '';
};

export const getApiBaseUrl = () => API_BASE_URL;

export const apiUrl = (path) => {
  if (!path.startsWith('/')) path = '/' + path;
  return `${API_BASE_URL}${path}`;
};

export const getStoredToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const setStoredToken = (token) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('authToken', token);
  }
};

export const clearAuth = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
};

export const authFetch = async (url, options = {}) => {
  const token = getStoredToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
};