import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../utils/mockData';
import { apiUrl, setStoredToken } from '../../utils/apiConfig';

export default function DesktopLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slide, setSlide] = useState(false);
  const googleBtnRef = useRef(null);

  // Google Identity Services
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(apiUrl('/api/auth/google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential, clientType: 'web' }),
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

  const toggleMode = () => {
    setSlide(true);
    setError('');
    setTimeout(() => {
      setIsLogin(!isLogin);
      setSlide(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const user = await loginUser(email, password);
        console.log('Logged in:', user);
        // For mock auth, set a placeholder token
        setStoredToken('demo-token');
        navigate('/');
      } else {
        const user = await registerUser(name, email, password);
        console.log('Registered:', user);
        setStoredToken('demo-token');
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface px-4 py-8">
      <div
        className={`w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          slide ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
        }`}
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-text-secondary mb-8">
            {isLogin ? 'Sign in to continue' : 'Join our community today'}
          </p>

          {/* Google Sign-In Button (rendered by GIS) */}
          <div ref={googleBtnRef} className="w-full mb-4" />

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
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
            <button onClick={toggleMode} className="ml-1 text-primary hover:underline font-medium">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}