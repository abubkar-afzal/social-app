import React from 'react';
import LoginPage from '../../../packages/ui/src/components/web/LoginPage';
import SEO from '@/components/SEO';

export default function Login() {
  return (
    <>
      <SEO
  title="Sign In"
  description="Sign in to AR Media to share videos, photos, and audio."
  url="/login"
  noindex  // don't index login pages
/>
      <LoginPage />
    </>
  );
}