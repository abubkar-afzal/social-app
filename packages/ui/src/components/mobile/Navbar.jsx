import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function MobileNavbar() {
  const [search, setSearch] = useState('');

  return (
    <View className="bg-surface border-b border-border px-4 pt-10 pb-3">
      {/* Top row */}
      <View className="flex-row justify-between items-center mb-3">
        <TouchableOpacity className="p-2">
          <Text className="text-2xl">🏠</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primary">PinShare</Text>
        <TouchableOpacity className="p-2">
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

      {/* Bottom row */}
      <View className="flex-row justify-between items-center">
        <TouchableOpacity className="flex-row items-center bg-primary rounded-full py-2 px-4">
          <Text className="text-white mr-1 text-lg">＋</Text>
          <Text className="text-white font-semibold">Create</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-1 border-2 border-primary rounded-full">
          <Text className="text-2xl text-primary">👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}