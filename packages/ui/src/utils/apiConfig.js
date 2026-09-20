let API_BASE_URL = '';

export const setApiBaseUrl = (url) => {
  API_BASE_URL = url ? url.replace(/\/$/, '') : ''; // remove trailing slash
};

export const getApiBaseUrl = () => API_BASE_URL;

/**
 * Builds a full URL from a path.
 * - For web: returns relative path (empty base).
 * - For mobile/desktop: returns full URL with base.
 */
export const apiUrl = (path) => {
  if (!path.startsWith('/')) path = '/' + path;
  return `${API_BASE_URL}${path}`;
};