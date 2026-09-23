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
import AboutPage from '../../packages/ui/src/components/desktop/AboutPage';
import CareersPage from '../../packages/ui/src/components/desktop/CareersPage';
import PressPage from '../../packages/ui/src/components/desktop/PressPage';
import BlogPage from '../../packages/ui/src/components/desktop/BlogPage';
import HelpPage from '../../packages/ui/src/components/desktop/HelpPage';
import GuidelinesPage from '../../packages/ui/src/components/desktop/GuidelinesPage';
import { setApiBaseUrl } from '../../packages/ui/src/utils/apiConfig';

setApiBaseUrl('http://localhost:3000'); // Replace with your actual API base URL

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
            <Route path="/about" element={<AboutPage />} />
<Route path="/careers" element={<CareersPage />} />
<Route path="/press" element={<PressPage />} />
<Route path="/blog" element={<BlogPage />} />
<Route path="/help" element={<HelpPage />} />
<Route path="/guidelines" element={<GuidelinesPage />} />
<Route path="/uploadmedia" element={<DesktopUploadMedia />} />
          </Routes>
        </main>
        <DesktopFooter />
      </div>
    </Router>
  );
}