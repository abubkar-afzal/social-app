import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import InfoScreenLayout from './InfoScreenLayout';

const POSTS = [
  { id: 1, title: '10 Tips for Better Photography', excerpt: 'Learn how to capture stunning photos with your phone.', date: 'Oct 12, 2026', tag: 'Photography' },
  { id: 2, title: 'The Future of Video Sharing', excerpt: 'Trends shaping video content over the next decade.', date: 'Oct 5, 2026', tag: 'Video' },
  { id: 3, title: 'Audio Storytelling is Back', excerpt: 'Why audio is making a comeback in social media.', date: 'Sep 28, 2026', tag: 'Audio' },
  { id: 4, title: 'Building a Creator Community', excerpt: 'Strategies for growing an engaged audience.', date: 'Sep 20, 2026', tag: 'Community' },
];

export default function BlogScreen() {
  return (
    <InfoScreenLayout title="Blog" subtitle="Stories and updates from the AR Media team.">
      {POSTS.map((post) => (
        <View key={post.id} className="bg-surface rounded-xl p-4 mb-3">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {post.tag}
            </Text>
            <Text className="text-xs text-text-secondary">{post.date}</Text>
          </View>
          <Text className="text-base font-semibold text-text mb-1">{post.title}</Text>
          <Text className="text-sm text-text-secondary mb-2">{post.excerpt}</Text>
          <TouchableOpacity>
            <Text className="text-primary text-sm font-medium">Read more →</Text>
          </TouchableOpacity>
        </View>
      ))}
    </InfoScreenLayout>
  );
}