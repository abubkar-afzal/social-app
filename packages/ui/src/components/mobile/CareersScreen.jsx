import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import InfoScreenLayout from './InfoScreenLayout';

const ROLES = [
  { title: 'Senior Frontend Engineer', location: 'Remote', type: 'Full-time' },
  { title: 'Product Designer', location: 'Remote', type: 'Full-time' },
  { title: 'Backend Engineer (Node.js)', location: 'Remote', type: 'Full-time' },
  { title: 'Community Manager', location: 'Karachi, PK', type: 'Full-time' },
  { title: 'Content Moderator', location: 'Remote', type: 'Part-time' },
];

export default function CareersScreen() {
  return (
    <InfoScreenLayout
      title="Careers"
      subtitle="Join our team and help shape the future of visual discovery."
    >
      {ROLES.map((role) => (
        <View key={role.title} className="bg-surface rounded-xl p-4 mb-3 shadow-md">
          <Text className="text-base font-semibold text-text">{role.title}</Text>
          <Text className="text-xs text-text-secondary mt-1 mb-3">
            {role.location} · {role.type}
          </Text>
          <TouchableOpacity className="bg-primary py-2 rounded-full self-start px-5">
            <Text className="text-white text-sm font-medium">Apply Now</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text className="text-lg font-semibold text-text mt-6 mb-2">Why AR Media?</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-2">• Fully remote team with flexible hours</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-2">• Competitive compensation and equity</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-2">• Health, dental, and vision benefits</Text>
      <Text className="text-sm text-text-secondary leading-6">• Annual learning budget</Text>
    </InfoScreenLayout>
  );
}