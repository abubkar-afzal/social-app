import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function CareersScreen() {
  return (
    <ScrollView className="flex-1 bg-background p-6">
      <Text className="text-3xl font-bold text-text mb-4">Careers at PinShare</Text>
      <Text className="text-text-secondary text-lg">Join our team and help us create the best platform for discovering and sharing beautiful content.</Text>
    </ScrollView>
  );
}