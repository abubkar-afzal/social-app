import { setApiBaseUrl } from '../../packages/ui/src/utils/apiConfig';
setApiBaseUrl('http://192.168.0.102:3000');
import './global.css';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

import MobileNavbar from '../../packages/ui/src/components/mobile/Navbar';
import MobileHero from '../../packages/ui/src/components/mobile/Hero';
import MobileVideoGrid from '../../packages/ui/src/components/mobile/VideoGrid';
import MobilePhotoGrid from '../../packages/ui/src/components/mobile/PhotoGrid';
import MobileAudioGrid from '../../packages/ui/src/components/mobile/AudioGrid';
import MobileMediaDetail from '../../packages/ui/src/components/mobile/MediaDetail';
import MobileLogin from '../../packages/ui/src/components/mobile/LoginPage';
import MobileAccount from '../../packages/ui/src/components/mobile/AccountPage';
import MobileFooter from '../../packages/ui/src/components/mobile/Footer';
import AboutScreen from '../../packages/ui/src/components/mobile/AboutScreen';
import CareersScreen from '../../packages/ui/src/components/mobile/CareersScreen';
import PressScreen from '../../packages/ui/src/components/mobile/PressScreen';
import BlogScreen from '../../packages/ui/src/components/mobile/BlogScreen';
import HelpScreen from '../../packages/ui/src/components/mobile/HelpScreen';
import GuidelinesScreen from '../../packages/ui/src/components/mobile/GuidelinesScreen';
import UploadMediaScreen from '../../packages/ui/src/components/mobile/UploadMediaScreen';
import FavoritesScreen from '../../packages/ui/src/components/mobile/FavoritesScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export const GOOGLE_CONFIG = {
  expoClientId: '1051290880207-d4q0sfd3l2dnfcesgh4o5tg7u4uiaurh.apps.googleusercontent.com',    // can reuse web
  androidClientId: '1051290880207-qqhilo7t4f3qvig6n20snftv95o32s1k.apps.googleusercontent.com',
  webClientId: '1051290880207-d4q0sfd3l2dnfcesgh4o5tg7u4uiaurh.apps.googleusercontent.com',
};

function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar />
      <MobileHero />
    </View>
  );
}

function VideosScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar />
      <MobileVideoGrid />
    </View>
  );
}

function PhotosScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar />
      <MobilePhotoGrid />
    </View>
  );
}

function AudioScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar />
      <MobileAudioGrid />
    </View>
  );
}

function LoginScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar />
      <MobileLogin />
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MobileFooter {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Videos" component={VideosScreen} />
      <Tab.Screen name="Photos" component={PhotosScreen} />
      <Tab.Screen name="Audio" component={AudioScreen} />
      <Tab.Screen name="Login" component={LoginScreen} />
    </Tab.Navigator>
  );
}

// Wrapper for extra pages to include Navbar, back button, and Footer
const ExtraPageWrapper = ({ children }) => (
  <View style={{ flex: 1 }}>
    <MobileNavbar />
    <View style={{ flex: 1 }}>{children}</View>
    <MobileFooter />
  </View>
);

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        if (typeof NavigationBar.setVisibilityAsync === 'function') {
          NavigationBar.setVisibilityAsync('hidden');
        }
        if (typeof NavigationBar.setBehaviorAsync === 'function') {
          NavigationBar.setBehaviorAsync('overlay-swipe');
        }
      } catch (error) {
        console.warn('Failed to hide navigation bar:', error);
      }
    }
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" hidden={true} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="MediaDetail" component={MobileMediaDetail} />
        <Stack.Screen name="Login" component={MobileLogin} />
        <Stack.Screen name="UploadMedia" component={UploadMediaScreen} />
        <Stack.Screen name="About">
          <Stack.Screen name="Favorites" component={FavoritesScreen} />

          {() => (
            <ExtraPageWrapper>
              <AboutScreen />
            </ExtraPageWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Careers">
          {() => (
            <ExtraPageWrapper>
              <CareersScreen />
            </ExtraPageWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Press">
          {() => (
            <ExtraPageWrapper>
              <PressScreen />
            </ExtraPageWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Blog">
          {() => (
            <ExtraPageWrapper>
              <BlogScreen />
            </ExtraPageWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Help">
          {() => (
            <ExtraPageWrapper>
              <HelpScreen />
            </ExtraPageWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Guidelines">
          {() => (
            <ExtraPageWrapper>
              <GuidelinesScreen />
            </ExtraPageWrapper>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}