import "./global.css";
import "react-native-gesture-handler";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "It looks like you might be using shared value's .value inside reanimated inline style",
  'Writing to `value` during component render',
]);
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import MobileNavbar from "../../packages/ui/src/components/mobile/Navbar";
import MobileHero from "../../packages/ui/src/components/mobile/Hero";
import MobileVideoGrid from "../../packages/ui/src/components/mobile/VideoGrid";
import MobilePhotoGrid from "../../packages/ui/src/components/mobile/PhotoGrid";
import MobileAudioGrid from "../../packages/ui/src/components/mobile/AudioGrid";
import MobileMediaDetail from "../../packages/ui/src/components/mobile/MediaDetail";
import MobileLogin from "../../packages/ui/src/components/mobile/LoginPage";
import MobileAccount from "../../packages/ui/src/components/mobile/AccountPage";
import MobileUploadMedia from "../../packages/ui/src/components/mobile/UploadMediaScreen";
import MobileFavorites from "../../packages/ui/src/components/mobile/FavoritesScreen";
import MobileFooter from "../../packages/ui/src/components/mobile/Footer";

import AboutScreen from "../../packages/ui/src/components/mobile/AboutScreen";
import CareersScreen from "../../packages/ui/src/components/mobile/CareersScreen";
import PressScreen from "../../packages/ui/src/components/mobile/PressScreen";
import BlogScreen from "../../packages/ui/src/components/mobile/BlogScreen";
import HelpScreen from "../../packages/ui/src/components/mobile/HelpScreen";
import GuidelinesScreen from "../../packages/ui/src/components/mobile/GuidelinesScreen";
import PrivacyScreen from "../../packages/ui/src/components/mobile/PrivacyScreen";
import TermsScreen from "../../packages/ui/src/components/mobile/TermsScreen";
import SettingsScreen from "../../packages/ui/src/components/mobile/SettingsScreen";
import { ThemeProvider } from "../../packages/ui/src/utils/ThemeContext";
import ThemeVars from "../../packages/ui/src/components/mobile/ThemeVars";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
import { setApiBaseUrl } from "../../packages/ui/src/utils/apiConfig";
setApiBaseUrl("https://ar-media-sigma.vercel.app"); // ← change to your actual IP
/* -------------------------------------------------------------------------- */
/*                            MAIN TAB SCREENS                                 */
/* -------------------------------------------------------------------------- */

function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar logo={require("./assets/my_logo.jpg")} />
      <MobileHero />
    </View>
  );
}

function VideosScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar logo={require("./assets/my_logo.jpg")} />
      <MobileVideoGrid />
    </View>
  );
}

function PhotosScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar logo={require("./assets/my_logo.jpg")} />
      <MobilePhotoGrid />
    </View>
  );
}

function AudioScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar logo={require("./assets/my_logo.jpg")} />
      <MobileAudioGrid />
    </View>
  );
}

function AccountScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MobileNavbar logo={require("./assets/my_logo.jpg")} />
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

/* -------------------------------------------------------------------------- */
/*                     EXTRA PAGES (with Navbar + Footer)                      */
/* -------------------------------------------------------------------------- */

// Each of these is a proper component passed via `component={...}`
// instead of nested children, which fixes the "invalid children" error.

function AboutPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MobileNavbar logo={require("./assets/my_logo.jpg")} />
        <AboutScreen />
        <MobileFooter />
      </View>
    </View>
  );
}

function CareersPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MobileNavbar logo={require("./assets/my_logo.jpg")} />
        <CareersScreen />
        <MobileFooter />
      </View>
    </View>
  );
}

function PressPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MobileNavbar logo={require("./assets/my_logo.jpg")} />
        <PressScreen />
        <MobileFooter />
      </View>
    </View>
  );
}

function BlogPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MobileNavbar logo={require("./assets/my_logo.jpg")} />
        <BlogScreen />
        <MobileFooter />
      </View>
    </View>
  );
}

function HelpPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MobileNavbar logo={require("./assets/my_logo.jpg")} />
        <HelpScreen />
        <MobileFooter />
      </View>
    </View>
  );
}

function GuidelinesPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MobileNavbar logo={require("./assets/my_logo.jpg")} />
        <GuidelinesScreen />
        <MobileFooter />
      </View>
    </View>
  );
}

function PrivacyPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MobileNavbar logo={require("./assets/my_logo.jpg")} />
        <PrivacyScreen />
        <MobileFooter />
      </View>
    </View>
  );
}

function TermsPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MobileNavbar logo={require("./assets/my_logo.jpg")} />
        <TermsScreen />
        <MobileFooter />
      </View>
    </View>
  );
}

function LoginPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MobileNavbar logo={require("./assets/my_logo.jpg")} />
        <MobileLogin />
        <MobileFooter />
      </View>
    </View>
  );
}
function SettingsPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MobileNavbar logo={require("./assets/my_logo.jpg")} />
        <SettingsScreen />
        <MobileFooter />
      </View>
    </View>
  );
}
/* -------------------------------------------------------------------------- */
/*                                    APP                                      */
/* -------------------------------------------------------------------------- */

export default function App() {
  useEffect(() => {
    if (Platform.OS === "android") {
      try {
        if (typeof NavigationBar.setVisibilityAsync === "function") {
          NavigationBar.setVisibilityAsync("hidden");
        }
        if (typeof NavigationBar.setBehaviorAsync === "function") {
          NavigationBar.setBehaviorAsync("overlay-swipe");
        }
      } catch (error) {
        console.warn("Failed to hide navigation bar:", error);
      }
    }
  }, []);

  return (
    <ThemeProvider>
      <ThemeVars>
        <NavigationContainer>
          <StatusBar style="light" hidden={true} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />

            {/* Auth & detail pages */}
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="MediaDetail" component={MobileMediaDetail} />
            <Stack.Screen name="UploadMedia" component={MobileUploadMedia} />
            <Stack.Screen name="Favorites" component={MobileFavorites} />

            {/* Extra pages — rendered with Navbar + Footer */}
            <Stack.Screen name="About" component={AboutPage} />
            <Stack.Screen name="Careers" component={CareersPage} />
            <Stack.Screen name="Press" component={PressPage} />
            <Stack.Screen name="Blog" component={BlogPage} />
            <Stack.Screen name="Help" component={HelpPage} />
            <Stack.Screen name="Guidelines" component={GuidelinesPage} />
            <Stack.Screen name="Privacy" component={PrivacyPage} />
            <Stack.Screen name="Terms" component={TermsPage} />
            <Stack.Screen name="Settings" component={SettingsPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeVars>
    </ThemeProvider>
  );
}
