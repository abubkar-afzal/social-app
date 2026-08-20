import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';

export default function MobileFooter({ state, descriptors, navigation }) {
  const tabIcons = {
    Home: '🏠',
    Videos: '🎬',
    Photos: '🖼️',
    Audio: '🎵',
    Account: '👤',
  };

  if (!state) {
    return (
      <View className="flex-row bg-surface border-t border-border py-2" style={{ paddingBottom: Platform.OS === 'android' ? 16 : 0 }}>
        <TouchableOpacity className="flex-1 items-center" onPress={() => navigation?.navigate('Home')}>
          <Text className="text-2xl">🏠</Text>
          <Text className="text-xs text-text-secondary">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center" onPress={() => navigation?.navigate('Videos')}>
          <Text className="text-2xl">🎬</Text>
          <Text className="text-xs text-text-secondary">Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center" onPress={() => navigation?.navigate('Photos')}>
          <Text className="text-2xl">🖼️</Text>
          <Text className="text-xs text-text-secondary">Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center" onPress={() => navigation?.navigate('Audio')}>
          <Text className="text-2xl">🎵</Text>
          <Text className="text-xs text-text-secondary">Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center" onPress={() => navigation?.navigate('Account')}>
          <Text className="text-2xl">👤</Text>
          <Text className="text-xs text-text-secondary">Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-row bg-surface border-t border-border py-2" style={{ paddingBottom: Platform.OS === 'android' ? 16 : 0 }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icon = tabIcons[route.name] || '📄';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center"
          >
            <Text className={`text-2xl ${isFocused ? 'opacity-100' : 'opacity-50'}`}>
              {icon}
            </Text>
            <Text className={`text-xs ${isFocused ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}