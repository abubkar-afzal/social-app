import React from 'react';
import AccountPage from '../../../packages/ui/src/components/web/AccountPage';

export default function Account() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <AccountPage />
      </main>
    </div>
  );
}