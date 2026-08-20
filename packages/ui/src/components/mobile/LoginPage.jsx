import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { loginUser } from '../../utils/mockData';

export default function MobileLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await loginUser(email, password);
      navigation.navigate('Main');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center px-6 bg-background">
      <Text className="text-3xl font-bold text-center mb-8">Welcome Back</Text>
      
      <TextInput
        className="bg-surface rounded-lg px-4 py-3 mb-4 border border-border"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        className="bg-surface rounded-lg px-4 py-3 mb-6 border border-border"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {error && <Text className="text-error text-sm mb-4">{error}</Text>}
      
      <TouchableOpacity
        className="bg-primary py-3 rounded-lg"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">Login</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity className="mt-4" onPress={() => navigation.navigate('Register')}>
        <Text className="text-center text-primary">Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}