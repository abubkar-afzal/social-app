import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import DesktopNavbar from '../../packages/ui/src/components/desktop/Navbar';
import DesktopHero from '../../packages/ui/src/components/desktop/Hero';
import DesktopVideoGrid from '../../packages/ui/src/components/desktop/VideoGrid';
import DesktopPhotoGrid from '../../packages/ui/src/components/desktop/PhotoGrid';
import DesktopAudioGrid from '../../packages/ui/src/components/desktop/AudioGrid';
import DesktopMediaDetail from '../../packages/ui/src/components/desktop/MediaDetail';
import DesktopLogin from '../../packages/ui/src/components/desktop/LoginPage';
import DesktopAccount from '../../packages/ui/src/components/desktop/AccountPage';
import DesktopUploadMedia from '../../packages/ui/src/components/desktop/UploadMediaPage';
import DesktopFavoritesGrid from '../../packages/ui/src/components/desktop/FavoritesGrid';
import DesktopFooter from '../../packages/ui/src/components/desktop/Footer';

import DesktopAboutPage from '../../packages/ui/src/components/desktop/AboutPage';
import DesktopCareersPage from '../../packages/ui/src/components/desktop/CareersPage';
import DesktopPressPage from '../../packages/ui/src/components/desktop/PressPage';
import DesktopBlogPage from '../../packages/ui/src/components/desktop/BlogPage';
import DesktopHelpPage from '../../packages/ui/src/components/desktop/HelpPage';
import DesktopGuidelinesPage from '../../packages/ui/src/components/desktop/GuidelinesPage';
import DesktopPrivacyPage from '../../packages/ui/src/components/desktop/PrivacyPage';
import DesktopTermsPage from '../../packages/ui/src/components/desktop/TermsPage';
import DesktopSettingsPage from '../../packages/ui/src/components/desktop/SettingsPage';

export default function App() {
  const img = `../build/my_logo_remove.png`;
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <DesktopNavbar img={img}/>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DesktopHero />} />
            <Route path="/videos" element={<DesktopVideoGrid />} />
            <Route path="/photos" element={<DesktopPhotoGrid />} />
            <Route path="/audio" element={<DesktopAudioGrid />} />
            <Route path="/media/:id" element={<DesktopMediaDetail />} />
            <Route path="/login" element={<DesktopLogin />} />
            <Route path="/account" element={<DesktopAccount />} />
            <Route path="/uploadmedia" element={<DesktopUploadMedia />} />
            <Route path="/favorites" element={<DesktopFavoritesGrid />} />

            <Route path="/about" element={<DesktopAboutPage />} />
            <Route path="/careers" element={<DesktopCareersPage />} />
            <Route path="/press" element={<DesktopPressPage />} />
            <Route path="/blog" element={<DesktopBlogPage />} />
            <Route path="/help" element={<DesktopHelpPage />} />
            <Route path="/guidelines" element={<DesktopGuidelinesPage />} /><Route path="/settings" element={<DesktopSettingsPage />} />

            <Route path="/privacy" element={<DesktopPrivacyPage />} />
            <Route path="/terms" element={<DesktopTermsPage />} />
          </Routes>
        </main>
        <DesktopFooter />
      </div>
    </Router>
  );
}