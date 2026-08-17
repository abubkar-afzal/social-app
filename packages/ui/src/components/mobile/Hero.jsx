import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const demoData = [
  { id: '1', type: 'video', title: 'Nature', color: '#ff6b9d' },
  { id: '2', type: 'photo', title: 'City', color: '#10b981' },
  { id: '3', type: 'audio', title: 'Beats', color: '#f59e0b' },
  { id: '4', type: 'photo', title: 'Mountains', color: '#3b82f6' },
  { id: '5', type: 'video', title: 'Cooking', color: '#8b5cf6' },
  { id: '6', type: 'photo', title: 'Art', color: '#ef4444' },
];

export default function MobileHero() {
  const renderItem = ({ item }) => (
    <TouchableOpacity className="flex-1 bg-surface rounded-xl overflow-hidden shadow-md" activeOpacity={0.8}>
      <View className="aspect-square items-center justify-center" style={{ backgroundColor: item.color }}>
        {item.type === 'video' && <Text className="text-4xl text-white">▶️</Text>}
        {item.type === 'audio' && <Text className="text-4xl">🎵</Text>}
        {item.type === 'photo' && <Text className="text-4xl">🖼️</Text>}
      </View>
      <Text className="p-2 text-sm font-medium text-text">{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background px-3 pt-4">
      <Text className="text-2xl font-bold text-text mb-4">Discover</Text>
      <FlatList
        data={demoData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}