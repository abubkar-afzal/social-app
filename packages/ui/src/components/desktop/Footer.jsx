import React from 'react';
import { Link } from 'react-router-dom';

export default function DesktopFooter() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-text-secondary">
            © {new Date().getFullYear()} PinShare Desktop
          </span>
          <nav className="flex gap-6 text-sm text-text-secondary">
            <Link to="/videos" className="hover:text-primary">Videos</Link>
            <Link to="/photos" className="hover:text-primary">Photos</Link>
            <Link to="/audio" className="hover:text-primary">Audio</Link>
            <Link to="/login" className="hover:text-primary">Login</Link>
            <Link to="/account" className="hover:text-primary">Account</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}