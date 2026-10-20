import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-sm font-semibold text-text mb-3 sm:mb-4">Explore</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              <li><Link href="/videos" className="hover:text-primary transition">Videos</Link></li>
              <li><Link href="/photos" className="hover:text-primary transition">Photos</Link></li>
              <li><Link href="/audio" className="hover:text-primary transition">Audio</Link></li>
              <li><Link href="/favorites" className="hover:text-primary transition">Favorites</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-3 sm:mb-4">About</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              <li><Link href="/about" className="hover:text-primary transition">Our Story</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition">Careers</Link></li>
              <li><Link href="/press" className="hover:text-primary transition">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-3 sm:mb-4">Resources</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              <li><Link href="/apps" className="hover:text-primary transition">Download Apps</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition">Blog</Link></li>
              <li><Link href="/help" className="hover:text-primary transition">Help Center</Link></li>
              <li><Link href="/guidelines" className="hover:text-primary transition">Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              <li><Link href="/privacy" className="hover:text-primary transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition">Terms</Link></li>
              
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-text-secondary text-center md:text-left">
            © {new Date().getFullYear()} AR Media. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}