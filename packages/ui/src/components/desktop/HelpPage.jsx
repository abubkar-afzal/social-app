import React from 'react';

const FAQ = [
  { q: 'How do I upload content?', a: 'Click the "Create" button in the navigation bar and select your media files. You can upload photos, videos, and audio.' },
  { q: 'How do I report inappropriate content?', a: 'Use the "Report" option on any media page or contact our support team. We review all reports within 24 hours.' },
  { q: 'Can I delete my uploads?', a: 'Yes. Go to your Account page, find the post you want to remove, and click the delete icon.' },
  { q: 'How do I change my profile picture?', a: 'Go to your Account, click "Edit Profile", then click the pencil icon next to your avatar.' },
  { q: 'Is AR Media free to use?', a: 'Yes. All core features including uploading, viewing, and sharing are free.' },
  { q: 'How do I contact support?', a: 'Email us at support@armedia.app. We typically respond within 1–2 business days.' },
];

export default function DesktopHelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-2">Help Center</h1>
        <p className="text-lg text-text-secondary mb-8">
          Answers to common questions. Still stuck? Email{' '}
          <a href="mailto:support@armedia.app" className="text-primary hover:underline">
            support@armedia.app
          </a>
          .
        </p>

        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-surface p-5 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-text mb-2">{item.q}</h2>
              <p className="text-base text-text-secondary">{item.a}</p>
            </div>
          ))}
        </div>
      </main>
      
    </div>
  );
}