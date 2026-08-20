import React from 'react';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import PhotoGrid from '../../../packages/ui/src/components/web/PhotoGrid';
import Footer from '../../../packages/ui/src/components/web/Footer';

export default function PhotosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PhotoGrid />
      </main>
      <Footer />
    </div>
  );
}