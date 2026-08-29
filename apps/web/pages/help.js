import React from 'react';

export default function HelpCenter() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-6">Help Center</h1>
        <div className="space-y-4">
          <div className="bg-surface p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-text">How do I upload content?</h2>
            <p className="text-text-secondary mt-2">Click the "Create" button in the navigation bar and select your media files.</p>
          </div>
          <div className="bg-surface p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-text">How do I report inappropriate content?</h2>
            <p className="text-text-secondary mt-2">Use the "Report" button on any media page or contact support.</p>
          </div>
        </div>
      </main>
    </div>
  );
}