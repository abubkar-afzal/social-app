import React from 'react';
import PhotoGrid from '../../../packages/ui/src/components/web/PhotoGrid';

export default function PhotosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <PhotoGrid />
      </main>
    </div>
  );
}