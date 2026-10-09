// desktop/src/config.js
import { setApiBaseUrl } from '../../packages/ui/src/utils/apiConfig';

const API_URL = import.meta.env.VITE_API_URL || 'https://ar-media-sigma.vercel.app';
setApiBaseUrl(API_URL);

console.log('✅ Using API:', API_URL);

// Optional: Test the API right at startup
if (typeof window !== 'undefined') {
  fetch(`${API_URL}/api/media?page=0&limit=1`)
    .then((r) => r.json())
    .then((data) => {
      console.log('✅ API responds. Sample media count:', data.total);
    })
    .catch((err) => {
      console.error('❌ API NOT REACHABLE:', err.message);
    });
}