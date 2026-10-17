import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MobileNavbar from './Navbar';
import MobileFooter from './Footer';

/**
 * Reusable layout for all info pages (About, Privacy, etc.).
 * Renders: Navbar → Back button → Title + content → Footer.
 */
export default function InfoScreenLayout({ title, subtitle, children }) {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => navigation.goBack()} className="py-2">
            <Text className="text-primary text-base font-medium">← Back</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 pb-6">
          <Text className="text-2xl font-bold text-text mb-1">{title}</Text>
          {subtitle ? (
            <Text className="text-sm text-text-secondary mb-4">{subtitle}</Text>
          ) : null}
          {children}
        </View>
      </ScrollView>
    </View>
  );
}