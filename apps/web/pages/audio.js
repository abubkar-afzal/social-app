import React from 'react';
import AudioGrid from '../../../packages/ui/src/components/web/AudioGrid';

export default function AudioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <AudioGrid />
      </main>
    </div>
  );
}