import React from 'react';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import Hero from '../../../packages/ui/src/components/web/Hero';
import Footer from '../../../packages/ui/src/components/web/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}