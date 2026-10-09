import { useEffect } from 'react';

export default function ElectronAuthStart() {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = 'https://ar-media-sigma.vercel.app/auth/callback';
    const state = Math.random().toString(36).slice(2);

    // Save state for verification on the callback page
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'id_token',
      scope: 'openid profile email',
      nonce: Math.random().toString(36).slice(2),
      state,
      prompt: 'select_account',
    });

    // Redirect the browser to Google
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-text-secondary">Redirecting to Google...</p>
      </div>
    </div>
  );
}