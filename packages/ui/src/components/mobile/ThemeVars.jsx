// packages/ui/src/components/mobile/ThemeVars.jsx
import React from 'react';
import { View } from 'react-native';
import { vars } from 'nativewind';
import { useTheme } from '../../utils/ThemeContext';

/**
 * Provides theme CSS variables to every descendant of the mobile app.
 * Works like :root variables on web — components can simply use bg-surface,
 * text-text, etc. and they update automatically when the theme changes.
 */
export default function ThemeVars({ children, style }) {
  const { palette, primary, primaryLight, primaryDark, onPrimary } = useTheme();

  const themeVars = vars({
    '--color-primary': primary,
    '--color-primary-light': primaryLight,
    '--color-primary-dark': primaryDark,
    '--color-on-primary': onPrimary,
    '--color-background': palette.background,
    '--color-surface': palette.surface,
    '--color-text': palette.text,
    '--color-text-secondary': palette.textSecondary,
    '--color-border': palette.border,
    '--color-success': palette.success || '#10b981',
    '--color-warning': palette.warning || '#f59e0b',
    '--color-error': palette.error || '#ef4444',
  });

  return (
    <View style={[themeVars, { flex: 1 }, style]}>
      {children}
    </View>
  );
}