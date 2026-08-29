import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  PlusIcon,
  BellIcon,
  ProfileIcon,
  BookmarkIcon,
  ChevronDownIcon,
  Cog6ToothIcon as SettingsIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
} from '../../icons';

export default function DesktopNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const moreRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const moreLinks = [
    { label: 'About', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
    { label: 'Blog', path: '/blog' },
    { label: 'Help Center', path: '/help' },
    { label: 'Guidelines', path: '/guidelines' },
  ];

  const userLinks = [
    { label: 'Profile', path: '/login', icon: ProfileIcon },
    { label: 'Settings', path: '/settings', icon: SettingsIcon },
    { label: 'Logout', path: '/logout', icon: LogoutIcon },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-bold text-primary">P</span>
          <span className="text-lg font-semibold text-text">PinShare</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link to="/" className="px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-background">Home</Link>
          <Link to="/videos" className="px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-background">Videos</Link>
          <Link to="/photos" className="px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-background">Photos</Link>
          <Link to="/audio" className="px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-background">Audio</Link>

          {/* More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-background transition"
            >
              More
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-surface rounded-lg shadow-lg border border-border py-2 z-50">
                {moreLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="block px-4 py-2 text-sm text-text hover:bg-background hover:text-primary"
                    onClick={() => setMoreOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
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
          <Link to="/create" className="rounded-full bg-primary text-white p-2 hover:bg-primary-dark transition">
            <PlusIcon className="h-5 w-5" />
          </Link>
          <button className="rounded-full p-2 text-text-secondary hover:bg-background relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error" />
          </button>
          <Link to="/#" className="rounded-full p-2 text-text-secondary hover:bg-background">
            <BookmarkIcon className="h-5 w-5" />
          </Link>

          {/* User Dropdown */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="rounded-full p-1 border-2 border-primary hover:bg-background transition"
            >
              <ProfileIcon className="h-6 w-6 text-primary" />
            </button>
            {userOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border py-2 z-50">
                {userLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background hover:text-primary"
                      onClick={() => setUserOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}