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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

function AccountScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar />
      <MobileAccount />
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
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
 useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        // Safe check: only call if function exists
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}