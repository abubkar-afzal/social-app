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
  { name: 'White', value: '#ffffff' },
];

export const DEFAULT_PRIMARY = '#e6005c';

export function lighten(hex, amount = 60) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

export function darken(hex, amount = 40) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

export function isValidHex(hex) {
  return /^#([0-9A-Fa-f]{6})$/.test(hex);
}

/**
 * Returns a readable text color (black or white) for a given background hex.
 * Uses the sRGB relative luminance formula.
 *   - Light backgrounds (luminance > 0.6) → dark text (#0a0a0a)
 *   - Dark backgrounds → light text (#ffffff)
 */
export function readableTextColor(backgroundHex) {
  if (!backgroundHex) return '#ffffff';
  const hex = backgroundHex.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.6 ? '#0a0a0a' : '#ffffff';
}