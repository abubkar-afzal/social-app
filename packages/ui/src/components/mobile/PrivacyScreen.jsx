import React from 'react';
import { Text } from 'react-native';
import InfoScreenLayout from './InfoScreenLayout';

export default function PrivacyScreen() {
  return (
    <InfoScreenLayout title="Privacy Policy" subtitle="Last updated: October 5, 2026">
      <Text className="text-lg font-semibold text-text mt-2 mb-2">1. Introduction</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        AR Media respects your privacy and is committed to protecting your personal data. This
        policy explains how we collect, use, and safeguard your information.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">2. Information We Collect</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        • Account: Name, email, and profile picture from Google{'\n'}
        • Content: Media files, titles, descriptions, comments{'\n'}
        • Usage: Posts viewed, liked, favorited, and interactions{'\n'}
        • Technical: IP address, browser type, device information
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">3. How We Use Your Information</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        • Provide, operate, and maintain the platform{'\n'}
        • Authenticate your identity and secure your account{'\n'}
        • Store and display your uploaded content{'\n'}
        • Enable social interactions{'\n'}
        • Improve the platform and develop new features
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">4. Media Storage</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        Media files you upload are stored on a shared Google Drive account owned by AR Media.
        Files are made publicly readable. Only metadata is stored on our servers. You retain
        ownership of your content.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">5. Sharing Your Information</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        We do not sell your personal information. We may share data with Google (auth/storage),
        service providers (hosting/database), and legal authorities when required by law.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">6. Your Rights</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        • Access, update, or delete your personal information{'\n'}
        • Delete any content you have uploaded{'\n'}
        • Withdraw consent at any time{'\n'}
        • Export your data
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">7. Data Security</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        We implement HTTPS, hashed credentials, and access controls. No method of transmission
        over the internet is 100% secure.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">8. Children's Privacy</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        Our platform is not intended for users under 13 years of age.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">9. Contact</Text>
      <Text className="text-sm text-text-secondary leading-6">
        privacy@armedia.app
      </Text>
    </InfoScreenLayout>
  );
}