import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMobileAuth } from './useMobileAuth';

// Optional: pass a local logo via require() if you want a custom image.
// Otherwise the navbar shows a text logo.
//   <MobileNavbar logo={require('../../assets/logo.png')} />
export default function MobileNavbar({ logo }) {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useMobileAuth();

  const handleProfilePress = () => {
    if (user) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View
      className="bg-surface border-b border-border px-4 pb-3"
      style={{ paddingTop: Platform.OS === 'android' ? 20 : 0 }}
    >
      {/* Top row */}
      <View className="flex-row justify-between items-center mb-3">


        {/* Brand: image logo if provided, otherwise text */}
        {logo ? (
          <Image
          onPress={() => navigation.navigate('Home')}
            source={logo}
            style={{ width: 32, height: 32, borderRadius: 16 }}
            resizeMode="contain"
          />
        ) : (
          <Text onPress={() => navigation.navigate('Home')} className="text-xl font-bold text-primary">AR Media</Text>
        )}

        <TouchableOpacity onPress={handleProfilePress} className="p-2">
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          ) : (
            <Text className="text-2xl">👤</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View className="flex-row items-center bg-background rounded-full px-3 mb-1">
        <Text className="mr-2 text-lg">🔍</Text>
        <TextInput
          className="flex-1 h-10 text-base text-text"
          placeholder="Search for anything"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#6b7280"
        />
      </View>
    </View>
  );
}