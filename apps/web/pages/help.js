import SEO from '@/components/SEO';
import React from 'react';

const FAQ = [
  {
    q: 'How do I upload content?',
    a: 'Click the "Create" button in the navigation bar and select your media files. You can upload photos, videos, and audio.',
  },
  {
    q: 'How do I report inappropriate content?',
    a: 'Use the "Report" option on any media page or contact our support team. We review all reports within 24 hours.',
  },
  {
    q: 'Can I delete my uploads?',
    a: 'Yes. Go to your Account page, find the post you want to remove, and click the delete icon. Deletion is permanent.',
  },
  {
    q: 'How do I change my profile picture?',
    a: 'Go to your Account, click "Edit Profile", then click the pencil icon next to your avatar to upload a new picture.',
  },
  {
    q: 'Is AR Media free to use?',
    a: 'Yes. All core features including uploading, viewing, and sharing are free. We plan to keep it that way.',
  },
  {
    q: 'How do I contact support?',
    a: 'Email us at hafizabubakarafzal@gmail.com. We typically respond within 1–2 business days.',
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
            <SEO title="Help Center" description="Get help with AR Media." url="/help" />

      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-2">Help Center</h1>
      <p className="text-base sm:text-lg text-text-secondary mb-8">
        Answers to common questions. Still stuck? Email{' '}
        <a href="mailto:hafizabubakarafzal@gmail.com" className="text-primary hover:underline">
          hafizabubakarafzal@gmail.com
        </a>
        .
      </p>

      <div className="space-y-4">
        {FAQ.map((item, i) => (
          <div key={i} className="bg-surface p-5 rounded-xl shadow-md">
            <h2 className="text-base sm:text-lg font-semibold text-text mb-2">{item.q}</h2>
            <p className="text-sm sm:text-base text-text-secondary">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}