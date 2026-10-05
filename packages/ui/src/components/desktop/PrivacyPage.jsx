import React from 'react';

export default function DesktopPrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold text-text mb-2">Privacy Policy</h1>
      <p className="text-text-secondary mb-8">Last updated: October 5, 2026</p>

      <div className="prose max-w-none text-text-secondary space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-3">1. Introduction</h2>
          <p>
            Welcome to PinShare ("we", "our", "us"). We respect your privacy and are committed to
            protecting your personal data. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-3">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Account Information:</strong> Name, email, and profile picture from Google.</li>
            <li><strong>Content:</strong> Media files, titles, descriptions, and comments.</li>
            <li><strong>Usage Data:</strong> Posts viewed, liked, favorited, and interactions.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Provide, operate, and maintain the platform</li>
            <li>Authenticate your identity and secure your account</li>
            <li>Store and display your uploaded content</li>
            <li>Enable social interactions (likes, favorites, follows, comments)</li>
            <li>Improve the platform and develop new features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-3">4. Media Storage</h2>
          <p>
            Media files you upload are stored on a shared Google Drive account owned and operated
            by PinShare. Files are made publicly readable. Only metadata (titles, descriptions,
            uploader info) is stored on our servers. You retain ownership of your content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-3">5. Sharing Your Information</h2>
          <p>We do not sell your personal information. We may share data with Google (auth/storage),
            service providers (hosting/database), and legal authorities when required by law.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-3">6. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Access, update, or delete your personal information</li>
            <li>Delete any content you have uploaded</li>
            <li>Withdraw consent at any time</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-3">7. Data Security</h2>
          <p>
            We implement industry-standard security measures: HTTPS, hashed credentials, and access
            controls. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-3">8. Children's Privacy</h2>
          <p>Our platform is not intended for users under 13 years of age.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-3">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted here.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-3">10. Contact Us</h2>
          <p>
            For questions, contact:
            <a href="mailto:privacy@pinshare.com" className="text-primary hover:underline ml-1">
              privacy@pinshare.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}