import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function PressScreen() {
  return (
    <ScrollView className="flex-1 bg-background p-6">
      <Text className="text-3xl font-bold text-text mb-4">About PinShare</Text>
      <Text className="text-text-secondary text-lg">PinShare is a platform for discovering and sharing beautiful videos, photos, and audio.</Text>
    </ScrollView>
  );
}