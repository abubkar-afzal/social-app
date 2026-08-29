import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  SearchIcon,
  PlusIcon,
  BellIcon,
  ProfileIcon,
  BookmarkIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  HomeIcon,
  VideoIcon,
  ImageIcon,
  AudioIcon,
  Cog6ToothIcon as SettingsIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  UserIcon,
} from '../../icons';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const moreRef = useRef(null);
  const userRef = useRef(null);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${searchQuery}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  // Close dropdowns when clicking outside
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
    { label: 'About', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
    { label: 'Help Center', href: '/help' },
    { label: 'Guidelines', href: '/guidelines' },
  ];

  const userLinks = [
    { label: 'Profile', href: '/login', icon: ProfileIcon },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
    { label: 'Logout', href: '/logout', icon: LogoutIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-bold text-primary">P</span>
            <span className="hidden sm:inline text-xl font-semibold text-text">PinShare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className={`px-4 py-2 rounded-full text-sm font-medium transition ${router.pathname === '/' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
              Home
            </Link>
            <Link href="/videos" className={`px-4 py-2 rounded-full text-sm font-medium transition ${router.pathname === '/videos' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
              Videos
            </Link>
            <Link href="/photos" className={`px-4 py-2 rounded-full text-sm font-medium transition ${router.pathname === '/photos' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
              Photos
            </Link>
            <Link href="/audio" className={`px-4 py-2 rounded-full text-sm font-medium transition ${router.pathname === '/audio' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
              Audio
            </Link>

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
                      href={link.href}
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
          <div className="hidden md:flex flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-background border border-border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </form>
          </div>

          {/* Mobile search toggle */}
          <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden rounded-full p-2 text-text-secondary hover:bg-background">
            <SearchIcon className="h-6 w-6" />
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/create" className="hidden sm:flex items-center gap-1 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary-dark transition">
              <PlusIcon className="h-5 w-5" />
              Create
            </Link>
            <Link href="/#" className="rounded-full p-2 text-text-secondary hover:bg-background">
              <BookmarkIcon className="h-6 w-6" />
            </Link>
            <button className="rounded-full p-2 text-text-secondary hover:bg-background relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error" />
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="rounded-full p-1 border-2 border-primary hover:bg-background transition"
              >
                <ProfileIcon className="h-7 w-7 text-primary" />
              </button>
              {userOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border py-2 z-50">
                  {userLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
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

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-background border border-border py-2 pl-10 pr-4 text-sm"
              />
            </form>
          </div>
        )}

        {/* Mobile More Dropdown (simplified) */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="flex flex-col gap-1">
              {moreLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm text-text hover:bg-background rounded"
                  onClick={() => setSearchOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}