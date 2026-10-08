// desktop/src/config.js
import { setApiBaseUrl, getApiBaseUrl, apiUrl } from '../../packages/ui/src/utils/apiConfig';

const API_URL = import.meta.env.VITE_API_URL || 'https://ar-media-sigma.vercel.app';
setApiBaseUrl(API_URL);

// Debug
console.log('🔗 API base:', getApiBaseUrl());
console.log('🔗 Sample stream URL:', apiUrl('/api/media/stream?id=TEST123'));
console.log('🔗 Sample list URL:', apiUrl('/api/media?page=0&limit=1'));