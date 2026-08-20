import React from 'react';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import VideoGrid from '../../../packages/ui/src/components/web/VideoGrid';
import Footer from '../../../packages/ui/src/components/web/Footer';

export default function VideosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <VideoGrid />
      </main>
      <Footer />
    </div>
  );
}