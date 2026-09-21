import React, { useState, useEffect, useRef } from 'react';
import { loginUser, registerUser } from '../../utils/mockData';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'outline',
      size: 'large',
      width: '100%',
      text: 'continue_with',
    });
  }, []);

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential, clientType: 'web' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');

      localStorage.setItem('authToken', data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const user = await loginUser(email, password);
        localStorage.setItem('authUser', JSON.stringify(user));
        window.location.href = '/';
      } else {
        const user = await registerUser(name, email, password);
        localStorage.setItem('authUser', JSON.stringify(user));
        window.location.href = '/';
      }
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

          {/* Google Sign-In button (rendered by GIS) */}
          <div ref={googleBtnRef} className="w-full mb-4" />

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-text-secondary">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 mb-4 rounded-lg border border-border"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg border border-border"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mb-6 rounded-lg border border-border"
              required
              minLength={6}
            />
            {error && <p className="text-error text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>

        <div className="bg-background px-8 py-4 text-center">
          <p className="text-sm text-text-secondary">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-primary font-medium">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}