import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../utils/mockData';
import { apiUrl, setStoredToken } from '../../utils/apiConfig';

/* -------------------------------------------------------------------------- */
/*                          GOOGLE OAUTH CONFIGURATION                         */
/* -------------------------------------------------------------------------- */

// Web client ID (the one registered in Google Cloud Console)
const GOOGLE_CLIENT_ID =
  '1051290880207-d4q0sfd3l2dnfcesgh4o5tg7u4uiaurh.apps.googleusercontent.com';

// Must match an Authorized redirect URI in Google Cloud Console.
// This page lives on your Vercel site and forwards the token to armedia://
const REDIRECT_URI = 'https://ar-media-sigma.vercel.app/auth/callback';

/* -------------------------------------------------------------------------- */
/*                          GOOGLE AUTH URL BUILDER                            */
/* -------------------------------------------------------------------------- */

function buildGoogleAuthUrl() {
  const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);

  // Persist nonce so we can verify later if needed
  try {
    sessionStorage.setItem('oauth_nonce', nonce);
  } catch {}

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'id_token',
    scope: 'openid profile email',
    nonce,
    prompt: 'select_account',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/* -------------------------------------------------------------------------- */
/*                              LOGIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function DesktopLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waitingForBrowser, setWaitingForBrowser] = useState(false);

  // Listen for the token forwarded by the /auth/callback page
  useEffect(() => {
    if (typeof window === 'undefined' || !window.electronAPI) return;

    window.electronAPI.onOAuthToken(async (idToken) => {
      setWaitingForBrowser(false);
      if (!idToken) {
        setError('No token received.');
        return;
      }
      await exchangeToken(idToken);
    });
  }, []);

  const exchangeToken = async (idToken) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(apiUrl('/api/auth/google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, clientType: 'web' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');

      setStoredToken(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const url = buildGoogleAuthUrl();

    try {
      if (window.electronAPI?.openExternal) {
        await window.electronAPI.openExternal(url);
      } else {
        window.open(url, '_blank');
      }
      setWaitingForBrowser(true);
    } catch (e) {
      setError('Could not open the sign-in page.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(name, email, password);
      }
      setStoredToken('demo-token');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface px-4 py-8">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-text-secondary mb-8">
            {isLogin ? 'Sign in to continue' : 'Join our community today'}
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading || waitingForBrowser}
            className="w-full flex items-center justify-center gap-3 bg-white border border-border rounded-lg py-3 mb-2 hover:bg-background transition disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-text">
              {waitingForBrowser ? 'Waiting for browser...' : 'Continue with Google'}
            </span>
          </button>

          {waitingForBrowser && (
            <p className="text-xs text-center text-text-secondary mb-4">
              Complete sign-in in your browser, then return here.
            </p>
          )}

          {!waitingForBrowser && <div className="mb-4" />}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-text-secondary">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-error text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>

        <div className="bg-background px-8 py-4 text-center">
          <p className="text-sm text-text-secondary">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={toggleMode}
              className="ml-1 text-primary hover:underline font-medium"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}