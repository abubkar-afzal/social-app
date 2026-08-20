import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function MobileAccount() {
  const [user] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Passionate about sharing beautiful content',
    followers: 1234,
    following: 567,
  });

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <View className="bg-surface rounded-xl p-6 items-center">
          <Image source={{ uri: user.avatar }} className="w-24 h-24 rounded-full mb-4" />
          <Text className="text-2xl font-bold text-text">{user.name}</Text>
          <Text className="text-text-secondary">{user.bio}</Text>
          
          <View className="flex-row gap-8 mt-4">
            <View className="items-center">
              <Text className="text-xl font-bold text-text">{user.followers}</Text>
              <Text className="text-sm text-text-secondary">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-text">{user.following}</Text>
              <Text className="text-sm text-text-secondary">Following</Text>
            </View>
          </View>
          
          <TouchableOpacity className="bg-primary px-6 py-2 rounded-full mt-6">
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}