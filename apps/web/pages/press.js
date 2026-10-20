import SEO from '@/components/SEO';
import React from 'react';

export default function PressPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
            <SEO title="Press" description="Press resources for AR Media." url="/press" />

      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Press</h1>
      <p className="text-base sm:text-lg text-text-secondary mb-8">
        Media resources, brand assets, and contact information for journalists.
      </p>

      <section className="bg-surface rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-text mb-4">Press Contact</h2>
        <p className="text-text-secondary">
          For press inquiries, interviews, or media requests:
        </p>
        <p className="text-text mt-3">
          Email:{' '}
          <a href="mailto:hafizabubakarafzal@gmail.com" className="text-primary hover:underline">
            hafizabubakarafzal@gmail.com
          </a>
        </p>
        <p className="text-text mt-1">
          Phone: <span className="font-mono">+923270972423</span>
        </p>
      </section>

      <section className="bg-surface rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-text mb-4">Brand Assets</h2>
        <p className="text-text-secondary mb-4">
          Download our official logos, color palettes, and brand guidelines.
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition">
            Download Logo (PNG)
          </button>
          <button className="bg-surface border border-border text-text px-5 py-2 rounded-full text-sm font-medium hover:bg-background transition">
            Download Brand Guide (PDF)
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold text-text mb-3">Recent News</h2>
        <ul className="space-y-3 text-text-secondary">
          <li>• AR Media crosses 1 million monthly active users (Oct 2026)</li>
          <li>• Introducing audio sharing — now live for everyone (Sep 2026)</li>
          <li>• AR Media raises seed round to expand creator tools (Jul 2026)</li>
        </ul>
      </section>
    </div>
  );
}