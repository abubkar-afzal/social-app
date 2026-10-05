import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/videos" className="hover:text-primary transition">Videos</Link></li>
              <li><Link href="/photos" className="hover:text-primary transition">Photos</Link></li>
              <li><Link href="/audio" className="hover:text-primary transition">Audio</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">About</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
  <Link href="/favorites" className="hover:text-primary transition">
    Favorites
  </Link>
</li>
              <li><Link href="/about" className="hover:text-primary transition">Our Story</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition">Careers</Link></li>
              <li><Link href="/press" className="hover:text-primary transition">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/blog" className="hover:text-primary transition">Blog</Link></li>
              <li><Link href="/help" className="hover:text-primary transition">Help Center</Link></li>
              <li><Link href="/guidelines" className="hover:text-primary transition">Guidelines</Link></li>
            </ul>
          </div>
          <div>
  <h3 className="text-sm font-semibold text-text mb-4">Legal</h3>
  <ul className="space-y-2 text-sm text-text-secondary">
    <li><Link href="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
    <li><Link href="/terms" className="hover:text-primary transition">Terms of Service</Link></li>
    <li><Link href="/guidelines" className="hover:text-primary transition">Guidelines</Link></li>
  </ul>
</div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">© {new Date().getFullYear()} AR Media. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-text-secondary hover:text-primary transition">Twitter</a>
            <a href="#" className="text-text-secondary hover:text-primary transition">Instagram</a>
            <a href="#" className="text-text-secondary hover:text-primary transition">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}