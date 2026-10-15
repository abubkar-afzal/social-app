import React from 'react';
import SettingsPage from '../../../packages/ui/src/components/web/SettingsPage';

export default function Settings() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      <main className="flex-1">
        <SettingsPage />
      </main>
      
    </div>
  );
}