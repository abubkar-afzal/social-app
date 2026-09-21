import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { apiUrl } from '../../utils/apiConfig';

WebBrowser.maybeCompleteAuthSession();

export default function MobileLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: '1051290880207-d4q0sfd3l2dnfcesgh4o5tg7u4uiaurh.apps.googleusercontent.com',    // can reuse web
  androidClientId: '1051290880207-qqhilo7t4f3qvig6n20snftv95o32s1k.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleIdToken(id_token);
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

      await SecureStore.setItemAsync('authToken', data.token);
      navigation.navigate('Main');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    // keep existing email/password login (mock for now)
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      await SecureStore.setItemAsync('authToken', 'demo-token');
      navigation.navigate('Main');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background justify-center px-6"
    >
      <Text className="text-3xl font-bold text-center mb-6">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </Text>

      <TouchableOpacity
        className="bg-white border border-border rounded-lg py-3 mb-4 flex-row items-center justify-center"
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text className="text-xl mr-2">G</Text>
        <Text className="font-medium">Continue with Google</Text>
      </TouchableOpacity>

      <View className="flex-row items-center gap-3 mb-4">
        <View className="flex-1 h-px bg-border" />
        <Text className="text-sm text-text-secondary">or</Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      {!isLogin && (
        <TextInput
          className="bg-surface rounded-lg px-4 py-3 mb-4 border border-border"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        className="bg-surface rounded-lg px-4 py-3 mb-4 border border-border"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="bg-surface rounded-lg px-4 py-3 mb-4 border border-border"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text className="text-error text-sm mb-3">{error}</Text> : null}

      <TouchableOpacity
        className="bg-primary py-3 rounded-lg"
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

      <TouchableOpacity className="mt-4" onPress={() => setIsLogin(!isLogin)}>
        <Text className="text-center text-text-secondary">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Text className="text-primary font-medium">
            {isLogin ? 'Sign Up' : 'Login'}
          </Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}