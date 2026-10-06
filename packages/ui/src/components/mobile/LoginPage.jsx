import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { useNavigation } from '@react-navigation/native';
import { storage } from '../../utils/storage';
import { apiUrl } from '../../utils/apiConfig';

WebBrowser.maybeCompleteAuthSession();

// Build the redirect URI from the app's custom scheme.
// In a dev build this becomes: com.armedia.app://
// (No proxy needed — the OS routes the deep link back to our app.)
const REDIRECT_URI = Platform.select({
  android: 'com.armedia.app:/oauth2redirect',
  ios: 'com.armedia.app:/oauth2redirect',
  default: undefined,
});

export default function MobileLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: '1051290880207-qqhilo7t4f3qvig6n20snftv95o32s1k.apps.googleusercontent.com',
    webClientId: '1051290880207-d4q0sfd3l2dnfcesgh4o5tg7u4uiaurh.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri: REDIRECT_URI,
    responseType: 'id_token',
  });

  console.log('🔗 Google OAuth redirect URI:', REDIRECT_URI);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) handleGoogleIdToken(id_token);
      else setError('No ID token received from Google.');
    } else if (response?.type === 'error') {
      setError(response.error?.message || 'Google sign-in failed.');
    }
  }, [response]);

  const handleGoogleIdToken = async (idToken) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(apiUrl('/api/auth/google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, clientType: 'mobile' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');

      await storage.setItem('authToken', data.token);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.');
      return;
    }
    if (!isLogin && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await new Promise((r) => setTimeout(r, 800));
      await storage.setItem('authToken', 'demo-token');
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-center text-text mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Text>
        <Text className="text-center text-text-secondary mb-8">
          {isLogin ? 'Sign in to continue' : 'Join our community today'}
        </Text>

        <TouchableOpacity
          className="bg-white border border-border rounded-lg py-3 mb-6 flex-row items-center justify-center"
          onPress={() => promptAsync()}
          disabled={!request || loading}
          style={{ opacity: !request || loading ? 0.6 : 1 }}
        >
          <Text className="text-xl mr-2 font-bold" style={{ color: '#4285F4' }}>G</Text>
          <Text className="font-medium text-text">Continue with Google</Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-3 mb-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-sm text-text-secondary">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {!isLogin && (
          <TextInput
            className="bg-surface rounded-lg px-4 py-3 mb-4 border border-border text-text"
            placeholder="Full Name"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          className="bg-surface rounded-lg px-4 py-3 mb-4 border border-border text-text"
          placeholder="Email"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View className="mb-4 relative">
          <TextInput
            className="bg-surface rounded-lg px-4 py-3 pr-16 border border-border text-text"
            placeholder="Password"
            placeholderTextColor="#6b7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            <Text className="text-primary text-sm font-medium">
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View className="bg-error/10 border border-error rounded-lg p-3 mb-4">
            <Text className="text-error text-sm">{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          className={`bg-primary py-3 rounded-lg ${loading ? 'opacity-60' : ''}`}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold">
              {isLogin ? 'Login' : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity className="mt-6" onPress={() => { setIsLogin(!isLogin); setError(''); }}>
          <Text className="text-center text-text-secondary">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Text className="text-primary font-medium">
              {isLogin ? 'Sign Up' : 'Login'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}