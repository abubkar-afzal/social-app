import React from 'react';
import { Text, View } from 'react-native';
import InfoScreenLayout from './InfoScreenLayout';

export default function AboutScreen() {
  return (
    <InfoScreenLayout
      title="About AR Media"
      subtitle="Discover, share, and inspire."
    >
      <View className="mb-6">
        <Text className="text-base text-text-secondary leading-6">
          AR Media is a platform for discovering and sharing beautiful videos, photos, and audio.
          Our mission is to inspire creativity and connect people through visual storytelling.
        </Text>
      </View>

      <Text className="text-lg font-semibold text-text mt-4 mb-2">Our Story</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        Started as a small project by a group of friends who loved collecting ideas, AR Media has
        evolved into a vibrant community. We believe everyone has something worth sharing.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">What We Do</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-2">
        • Provide a platform for creators to share videos, photos, and audio
      </Text>
      <Text className="text-sm text-text-secondary leading-6 mb-2">
        • Connect people with content they'll love
      </Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        • Support creators with a clean, distraction-free experience
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">Our Values</Text>
      <Text className="text-sm text-text-secondary leading-6">
        We believe in openness, creativity, and respect. Every contribution matters, and every
        creator deserves to be seen.
      </Text>
    </InfoScreenLayout>
  );
}