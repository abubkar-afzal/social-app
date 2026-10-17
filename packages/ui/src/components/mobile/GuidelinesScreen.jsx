import React from 'react';
import { Text } from 'react-native';
import InfoScreenLayout from './InfoScreenLayout';

export default function GuidelinesScreen() {
  return (
    <InfoScreenLayout title="Community Guidelines" subtitle="Help keep AR Media safe and inspiring.">
      <Text className="text-lg font-semibold text-text mt-2 mb-2">Be Respectful</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        • Treat others with kindness and respect{'\n'}
        • No hate speech, harassment, or threats{'\n'}
        • No discrimination based on race, gender, religion, or identity
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">Share Responsibly</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        • Only post content you own or have permission to share{'\n'}
        • Give credit where it's due{'\n'}
        • No copyrighted material without permission
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">Keep It Appropriate</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        • No explicit or graphic content{'\n'}
        • No violence or gore{'\n'}
        • No content that promotes illegal activity
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">No Spam or Manipulation</Text>
      <Text className="text-sm text-text-secondary leading-6 mb-6">
        • No repetitive or misleading content{'\n'}
        • No bots to inflate engagement{'\n'}
        • No impersonation of other users or brands
      </Text>

      <Text className="text-lg font-semibold text-text mb-2">Enforcement</Text>
      <Text className="text-sm text-text-secondary leading-6">
        Violations may result in content removal, warnings, suspension, or account termination
        depending on severity.
      </Text>
    </InfoScreenLayout>
  );
}