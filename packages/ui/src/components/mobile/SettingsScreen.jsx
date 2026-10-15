import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../utils/ThemeContext';
import { PRIMARY_PRESETS, isValidHex } from '../../utils/themePresets';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { mode, setMode, primary, setPrimary, reset } = useTheme();
  const [customHex, setCustomHex] = useState(primary);

  const handleHexChange = (val) => {
    setCustomHex(val);
    if (isValidHex(val)) setPrimary(val);
  };

  const handleReset = () => {
    Alert.alert('Reset settings', 'Restore default appearance?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: reset },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-text mb-6">Settings</Text>

        {/* APPEARANCE */}
        <View className="bg-surface rounded-2xl p-4 mb-4">
          <Text className="text-lg font-bold text-text mb-1">Appearance</Text>
          <Text className="text-xs text-text-secondary mb-4">
            Choose how the app looks. System follows your device settings.
          </Text>
          <View className="flex-row gap-3">
            {[
              { key: 'light', label: 'Light', icon: '☀️' },
              { key: 'dark', label: 'Dark', icon: '🌙' },
              { key: 'system', label: 'System', icon: '💻' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setMode(opt.key)}
                className={`flex-1 py-4 rounded-xl border-2 items-center ${
                  mode === opt.key ? 'border-primary bg-primary/5' : 'border-border bg-background'
                }`}
              >
                <Text className="text-2xl mb-1">{opt.icon}</Text>
                <Text className={`text-sm font-medium ${mode === opt.key ? 'text-primary' : 'text-text'}`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ACCENT COLOR */}
        <View className="bg-surface rounded-2xl p-4 mb-4">
          <Text className="text-lg font-bold text-text mb-1">Accent Color</Text>
          <Text className="text-xs text-text-secondary mb-4">
            Pick the color used for buttons, links, and highlights.
          </Text>

          <View className="flex-row flex-wrap gap-3 mb-4">
            {PRIMARY_PRESETS.map((p) => (
              <TouchableOpacity
                key={p.value}
                onPress={() => { setPrimary(p.value); setCustomHex(p.value); }}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  primary === p.value ? 'border-2 border-text' : ''
                }`}
                style={{ backgroundColor: p.value }}
              >
                {primary === p.value && <Text className="text-white text-lg">✓</Text>}
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-sm font-medium text-text mb-2">Custom hex color</Text>
          <TextInput
            value={customHex}
            onChangeText={handleHexChange}
            maxLength={7}
            placeholder="#e6005c"
            autoCapitalize="none"
            className="bg-background rounded-lg px-4 py-3 border border-border text-text font-mono"
          />
        </View>

        {/* PREVIEW */}
        <View className="bg-surface rounded-2xl p-4 mb-4">
          <Text className="text-lg font-bold text-text mb-4">Preview</Text>
          <View className="rounded-xl border border-border p-4 bg-background">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold text-lg">A</Text>
              </View>
              <View>
                <Text className="font-semibold text-text">Sample User</Text>
                <Text className="text-xs text-text-secondary">sample@example.com</Text>
              </View>
            </View>
            <View className="flex-row flex-wrap gap-2">
              <View className="bg-primary px-4 py-2 rounded-full">
                <Text className="text-white text-sm font-medium">Primary</Text>
              </View>
              <View className="bg-surface border border-border px-4 py-2 rounded-full">
                <Text className="text-text text-sm font-medium">Secondary</Text>
              </View>
            </View>
          </View>
        </View>

        {/* RESET */}
        <View className="bg-surface rounded-2xl p-4 mb-6">
          <TouchableOpacity
            onPress={handleReset}
            className="border border-error py-3 rounded-lg"
          >
            <Text className="text-error text-center font-semibold">Reset to defaults</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}