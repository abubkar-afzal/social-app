import React from 'react';

export default function Guidelines() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-6">Community Guidelines</h1>
        <div className="prose max-w-none text-text-secondary space-y-4">
          <p>Welcome to AR Media! To keep our community safe and inspiring, please follow these guidelines:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Respect others and their content.</li>
            <li>Don't post copyrighted material without permission.</li>
            <li>No hate speech or harassment.</li>
            <li>Keep it family-friendly.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}