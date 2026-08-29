import React from 'react';
import Hero from '../../../packages/ui/src/components/web/Hero';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  );
}