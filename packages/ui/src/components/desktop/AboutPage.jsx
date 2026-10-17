import React from 'react';

export default function DesktopAboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-4">About AR Media</h1>
        <p className="text-lg text-text-secondary mb-8">
          AR Media is a platform for discovering and sharing beautiful videos, photos, and audio.
          Our mission is to inspire creativity and connect people through visual storytelling.
        </p>

        <h2 className="text-2xl font-semibold text-text mt-8 mb-3">Our Story</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Started as a small project by a group of friends who loved collecting ideas, AR Media
          has evolved into a vibrant community. We believe everyone has something worth sharing.
        </p>

        <h2 className="text-2xl font-semibold text-text mt-8 mb-3">What We Do</h2>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-6">
          <li>Provide a platform for creators to share videos, photos, and audio</li>
          <li>Connect people with content they'll love</li>
          <li>Support creators with a clean, distraction-free experience</li>
        </ul>

        <h2 className="text-2xl font-semibold text-text mt-8 mb-3">Our Values</h2>
        <p className="text-text-secondary leading-relaxed">
          We believe in openness, creativity, and respect. Every contribution matters, and every
          creator deserves to be seen.
        </p>
      </main>
      
    </div>
  );
}