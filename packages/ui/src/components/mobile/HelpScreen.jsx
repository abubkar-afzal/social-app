import React from 'react';
import { View, Text } from 'react-native';
import InfoScreenLayout from './InfoScreenLayout';

const FAQ = [
  { q: 'How do I upload content?', a: 'Tap "Create" in the navigation bar and select your media files.' },
  { q: 'How do I report content?', a: 'Use the "Report" option on any media page.' },
  { q: 'Can I delete my uploads?', a: 'Yes — go to Account, find the post, and tap the delete icon.' },
  { q: 'How do I change my picture?', a: 'Go to Account → Edit Profile → tap the pencil icon.' },
  { q: 'Is AR Media free?', a: 'Yes. Uploading, viewing, and sharing are free.' },
  { q: 'How do I contact support?', a: 'Email hafizabubakarafzal@gmail.com. We reply within 1–2 days.' },
];

export default function HelpScreen() {
  return (
    <InfoScreenLayout title="Help Center" subtitle="Answers to common questions.">
      {FAQ.map((item, i) => (
        <View key={i} className="bg-surface rounded-xl p-4 mb-3">
          <Text className="text-base font-semibold text-text mb-2">{item.q}</Text>
          <Text className="text-sm text-text-secondary">{item.a}</Text>
        </View>
      ))}
    </InfoScreenLayout>
  );
}