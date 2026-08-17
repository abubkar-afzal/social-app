import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

export default function MobileMediaCard({ media }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl overflow-hidden mb-3 shadow-md"
      activeOpacity={0.85}
    >
      <View
        className="aspect-square items-center justify-center"
        style={{ backgroundColor: item?.color || '#e5e7eb' }}
      >
        {item?.type === 'video' && <Text className="text-4xl text-white">▶️</Text>}
        {item?.type === 'audio' && <Text className="text-4xl">🎵</Text>}
        {item?.type === 'photo' && <Text className="text-4xl">🖼️</Text>}
      </View>
      <View className="p-3">
        <Text className="text-base font-semibold text-text mb-2" numberOfLines={1}>
          {item?.title || 'Untitled'}
        </Text>
        <View className="flex-row justify-between">
          <TouchableOpacity className="p-2 rounded-full bg-background">
            <Text className="text-lg">🔖</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-2 rounded-full bg-primary">
            <Text className="text-lg text-white">＋</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={media}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
}