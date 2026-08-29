import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser, registerUser } from '../../utils/mockData';

export default function MobileLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleMode = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setError('');
    setIsLogin(!isLogin);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await loginUser(email, password);
        navigation.navigate('Main');
      } else {
        await registerUser(name, email, password);
        navigation.navigate('Main');
      }
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <Animated.View
          style={{
            opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
            transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }) }],
          }}
          className="bg-surface rounded-2xl p-6 shadow-lg"
        >
          <Text className="text-3xl font-bold text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text className="text-center text-text-secondary mb-6">
            {isLogin ? 'Sign in to continue' : 'Join our community today'}
          </Text>

          {/* Google Button */}
          <TouchableOpacity
            className="bg-white border border-border rounded-lg py-3 mb-6 flex-row items-center justify-center gap-2"
            onPress={() => console.log('Google sign-in')}
          >
            <Text className="text-xl">G</Text>
            <Text className="font-medium text-text">Continue with Google</Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-3 mb-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-sm text-text-secondary">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {!isLogin && (
            <TextInput
              className="bg-background rounded-lg px-4 py-3 mb-4 border border-border"
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          )}
          <TextInput
            className="bg-background rounded-lg px-4 py-3 mb-4 border border-border"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="bg-background rounded-lg px-4 py-3 mb-4 border border-border"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error && <Text className="text-error text-sm mb-4">{error}</Text>}

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
        </Animated.View>

        <TouchableOpacity onPress={toggleMode} className="mt-6">
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