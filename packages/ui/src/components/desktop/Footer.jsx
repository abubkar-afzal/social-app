import React from 'react';
import { Link } from 'react-router-dom';

export default function DesktopFooter() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/videos" className="hover:text-primary transition">Videos</Link></li>
              <li><Link to="/photos" className="hover:text-primary transition">Photos</Link></li>
              <li><Link to="/audio" className="hover:text-primary transition">Audio</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">About</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
  <Link to="/favorites" className="hover:text-primary transition">
    Favorites
  </Link>
</li>
              <li><Link to="/about" className="hover:text-primary transition">Our Story</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition">Careers</Link></li>
              <li><Link to="/press" className="hover:text-primary transition">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/blog" className="hover:text-primary transition">Blog</Link></li>
              <li><Link to="/help" className="hover:text-primary transition">Help Center</Link></li>
              <li><Link to="/guidelines" className="hover:text-primary transition">Guidelines</Link></li>
            </ul>
          </div>
          <div>
  <h3 className="text-sm font-semibold text-text mb-4">Legal</h3>
  <ul className="space-y-2 text-sm text-text-secondary">
    <li><Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
    <li><Link to="/terms" className="hover:text-primary transition">Terms of Service</Link></li>
    <li><Link to="/guidelines" className="hover:text-primary transition">Guidelines</Link></li>
  </ul>
</div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-text-secondary">
          © {new Date().getFullYear()} AR Media. All rights reserved.
        </div>
      </div>
    </footer>
  );
}