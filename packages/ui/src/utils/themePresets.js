// packages/ui/src/utils/themePresets.js

export const LIGHT_PALETTE = {
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const DARK_PALETTE = {
  background: '#0a0a0a',
  surface: '#18181b',
  text: '#f4f4f5',
  textSecondary: '#a1a1aa',
  border: '#27272a',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const PRIMARY_PRESETS = [
  { name: 'Pink', value: '#e6005c' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Teal', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Slate', value: '#475569' },
  { name: 'Black', value: '#000000' },
  { name: 'Dark', value: '#111827' },
];

export const DEFAULT_PRIMARY = '#e6005c';

/**
 * Lighten a hex color by adding `amount` to each RGB channel.
 */
export function lighten(hex, amount = 60) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/**
 * Darken a hex color by subtracting `amount` from each RGB channel.
 * If the color is very dark, we allow it to stay near-black (never negative).
 */
export function darken(hex, amount = 40) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/**
 * Validate a hex color string.
 */
export function isValidHex(hex) {
  return /^#([0-9A-Fa-f]{6})$/.test(hex);
}