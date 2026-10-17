import SEO from '@/components/SEO';
import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
            <SEO title="Terms of Service" description="AR Media terms of service." url="/terms" />

      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-2">Terms of Service</h1>
      <p className="text-text-secondary mb-8">Last updated: October 5, 2026</p>

      <div className="prose max-w-none text-text-secondary space-y-6">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using AR Media, you agree to be bound by these Terms. If you do not
            agree, you must not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">2. Eligibility</h2>
          <p>You must be at least 13 years old to use the Platform.</p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">3. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>You must sign in with a valid Google account</li>
            <li>You are responsible for all activity under your account</li>
            <li>You must not share your account or impersonate others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">4. User Content</h2>
          <p>
            You retain ownership of all content you upload. By uploading, you grant AR Media a
            worldwide, non-exclusive, royalty-free license to store, display, and distribute your
            content on the Platform.
          </p>
          <p className="mt-3">You agree NOT to upload content that:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Infringes copyright or other intellectual property</li>
            <li>Contains hate speech, harassment, or threats</li>
            <li>Depicts violence, sexual content, or illegal activity</li>
            <li>Contains malware or harmful code</li>
            <li>Violates any applicable law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">5. Content Moderation</h2>
          <p>
            We reserve the right to remove any content that violates these Terms. Repeated
            violations may result in account suspension.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">6. Acceptable Use</h2>
          <p>You agree NOT to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Use the Platform for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use automated tools to scrape or overload the Platform</li>
            <li>Interfere with other users' enjoyment of the Platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">7. Termination</h2>
          <p>
            We may suspend or terminate your account at any time for conduct that violates these
            Terms or harms the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">8. Disclaimers</h2>
          <p>
            The Platform is provided "as is" without warranties of any kind. We do not guarantee
            uninterrupted or error-free service.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, AR Media shall not be liable for any indirect,
            incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">10. Governing Law</h2>
          <p>These Terms are governed by the laws of Pakistan.</p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">11. Contact</h2>
          <p>
            Questions? Contact:
            <a href="mailto:legal@armedia.app" className="text-primary hover:underline ml-1">
              legal@armedia.app
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}