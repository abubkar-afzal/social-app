import './global.css';
import React from 'react';
import { View } from 'react-native';
import MobileNavbar from '../../packages/ui/src/components/mobile/Navbar';
import MobileHero from '../../packages/ui/src/components/mobile/Hero';
import MobileMediaCard from '../../packages/ui/src/components/mobile/MediaCard';
import MobileFooter from '../../packages/ui/src/components/mobile/Footer';

const mediaFeed = [
  { id: '1', type: 'video', title: 'Amazing Nature', color: '#ff6b9d' },
  { id: '2', type: 'photo', title: 'City Lights', color: '#10b981' },
  { id: '3', type: 'audio', title: 'Chill Beats', color: '#f59e0b' },
  { id: '4', type: 'photo', title: 'Mountain View', color: '#3b82f6' },
  { id: '5', type: 'video', title: 'Cooking Tutorial', color: '#8b5cf6' },
  { id: '6', type: 'photo', title: 'Abstract Art', color: '#ef4444' },
];

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar />
      <MobileHero />

      {/* Main scrollable feed */}
      <View style={{ flex: 1 }}>
        <MobileMediaCard media={mediaFeed} />
      </View>

      <MobileFooter />
    </View>
  );
}