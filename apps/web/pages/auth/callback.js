import { useEffect, useState } from 'react';

export default function AuthCallback() {
  const [status, setStatus] = useState('Processing sign-in...');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      // Google puts the token in the URL hash: #id_token=...&state=...
      // After Google redirects with #id_token=...
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);
const idToken = params.get('id_token');

if (idToken) {
  window.location.href = `armedia://auth?token=${encodeURIComponent(idToken)}`;
}
      const state = params.get('state');
      const errorParam = params.get('error');

      if (errorParam) {
        setError(`Google error: ${errorParam}`);
        return;
      }
      if (!idToken) {
        setError('No token received from Google.');
        return;
      }

      // Optional: verify state matches what we stored
      const storedState = sessionStorage.getItem('oauth_state');
      if (storedState && state !== storedState) {
        setError('State mismatch — possible CSRF. Please try again.');
        return;
      }

      // Hand off to the Electron app via the custom protocol
      // The app registers `armedia://` on the OS. Android/Windows/macOS
      // will route this URL to the app.
      const deepLink = `armedia://auth?token=${encodeURIComponent(idToken)}`;

      setStatus('Sign-in successful! Returning to app...');
      window.location.href = deepLink;

      // If the app doesn't launch within 3s, show a message
      setTimeout(() => {
        setStatus(
          "If nothing happened, the AR Media desktop app might not be installed. " +
          "You can close this window and try again."
        );
      }, 3000);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-surface rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {error ? (
          <>
            <h1 className="text-xl font-bold text-error mb-2">Sign-in failed</h1>
            <p className="text-text-secondary text-sm">{error}</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <h1 className="text-xl font-bold text-text mb-2">Almost done</h1>
            <p className="text-text-secondary text-sm">{status}</p>
          </>
        )}
      </div>
    </div>
  );
}