import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PrivacyScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-background">
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
        <Text className="text-primary text-lg">← Back</Text>
      </TouchableOpacity>

      <View className="px-6 pb-10">
        <Text className="text-3xl font-bold text-text mb-2">Privacy Policy</Text>
        <Text className="text-text-secondary mb-6">Last updated: October 5, 2026</Text>

        <View className="space-y-6">
          <View>
            <Text className="text-xl font-semibold text-text mb-2">1. Introduction</Text>
            <Text className="text-text-secondary leading-6">
              Welcome to PinShare. We respect your privacy and are committed to protecting your
              personal data. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our platform.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">2. Information We Collect</Text>
            <Text className="text-text-secondary leading-6">
              • Account: Name, email, profile picture from Google.{'\n'}
              • Content: Media files, titles, descriptions, comments.{'\n'}
              • Usage: Posts viewed, liked, favorited, and interactions.{'\n'}
              • Technical: IP address, browser type, device information.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">3. How We Use Your Information</Text>
            <Text className="text-text-secondary leading-6">
              • Provide, operate, and maintain the platform{'\n'}
              • Authenticate your identity{'\n'}
              • Store and display your uploaded content{'\n'}
              • Enable social interactions{'\n'}
              • Improve the platform and develop new features
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">4. Media Storage</Text>
            <Text className="text-text-secondary leading-6">
              Media files you upload are stored on a shared Google Drive account. Files are made
              publicly readable. Only metadata is stored on our servers. You retain ownership of
              your content.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">5. Sharing Your Information</Text>
            <Text className="text-text-secondary leading-6">
              We do not sell your personal information. We may share data with Google (auth and
              storage), service providers (hosting, database), and legal authorities when required
              by law.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">6. Your Rights</Text>
            <Text className="text-text-secondary leading-6">
              • Access, update, or delete your personal information{'\n'}
              • Delete any content you have uploaded{'\n'}
              • Withdraw consent at any time{'\n'}
              • Export your data
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">7. Data Security</Text>
            <Text className="text-text-secondary leading-6">
              We implement industry-standard security measures including HTTPS, hashed credentials,
              and access controls. However, no method of transmission over the internet is 100%
              secure.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">8. Children's Privacy</Text>
            <Text className="text-text-secondary leading-6">
              Our platform is not intended for users under 13 years of age.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">9. Changes to This Policy</Text>
            <Text className="text-text-secondary leading-6">
              We may update this Privacy Policy from time to time. Changes will be posted here.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">10. Contact Us</Text>
            <Text className="text-text-secondary leading-6">
              For questions about this Privacy Policy, contact us at privacy@pinshare.com
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}