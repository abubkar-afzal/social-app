import SEO from '@/components/SEO';
import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
      <SEO title="About" description="Learn about AR Media — a platform for sharing videos, photos, and audio." url="/about" />
      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">About AR Media</h1>
      <p className="text-base sm:text-lg text-text-secondary mb-8">
        AR Media is a platform for discovering and sharing beautiful videos, photos, and audio.
        Our mission is to inspire creativity and connect people through visual storytelling.
      </p>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">Our Story</h2>
        <p className="text-text-secondary leading-relaxed">
          Started as a small project by a group of friends who loved collecting ideas, AR Media
          has evolved into a vibrant community. We believe everyone has something worth sharing,
          and we've built a place where creativity is celebrated.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">What We Do</h2>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary">
          <li>Provide a platform for creators to share videos, photos, and audio</li>
          <li>Connect people with content they'll love</li>
          <li>Support creators with a clean, distraction-free experience</li>
          <li>Build tools that make discovery easy and enjoyable</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold text-text mt-8 mb-3">Our Values</h2>
        <p className="text-text-secondary leading-relaxed">
          We believe in openness, creativity, and respect. Every contribution matters, and every
          creator deserves to be seen. Whether you're posting your first photo or your thousandth
          video, AR Media is a home for your work.
        </p>
      </section>
    </div>
  );
}