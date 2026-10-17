import React from 'react';

export default function DesktopPressPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-4">Press</h1>
        <p className="text-lg text-text-secondary mb-8">
          Media resources, brand assets, and contact information for journalists.
        </p>

        <div className="bg-surface rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-text mb-4">Press Contact</h2>
          <p className="text-text-secondary">For press inquiries, interviews, or media requests:</p>
          <p className="text-text mt-3">
            Email:{' '}
            <a href="mailto:press@armedia.app" className="text-primary hover:underline">
              press@armedia.app
            </a>
          </p>
          <p className="text-text mt-1">
            Phone: <span className="font-mono">+92 (300) 123-4567</span>
          </p>
        </div>

        <div className="bg-surface rounded-xl shadow-md p-6 mb-6">
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
        </div>

        <h2 className="text-2xl font-semibold text-text mb-3">Recent News</h2>
        <ul className="space-y-3 text-text-secondary">
          <li>• AR Media crosses 1 million monthly active users (Oct 2026)</li>
          <li>• Introducing audio sharing — now live for everyone (Sep 2026)</li>
          <li>• AR Media raises seed round to expand creator tools (Jul 2026)</li>
        </ul>
      </main>
      
    </div>
  );
}