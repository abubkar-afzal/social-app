import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MobileNavbar() {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  return (
    <View className="bg-surface border-b border-border px-4 pb-3" style={{ paddingTop: Platform.OS === 'android' ? 20 : 0 }}>
      {/* Top row */}
      <View className="flex-row justify-between items-center mb-3">
        <TouchableOpacity onPress={() => navigation.navigate('Home')} className="p-2">
          <Text className="text-2xl">🏠</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primary">PinShare</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Account')} className="p-2">
          <Text className="text-2xl">🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View className="flex-row items-center bg-background rounded-full px-3 mb-3">
        <Text className="mr-2 text-lg">🔍</Text>
        <TextInput
          className="flex-1 h-10 text-base text-text"
          placeholder="Search for anything"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#6b7280"
        />
      </View>

      {/* Navigation tabs */}
      {/* <View className="flex-row justify-around items-center">
        <TouchableOpacity onPress={() => navigation.navigate('Home')} className="items-center">
          <Text className="text-2xl">🏠</Text>
          <Text className="text-xs text-text-secondary">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Videos')} className="items-center">
          <Text className="text-2xl">🎬</Text>
          <Text className="text-xs text-text-secondary">Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Photos')} className="items-center">
          <Text className="text-2xl">🖼️</Text>
          <Text className="text-xs text-text-secondary">Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Audio')} className="items-center">
          <Text className="text-2xl">🎵</Text>
          <Text className="text-xs text-text-secondary">Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Account')} className="items-center">
          <Text className="text-2xl">👤</Text>
          <Text className="text-xs text-text-secondary">Profile</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}