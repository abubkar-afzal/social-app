import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TermsScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-background">
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
        <Text className="text-primary text-lg">← Back</Text>
      </TouchableOpacity>

      <View className="px-6 pb-10">
        <Text className="text-3xl font-bold text-text mb-2">Terms of Service</Text>
        <Text className="text-text-secondary mb-6">Last updated: October 5, 2026</Text>

        <View className="space-y-6">
          <View>
            <Text className="text-xl font-semibold text-text mb-2">1. Acceptance of Terms</Text>
            <Text className="text-text-secondary leading-6">
              By accessing or using armedia, you agree to be bound by these Terms. If you do not
              agree, you must not use the Platform.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">2. Eligibility</Text>
            <Text className="text-text-secondary leading-6">
              You must be at least 13 years old to use the Platform.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">3. User Accounts</Text>
            <Text className="text-text-secondary leading-6">
              • You must sign in with a valid Google account{'\n'}
              • You are responsible for all activity under your account{'\n'}
              • You must not share your account or impersonate others
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">4. User Content</Text>
            <Text className="text-text-secondary leading-6">
              You retain ownership of all content you upload. By uploading, you grant armedia a
              worldwide, non-exclusive, royalty-free license to store, display, and distribute your
              content on the Platform.{'\n\n'}
              You agree NOT to upload content that infringes copyright, contains hate speech,
              depicts violence or illegal activity, contains malware, or violates any applicable
              law.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">5. Content Moderation</Text>
            <Text className="text-text-secondary leading-6">
              We reserve the right to remove any content that violates these Terms. Repeated
              violations may result in account suspension.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">6. Acceptable Use</Text>
            <Text className="text-text-secondary leading-6">
              You agree NOT to:{'\n'}
              • Use the Platform for any illegal purpose{'\n'}
              • Attempt to gain unauthorized access{'\n'}
              • Use automated tools to scrape the Platform{'\n'}
              • Interfere with other users' enjoyment
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">7. Termination</Text>
            <Text className="text-text-secondary leading-6">
              We may suspend or terminate your account at any time for conduct that violates these
              Terms or harms the Platform.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">8. Disclaimers</Text>
            <Text className="text-text-secondary leading-6">
              The Platform is provided "as is" without warranties of any kind. We do not guarantee
              uninterrupted or error-free service.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">9. Limitation of Liability</Text>
            <Text className="text-text-secondary leading-6">
              To the maximum extent permitted by law, armedia shall not be liable for any indirect,
              incidental, or consequential damages.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">10. Governing Law</Text>
            <Text className="text-text-secondary leading-6">
              These Terms are governed by the laws of Pakistan.
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold text-text mb-2">11. Contact</Text>
            <Text className="text-text-secondary leading-6">
              Questions? Contact us at legal@armedia.com
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}