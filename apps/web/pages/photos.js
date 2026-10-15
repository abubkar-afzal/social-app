import React from 'react';
import PhotoGrid from '../../../packages/ui/src/components/web/PhotoGrid';
import SEO from '@/components/SEO';

export default function PhotosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
  title="Photos"
  description="Browse stunning photos: nature, art, travel, food, and lifestyle."
  keywords="photos, photography, images, pictures"
  url="/photos"
/>
      <main className="flex-1">
        <PhotoGrid />
      </main>
    </div>
  );
}