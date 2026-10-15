import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../../utils/ThemeContext';
import { PRIMARY_PRESETS, DEFAULT_PRIMARY, isValidHex } from '../../utils/themePresets';

export default function SettingsPage() {
  const {
    mode, setMode,
    primary, setPrimary,
    palette, reset,
  } = useTheme();

  const [customHex, setCustomHex] = useState(primary);

  const handleHexChange = (e) => {
    const val = e.target.value;
    setCustomHex(val);
    if (isValidHex(val)) setPrimary(val);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-text mb-8">Settings</h1>

      {/* APPEARANCE */}
      <section className="bg-surface rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-text mb-4">Appearance</h2>
        <p className="text-sm text-text-secondary mb-4">
          Choose how the app looks. System follows your device settings.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'light', label: 'Light', icon: '☀️' },
            { key: 'dark', label: 'Dark', icon: '🌙' },
            { key: 'system', label: 'System', icon: '💻' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setMode(opt.key)}
              className={`flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 transition ${
                mode === opt.key
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className={`text-sm font-medium ${mode === opt.key ? 'text-primary' : 'text-text'}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ACCENT COLOR */}
      <section className="bg-surface rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-text mb-4">Accent Color</h2>
        <p className="text-sm text-text-secondary mb-4">
          Pick the color used for buttons, links, and highlights.
        </p>

        {/* Preset grid */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mb-6">
          {PRIMARY_PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => {
                setPrimary(p.value);
                setCustomHex(p.value);
              }}
              className={`aspect-square rounded-full transition-transform hover:scale-110 ${
                primary === p.value ? 'ring-2 ring-offset-2 ring-text' : ''
              }`}
              style={{ backgroundColor: p.value }}
              title={p.name}
            />
          ))}
        </div>

        {/* Custom color input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="text-sm font-medium text-text sm:w-32">Custom color:</label>
          <div className="flex items-center gap-3 flex-1">
            <input
              type="color"
              value={primary}
              onChange={(e) => {
                setPrimary(e.target.value);
                setCustomHex(e.target.value);
              }}
              className="w-12 h-12 rounded-lg border border-border cursor-pointer"
            />
            <input
              type="text"
              value={customHex}
              onChange={handleHexChange}
              maxLength={7}
              placeholder="#e6005c"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* PREVIEW */}
      <section className="bg-surface rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-text mb-4">Preview</h2>
        <div className="rounded-xl border border-border p-4 bg-background">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <div>
              <p className="font-semibold text-text">Sample User</p>
              <p className="text-xs text-text-secondary">sample@example.com</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
              Primary
            </button>
            <button className="bg-surface text-text border border-border px-4 py-2 rounded-full text-sm font-medium">
              Secondary
            </button>
            <button className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              Soft
            </button>
          </div>
        </div>
      </section>

      {/* RESET */}
      <section className="bg-surface rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-text mb-2">Reset</h2>
        <p className="text-sm text-text-secondary mb-4">
          Restore the default appearance.
        </p>
        <button
          onClick={reset}
          className="bg-error/10 text-error border border-error px-6 py-2 rounded-full font-medium hover:bg-error hover:text-white transition"
        >
          Reset to defaults
        </button>
      </section>
    </div>
  );
}