import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/videos" className="hover:text-primary">Videos</Link></li>
              <li><Link href="/photos" className="hover:text-primary">Photos</Link></li>
              <li><Link href="/audio" className="hover:text-primary">Audio</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">About</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary">Our Story</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
              <li><a href="#" className="hover:text-primary">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary">Blog</a></li>
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/login" className="hover:text-primary">Login</Link></li>
              <li><Link href="/account" className="hover:text-primary">Profile</Link></li>
              <li><a href="#" className="hover:text-primary">Settings</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-text-secondary">
          © {new Date().getFullYear()} PinShare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}