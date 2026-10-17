import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useAuth } from '../../utils/useAuth';

export default function DesktopNavbar({ img }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const moreRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (moreRef.current && !moreRef.current.contains(event.target)) setMoreOpen(false);
      if (userRef.current && !userRef.current.contains(event.target)) setUserOpen(false);
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

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={img} alt="AR Media" className="rounded-full w-[2.5rem] h-[2.5rem] md:w-[4rem] md:h-[4rem]" />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link to="/" className={`px-4 py-2 rounded-full text-sm font-medium transition ${isActive('/') ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
            Home
          </Link>
          <Link to="/videos" className={`px-4 py-2 rounded-full text-sm font-medium transition ${isActive('/videos') ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
            Videos
          </Link>
          <Link to="/photos" className={`px-4 py-2 rounded-full text-sm font-medium transition ${isActive('/photos') ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
            Photos
          </Link>
          <Link to="/audio" className={`px-4 py-2 rounded-full text-sm font-medium transition ${isActive('/audio') ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
            Audio
          </Link>

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
          {user ? (
            <>
              <Link
                to="/uploadmedia"
                className="rounded-full bg-primary text-white p-2 hover:bg-primary-dark transition"
                title="Create"
              >
                <PlusIcon className="h-5 w-5" />
              </Link>
              
              <Link to="/favorites" className="rounded-full p-2 text-text-secondary hover:bg-background">
  <BookmarkIcon className="h-6 w-6" />
</Link>

              {/* User Dropdown */}
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="rounded-full p-1 border-2 border-primary hover:bg-background transition overflow-hidden"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name || 'User'} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <ProfileIcon className="h-6 w-6 text-primary" />
                  )}
                </button>
                {userOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-surface rounded-lg shadow-lg border border-border py-2 z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-text text-sm truncate">{user.name || 'User'}</p>
                      <p className="text-text-secondary text-xs truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background"
                      onClick={() => setUserOpen(false)}
                    >
                      <ProfileIcon className="h-5 w-5" /> Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background"
                      onClick={() => setUserOpen(false)}
                    >
                      <SettingsIcon className="h-5 w-5" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-background"
                    >
                      <LogoutIcon className="h-5 w-5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-primary text-white px-6 py-2 text-sm font-medium hover:bg-primary-dark transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}