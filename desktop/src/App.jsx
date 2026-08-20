import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesktopNavbar from '../../packages/ui/src/components/desktop/Navbar';
import DesktopHero from '../../packages/ui/src/components/desktop/Hero';
import DesktopVideoGrid from '../../packages/ui/src/components/desktop/VideoGrid';
import DesktopPhotoGrid from '../../packages/ui/src/components/desktop/PhotoGrid';
import DesktopAudioGrid from '../../packages/ui/src/components/desktop/AudioGrid';
import DesktopMediaDetail from '../../packages/ui/src/components/desktop/MediaDetail';
import DesktopLogin from '../../packages/ui/src/components/desktop/LoginPage';
import DesktopAccount from '../../packages/ui/src/components/desktop/AccountPage';
import DesktopFooter from '../../packages/ui/src/components/desktop/Footer';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <DesktopNavbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DesktopHero />} />
            <Route path="/videos" element={<DesktopVideoGrid />} />
            <Route path="/photos" element={<DesktopPhotoGrid />} />
            <Route path="/audio" element={<DesktopAudioGrid />} />
            <Route path="/media/:id" element={<DesktopMediaDetail />} />
            <Route path="/login" element={<DesktopLogin />} />
            <Route path="/account" element={<DesktopAccount />} />
          </Routes>
        </main>
        <DesktopFooter />
      </div>
    </Router>
  );
}