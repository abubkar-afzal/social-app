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

/**
 * Safe JSON parser: if the response isn't JSON, throw a helpful error
 * instead of the cryptic "Unexpected token '<'" message.
 */
export const safeJson = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    // The response was not JSON — likely an HTML error page
    const preview = text.slice(0, 120).replace(/\s+/g, ' ');
    const err = new Error(
      `API returned non-JSON response from ${res.url} (${res.status}). ` +
      `This usually means the backend URL is wrong or the endpoint doesn't exist. ` +
      `Response preview: "${preview}..."`
    );
    err.status = res.status;
    err.rawText = text;
    throw err;
  }
};

/**
 * Fetch with automatic JSON parsing and auth header.
 * - Adds `Authorization: Bearer <token>` if a token exists
 * - Throws a descriptive error if the response isn't JSON
 */
export const authFetch = async (url, options = {}) => {
  const token = getStoredToken();

  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  // Only set Content-Type when there's actually a JSON body to send.
  // GET requests without a body should NOT set Content-Type —
  // that's what triggers the CORS preflight.
  const method = (options.method || 'GET').toUpperCase();
  const hasBody = options.body !== undefined && options.body !== null;
  const needsJsonContentType = hasBody && !isFormData && method !== 'GET' && method !== 'HEAD';

  const headers = {
    ...(needsJsonContentType ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, { ...options, headers });
};

/**
 * Wrapper that fetches and returns parsed JSON safely.
 */
export const fetchJson = async (url, options = {}) => {
  const res = await authFetch(url, options);
  const data = await safeJson(res);
  return { res, data };
};