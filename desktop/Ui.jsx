import React from 'react';
import DesktopNavbar from '../packages/ui/src/components/desktop/Navbar';
import DesktopHero from '../packages/ui/src/components/desktop/Hero';
import DesktopFooter from '../packages/ui/src/components/desktop/Footer';
export default function Home() {
  return (
    <>
    <DesktopNavbar/>
    <DesktopHero/>
    <DesktopFooter/>
    </>
  );
}
