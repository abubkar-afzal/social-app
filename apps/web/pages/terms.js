import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
 
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-2">Terms of Service</h1>
        <p className="text-text-secondary mb-8">Last updated: October 5, 2026</p>

        <div className="prose max-w-none text-text-secondary space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using armedia ("the Platform"), you agree to be bound by these Terms
              of Service. If you do not agree with any part of these terms, you must not use the
              Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">2. Eligibility</h2>
            <p>
              You must be at least 13 years old to use the Platform. By using armedia, you
              represent that you meet this requirement and have the legal capacity to enter into
              these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>You must sign in with a valid Google account</li>
              <li>You are responsible for all activity that occurs under your account</li>
              <li>You must not share your account or impersonate others</li>
              <li>You must provide accurate information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">4. User Content</h2>
            <p>
              You retain ownership of all content you upload ("User Content"). By uploading content,
              you grant armedia a worldwide, non-exclusive, royalty-free license to store, display,
              and distribute your content on the Platform.
            </p>
            <p className="mt-3">You agree NOT to upload content that:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Infringes on any copyright, trademark, or other intellectual property</li>
              <li>Contains hate speech, harassment, or threats</li>
              <li>Depicts violence, sexual content, or illegal activity</li>
              <li>Contains malware, viruses, or harmful code</li>
              <li>Violates any applicable law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">5. Content Moderation</h2>
            <p>
              We reserve the right to remove any content that violates these Terms without prior
              notice. Repeated violations may result in account suspension or termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">6. Copyright Policy</h2>
            <p>
              We respect copyright. If you believe your work has been copied in a way that
              constitutes copyright infringement, contact us at
              <a href="mailto:copyright@armedia.com" className="text-primary hover:underline ml-1">
                copyright@armedia.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">7. Acceptable Use</h2>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Use the Platform for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape or overload the Platform</li>
              <li>Interfere with other users' enjoyment of the Platform</li>
              <li>Upload files that exceed size limits or abuse storage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">8. Termination</h2>
            <p>
              We may suspend or terminate your account at any time, with or without notice, for
              conduct that violates these Terms or harms the Platform or other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">9. Disclaimers</h2>
            <p>
              The Platform is provided "as is" and "as available" without warranties of any kind.
              We do not guarantee that the Platform will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, armedia shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of
              the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Pakistan, without regard to conflict of law
              principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">12. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the Platform after changes
              constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text mt-8 mb-3">13. Contact</h2>
            <p>
              Questions about these Terms? Contact us at:
              <br />
              <a href="mailto:legal@armedia.com" className="text-primary hover:underline">
                legal@armedia.com
              </a>
            </p>
          </section>
        </div>
      </main>

    </div>
  );
}