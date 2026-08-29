import React from 'react';

export default function Press() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-6">Press</h1>
        <p className="text-lg text-text-secondary mb-8">Media resources and contact information.</p>
        <div className="bg-surface p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-text mb-4">Press Contact</h2>
          <p className="text-text-secondary">Email: press@pinshare.com</p>
          <p className="text-text-secondary">Phone: +1 (555) 123-4567</p>
        </div>
      </main>
    </div>
  );
}