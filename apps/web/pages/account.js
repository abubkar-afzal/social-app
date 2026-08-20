import React from 'react';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import AccountPage from '../../../packages/ui/src/components/web/AccountPage';
import Footer from '../../../packages/ui/src/components/web/Footer';

export default function Account() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AccountPage />
      </main>
      <Footer />
    </div>
  );
}