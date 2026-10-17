import React from 'react';

export default function DesktopGuidelinesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-4">Community Guidelines</h1>
        <p className="text-lg text-text-secondary mb-8">
          To keep AR Media a safe and inspiring place, please follow these guidelines.
        </p>

        <h2 className="text-2xl font-semibold text-text mb-3">Be Respectful</h2>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-8">
          <li>Treat others with kindness and respect</li>
          <li>No hate speech, harassment, or threats</li>
          <li>No discrimination based on race, gender, religion, or identity</li>
        </ul>

        <h2 className="text-2xl font-semibold text-text mb-3">Share Responsibly</h2>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-8">
          <li>Only post content you own or have permission to share</li>
          <li>Give credit where it's due</li>
          <li>Don't post copyrighted material without permission</li>
        </ul>

        <h2 className="text-2xl font-semibold text-text mb-3">Keep It Appropriate</h2>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-8">
          <li>No explicit or graphic content</li>
          <li>No violence or gore</li>
          <li>No content that promotes illegal activity</li>
        </ul>

        <h2 className="text-2xl font-semibold text-text mb-3">No Spam or Manipulation</h2>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-8">
          <li>Don't post repetitive or misleading content</li>
          <li>Don't use bots to inflate engagement</li>
          <li>Don't impersonate other people or brands</li>
        </ul>

        <h2 className="text-2xl font-semibold text-text mb-3">Enforcement</h2>
        <p className="text-text-secondary leading-relaxed">
          Violations may result in content removal, warnings, temporary suspension, or permanent
          account termination depending on severity.
        </p>
      </main>
      
    </div>
  );
}