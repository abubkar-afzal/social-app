import React from 'react';
import { Text } from 'react-native';
import InfoScreenLayout from './InfoScreenLayout';

export default function TermsScreen() {
  return (
    <InfoScreenLayout title="Terms of Service" subtitle="Last updated: October 5, 2026">
      <Text className="text-lg font-semibold text-text mt-2 mb-2">1. Acceptance</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        By using AR Media, you agree to be bound by these Terms. If you do not agree, you must
        not use the Platform.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">2. Eligibility</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        You must be at least 13 years old to use the Platform.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">3. User Accounts</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        • You must sign in with a valid Google account{'\n'}
        • You are responsible for all activity under your account{'\n'}
        • You must not share your account or impersonate others
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">4. User Content</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        You retain ownership of all content you upload. By uploading, you grant AR Media a
        worldwide, non-exclusive, royalty-free license to store, display, and distribute your
        content.{'\n\n'}
        You agree NOT to upload content that:{'\n'}
        • Infringes copyright{'\n'}
        • Contains hate speech, harassment, or threats{'\n'}
        • Depicts violence, sexual content, or illegal activity{'\n'}
        • Contains malware{'\n'}
        • Violates any applicable law
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">5. Content Moderation</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        We may remove content that violates these Terms. Repeated violations may result in
        account suspension.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">6. Acceptable Use</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        • No illegal use{'\n'}
        • No unauthorized access attempts{'\n'}
        • No scraping or overloading{'\n'}
        • No interference with other users
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">7. Termination</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        We may suspend or terminate your account for conduct that violates these Terms.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">8. Disclaimers</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        The Platform is provided "as is" without warranties of any kind.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">9. Limitation of Liability</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        AR Media shall not be liable for any indirect, incidental, or consequential damages.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">10. Governing Law</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        These Terms are governed by the laws of Pakistan.
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">11. Contact</Text>
      <Text className="text-sm text-text-secondary leading-6">
        legal@armedia.app
      </Text>
    </InfoScreenLayout>
  );
}