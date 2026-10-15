// packages/ui/src/utils/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from './storage';
import {
  LIGHT_PALETTE,
  DARK_PALETTE,
  DEFAULT_PRIMARY,
  lighten,
  darken,
} from './themePresets';

const ThemeContext = createContext(null);

const MODE_KEY = 'theme_mode';
const PRIMARY_KEY = 'theme_primary';

/**
 * Detect whether we are running on web (browser or Electron renderer).
 * We avoid importing `Platform` from react-native so Next.js/Turbopack
 * doesn't try to parse React Native sources on the server/build.
 */
const IS_WEB =
  typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Convert #RRGGBB → "R G B" (space-separated channels for Tailwind alpha support).
 */
function hexToRgbChannels(hex) {
  if (!hex) return '0 0 0';
  const cleaned = hex.replace('#', '');
  const num = parseInt(cleaned, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `${r} ${g} ${b}`;
}

/**
 * Applies theme colors as CSS variables on the web.
 * Sets both:
 *   --color-primary        (hex, for direct CSS use)
 *   --color-primary-rgb    (channels, for Tailwind alpha support)
 */
function applyCssVars(palette, primary) {
  if (!IS_WEB) return;
  const root = document.documentElement;

  const pairs = [
    ['--color-background', palette.background],
    ['--color-surface', palette.surface],
    ['--color-text', palette.text],
    ['--color-text-secondary', palette.textSecondary],
    ['--color-border', palette.border],
    ['--color-success', palette.success || '#10b981'],
    ['--color-warning', palette.warning || '#f59e0b'],
    ['--color-error', palette.error || '#ef4444'],
    ['--color-primary', primary],
    ['--color-primary-light', lighten(primary, 60)],
    ['--color-primary-dark', darken(primary, 40)],
  ];

  for (const [name, hex] of pairs) {
    root.style.setProperty(name, hex);
    root.style.setProperty(`${name}-rgb`, hexToRgbChannels(hex));
  }
}

function resolveMode(mode) {
  if (mode === 'system') {
    if (IS_WEB && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return mode;
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState('system');
  const [primary, setPrimaryState] = useState(DEFAULT_PRIMARY);
  const [ready, setReady] = useState(false);
  const [systemMode, setSystemMode] = useState('light');

  // Load saved theme on mount
  useEffect(() => {
    (async () => {
      try {
        const savedMode = await storage.getItem(MODE_KEY);
        const savedPrimary = await storage.getItem(PRIMARY_KEY);
        if (savedMode) setModeState(savedMode);
        if (savedPrimary) setPrimaryState(savedPrimary);
      } catch (e) {
        console.error('Theme load failed:', e);
      }
      setReady(true);
    })();
  }, []);

  // Watch system color scheme (web only)
  useEffect(() => {
    if (!IS_WEB || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemMode(e.matches ? 'dark' : 'light');
    setSystemMode(mq.matches ? 'dark' : 'light');
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const resolvedMode = mode === 'system' ? systemMode : mode;
  const palette = resolvedMode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;

  // Apply on web/desktop
  useEffect(() => {
    if (!IS_WEB) return;
    applyCssVars(palette, primary);
    document.documentElement.classList.toggle('dark', resolvedMode === 'dark');
    if (document.body) {
      document.body.style.backgroundColor = palette.background;
      document.body.style.color = palette.text;
    }
  }, [palette, primary, resolvedMode]);

  const setMode = async (newMode) => {
    setModeState(newMode);
    try {
      await storage.setItem(MODE_KEY, newMode);
    } catch (e) {
      console.error(e);
    }
  };

  const setPrimary = async (hex) => {
    setPrimaryState(hex);
    try {
      await storage.setItem(PRIMARY_KEY, hex);
    } catch (e) {
      console.error(e);
    }
  };

  const reset = async () => {
    setModeState('system');
    setPrimaryState(DEFAULT_PRIMARY);
    try {
      await storage.setItem(MODE_KEY, 'system');
      await storage.setItem(PRIMARY_KEY, DEFAULT_PRIMARY);
    } catch (e) {
      console.error(e);
    }
  };

  const value = {
    mode,
    setMode,
    primary,
    setPrimary,
    palette,
    isDark: resolvedMode === 'dark',
    resolvedMode,
    primaryLight: lighten(primary, 60),
    primaryDark: darken(primary, 40),
    reset,
    ready,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback for components rendered outside the provider
    return {
      mode: 'light',
      setMode: () => {},
      primary: DEFAULT_PRIMARY,
      setPrimary: () => {},
      palette: LIGHT_PALETTE,
      isDark: false,
      resolvedMode: 'light',
      primaryLight: lighten(DEFAULT_PRIMARY, 60),
      primaryDark: darken(DEFAULT_PRIMARY, 40),
      reset: () => {},
      ready: true,
    };
  }
  return ctx;
}