import React from 'react';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import Hero from '../../../packages/ui/src/components/web/Hero';
import MediaCard from '../../../packages/ui/src/components/web/MediaCard';
import Footer from '../../../packages/ui/src/components/web/Footer';
export default function Home() {
  return (
    <>
    <Navbar/>
    <Hero/>
    <MediaCard/>
    <Footer/>
    </>
  );
}
