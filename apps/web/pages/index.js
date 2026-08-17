import React from 'react';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import Hero from '../../../packages/ui/src/components/web/Hero';
import MediaCard from '../../../packages/ui/src/components/web/MediaCard';
import Footer from '../../../packages/ui/src/components/web/Footer';

export default function Home() {
  const mediaFeed = [
    { id: '1', type: 'video', title: 'Amazing Nature', color: '#ff6b9d' },
    { id: '2', type: 'photo', title: 'City Lights', color: '#10b981' },
    { id: '3', type: 'audio', title: 'Chill Beats', color: '#f59e0b' },
    { id: '4', type: 'photo', title: 'Mountain View', color: '#3b82f6' },
    { id: '5', type: 'video', title: 'Cooking Tutorial', color: '#8b5cf6' },
    { id: '6', type: 'photo', title: 'Abstract Art', color: '#ef4444' },
  ];

  return (
    <>
      <Navbar />
      <Hero />
      {/* Display a grid of media cards */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFeed.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}