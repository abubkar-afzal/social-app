import React from 'react';
import VideoGrid from '../../../packages/ui/src/components/web/VideoGrid';


export default function VideosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <VideoGrid />
      </main>
    </div>
  );
}