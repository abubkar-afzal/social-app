import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-6">About AR Media</h1>
        <div className="prose max-w-none text-text-secondary space-y-4">
          <p className="text-lg">AR Media is a platform for discovering and sharing beautiful videos, photos, and audio. Our mission is to inspire creativity and connect people through visual storytelling.</p>
          <p>Founded in 2024, we've grown to millions of users worldwide who share their passions and find inspiration every day.</p>
          <h2 className="text-2xl font-semibold text-text mt-8">Our Story</h2>
          <p>Started as a small project by a group of friends who loved collecting ideas, AR Media has evolved into a vibrant community. We believe that everyone has something worth sharing.</p>
        </div>
      </main>
    </div>
  );
}