import React from 'react';
import VideoGrid from '../../../packages/ui/src/components/web/VideoGrid';
import SEO from '@/components/SEO';


export default function VideosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
  title="Videos"
  description="Watch short-form videos from creators. Discover trending clips, tutorials, and entertainment."
  keywords="videos, short videos, watch videos, video sharing"
  url="/videos"
/>
      <main className="flex-1">
        <VideoGrid />
      </main>
    </div>
  );
}