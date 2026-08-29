import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function MobileFooter({ state, descriptors, navigation }) {
  const nav = useNavigation();
  const route = useRoute();

 

  const tabs = [
    { key: 'Home', label: 'Home', icon: '🏠', screen: 'Home' },
    { key: 'Videos', label: 'Videos', icon: '🎬', screen: 'Videos' },
    { key: 'Photos', label: 'Photos', icon: '🖼️', screen: 'Photos' },
    { key: 'Audio', label: 'Audio', icon: '🎵', screen: 'Audio' },
    { key: 'Login', label: 'Login', icon: '👤', screen: 'Login' },
  ];

  const handleTabPress = (screen) => {
    // If we are inside a tab navigator (route.name is one of the tabs), navigate directly.
    const tabNames = tabs.map(t => t.screen);
    if (tabNames.includes(route.name)) {
      nav.navigate(screen);
    } else {
      // Otherwise, navigate to the 'Main' stack screen and then to the tab.
      nav.navigate('Main', { screen });
    }
  };

  return (
    <View>
      <View
        className="flex-row bg-surface border-t border-border py-2"
        style={{ paddingBottom: Platform.OS === 'android' ? 16 : 0 }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            className="flex-1 items-center"
            onPress={() => handleTabPress(tab.screen)}
          >
            <Text className="text-2xl">{tab.icon}</Text>
            <Text className="text-xs text-text-secondary">{tab.label}</Text>
          </TouchableOpacity>
        ))}

        
      </View>

      
    </View>
  );
}