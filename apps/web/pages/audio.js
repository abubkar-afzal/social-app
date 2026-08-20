import React from 'react';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import AudioGrid from '../../../packages/ui/src/components/web/AudioGrid';
import Footer from '../../../packages/ui/src/components/web/Footer';

export default function AudioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AudioGrid />
      </main>
      <Footer />
    </div>
  );
}