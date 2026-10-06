import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMobileAuth } from './useMobileAuth';

export default function MobileNavbar() {
  const [search, setSearch] = useState('');
  const [moreVisible, setMoreVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useMobileAuth();

  const tabs = [
    { label: 'Home', icon: '🏠', screen: 'Home' },
    { label: 'Videos', icon: '🎬', screen: 'Videos' },
    { label: 'Photos', icon: '🖼️', screen: 'Photos' },
    { label: 'Audio', icon: '🎵', screen: 'Audio' },
    { label: 'Account', icon: '👤', screen: 'Account' },
  ];

//   const moreLinks = [
//   { label: 'About', href: '/about' },
//   { label: 'Careers', href: '/careers' },
//   { label: 'Press', href: '/press' },
//   { label: 'Blog', href: '/blog' },
//   { label: 'Help Center', href: '/help' },
//   { label: 'Guidelines', href: '/guidelines' },
//   { label: 'Privacy Policy', href: '/privacy' },
//   { label: 'Terms of Service', href: '/terms' },
// ];

  const handleTabPress = (screen) => {
    const tabScreens = tabs.map((t) => t.screen);
    if (tabScreens.includes(route.name)) {
      navigation.navigate(screen);
    } else {
      navigation.navigate('Main', { screen });
    }
  };

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
        <TouchableOpacity onPress={() => navigation.navigate('Home')} className="p-2">
          <Text className="text-2xl">🏠</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primary">AR Media</Text>
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
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.screen}
            onPress={() => handleTabPress(tab.screen)}
            className="items-center"
          >
            <Text className="text-2xl">{tab.icon}</Text>
            <Text className="text-xs text-text-secondary">{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View> */}

      {/* More Modal */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={moreVisible}
        onRequestClose={() => setMoreVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end"
          activeOpacity={1}
          onPress={() => setMoreVisible(false)}
        >
          <View className="bg-surface rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Menu</Text>
              <TouchableOpacity onPress={() => setMoreVisible(false)}>
                <Text className="text-2xl">✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {moreLinks.map((link) => (
                <TouchableOpacity
                  key={link.label}
                  className="py-3 border-b border-border"
                  onPress={() => {
                    setMoreVisible(false);
                    navigation.navigate(link.screen);
                  }}
                >
                  <Text className="text-base text-text">{link.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal> */}
    </View>
  );
}