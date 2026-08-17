import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export default function MobileFooter({ activeTab = 'home', onTabPress }) {
  const tabs = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'videos', label: 'Videos', icon: '🎬' },
    { key: 'photos', label: 'Photos', icon: '🖼️' },
    { key: 'audio', label: 'Audio', icon: '🎵' },
    { key: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <View className="flex-row bg-surface border-t border-border py-2 pb-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            className="flex-1 items-center justify-center gap-1"
            onPress={() => onTabPress?.(tab.key)}
          >
            <Text className={`text-2xl ${isActive ? 'opacity-100' : 'opacity-50'}`}>
              {tab.icon}
            </Text>
            <Text className={`text-xs ${isActive ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}