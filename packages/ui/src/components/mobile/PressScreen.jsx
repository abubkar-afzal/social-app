import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import InfoScreenLayout from './InfoScreenLayout';

export default function PressScreen() {
  return (
    <InfoScreenLayout title="Press" subtitle="Media resources for journalists.">
      <View className="bg-surface rounded-xl p-4 mb-4">
        <Text className="text-base font-semibold text-text mb-3">Press Contact</Text>
        <Text className="text-sm text-text-secondary mb-2">For press inquiries:</Text>
        <Text className="text-sm text-primary mb-1">press@armedia.app</Text>
        <Text className="text-sm text-text font-mono">+92 (300) 123-4567</Text>
      </View>

      <View className="bg-surface rounded-xl p-4 mb-4">
        <Text className="text-base font-semibold text-text mb-3">Brand Assets</Text>
        <TouchableOpacity className="bg-primary py-3 rounded-full mb-2">
          <Text className="text-white text-center font-medium">Download Logo (PNG)</Text>
        </TouchableOpacity>
        <TouchableOpacity className="border border-border py-3 rounded-full">
          <Text className="text-text text-center font-medium">Download Brand Guide (PDF)</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-semibold text-text mb-2">Recent News</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-1">• 1M+ monthly active users (Oct 2026)</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-1">• Audio sharing now live (Sep 2026)</Text>
      <Text className="text-sm text-text-secondary leading-6">• Seed round closed (Jul 2026)</Text>
    </InfoScreenLayout>
  );
}