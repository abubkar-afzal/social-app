import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon, PlusIcon, BellIcon, ProfileIcon, BookmarkIcon } from '../../icons';

export default function DesktopNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">P</span>
          <span className="text-lg font-semibold text-text">PinShare</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link to="/" className="px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-background">
            Home
          </Link>
          <Link to="/videos" className="px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-background">
            Videos
          </Link>
          <Link to="/photos" className="px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-background">
            Photos
          </Link>
          <Link to="/audio" className="px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-background">
            Audio
          </Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-background border border-border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-full bg-primary text-white p-2 hover:bg-primary-dark">
            <PlusIcon className="h-5 w-5" />
          </Link>
          <button className="rounded-full p-2 text-text-secondary hover:bg-background relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error" />
          </button>
          <Link to="/account" className="rounded-full p-2 text-text-secondary hover:bg-background">
            <BookmarkIcon className="h-5 w-5" />
          </Link>
          <Link to="/account" className="rounded-full p-1 border-2 border-primary">
            <ProfileIcon className="h-6 w-6 text-primary" />
          </Link>
        </div>
      </div>
    </header>
  );
}