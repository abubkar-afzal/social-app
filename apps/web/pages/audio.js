import React from 'react';
import AudioGrid from '../../../packages/ui/src/components/web/AudioGrid';
import SEO from '@/components/SEO';

export default function AudioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
  title="Audio"
  description="Listen to music, podcasts, and audio tracks shared by the community."
  keywords="audio, music, podcasts, sound"
  url="/audio"
/>
      <main className="flex-1">
        <AudioGrid />
      </main>
    </div>
  );
}