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
  const [moreVisible, setMoreVisible] = useState(false);
  const nav = useNavigation();
  const route = useRoute();

  const moreLinks = [
    { label: 'About', screen: 'About' },
    { label: 'Careers', screen: 'Careers' },
    { label: 'Press', screen: 'Press' },
    { label: 'Blog', screen: 'Blog' },
    { label: 'Help Center', screen: 'Help' },
    { label: 'Guidelines', screen: 'Guidelines' },
    { label: 'Privacy Policy', screen: 'Privacy' },
    { label: 'Terms of Service', screen: 'Terms' },
    { label: 'Settings', screen: 'Settings' },

  ];

  const tabs = [
    { key: 'Home', label: 'Home', icon: '🏠', screen: 'Home' },
    { key: 'Videos', label: 'Videos', icon: '🎬', screen: 'Videos' },
    { key: 'Photos', label: 'Photos', icon: '🖼️', screen: 'Photos' },
    { key: 'Audio', label: 'Audio', icon: '🎵', screen: 'Audio' },
  ];

  const handleTabPress = (screen) => {
    const tabScreens = tabs.map((t) => t.screen);
    if (tabScreens.includes(route.name)) {
      nav.navigate(screen);
    } else {
      nav.navigate('Main', { screen });
    }
  };

  return (
    <View>
      {/* Tabs row */}
      <View
        className="flex-row bg-surface border-t border-border py-2"
        style={{ paddingBottom: Platform.OS === 'android' ? 16 : 0 }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}          /* ✅ key present */
            className="flex-1 items-center"
            onPress={() => handleTabPress(tab.screen)}
          >
            <Text className="text-2xl">{tab.icon}</Text>
            <Text className="text-xs text-text-secondary">{tab.label}</Text>
          </TouchableOpacity>
        ))}

        {/* More tab */}
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => setMoreVisible(true)}
        >
          <Text className="text-2xl text-text">☰</Text>
          <Text className="text-xs text-text-secondary">More</Text>
        </TouchableOpacity>
      </View>

      {/* More Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={moreVisible}
        onRequestClose={() => setMoreVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-surface rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-text">Menu</Text>
              <TouchableOpacity onPress={() => setMoreVisible(false)}>
                <Text className="text-2xl text-text">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {moreLinks.map((link) => (
                <TouchableOpacity
                  key={link.screen}   /* ✅ key present */
                  className="py-3 border-b border-border"
                  onPress={() => {
                    setMoreVisible(false);
                    nav.navigate(link.screen);
                  }}
                >
                  <Text className="text-base text-text">{link.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}