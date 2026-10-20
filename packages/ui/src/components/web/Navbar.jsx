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
  Cog6ToothIcon as SettingsIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  XMarkIcon as CloseIcon,
  Bars3Icon as MenuIcon,
} from '../../icons';
import { ArrowDownTrayIcon as DownloadIcon } from '../../icons';
import { useAuth } from '../../utils/useAuth';
import Image from 'next/image';

export default function Navbar({img}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${searchQuery}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (userRef.current && !userRef.current.contains(event.target)) setUserOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [router.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Videos', href: '/videos' },
    { label: 'Photos', href: '/photos' },
    { label: 'Audio', href: '/audio' },
    { label: 'Download Apps', href: '/apps' },   // ← add this
    { label: 'Favorites', href: '/favorites' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Help Center', href: '/help' },
  ];

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-surface border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden rounded-full p-2 text-text hover:bg-background shrink-0"
              aria-label="Open menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image src={img} alt="AR Media" width={60} height={60} className="rounded-full w-[2.5rem] h-[2.5rem] md:w-[4rem] md:h-[4rem]" />
            </Link>
            <div className='md:hidden'></div>
            <div className='md:hidden'></div>
            <div className='md:hidden'></div>
            <div className='md:hidden'></div>
            <div className='md:hidden'></div>
            <div className='md:hidden'></div>
            <div className='md:hidden'></div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition ${router.pathname === '/' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
                Home
              </Link>
              <Link href="/videos" className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition ${router.pathname === '/videos' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
                Videos
              </Link>
              <Link href="/photos" className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition ${router.pathname === '/photos' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
                Photos
              </Link>
              <Link href="/audio" className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition ${router.pathname === '/audio' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
                Audio
              </Link>
            </nav>

            {/* Search (desktop only) */}
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
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden rounded-full p-2 text-text-secondary hover:bg-background shrink-0"
              aria-label="Search"
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {user ? (
                <>
                <Link
  href="/apps"
  className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-1 ${
    router.pathname === '/apps' ? 'bg-primary text-white' : 'text-text hover:bg-background'
  }`}
>
  <DownloadIcon className="h-4 w-4" />
  <span>Apps</span>
</Link>
                  <Link
                    href="/uploadmedia"
                    className="hidden sm:flex items-center gap-1 rounded-full bg-primary text-white px-3 lg:px-4 py-2 text-sm font-medium hover:bg-primary-dark transition"
                  >
                    <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden lg:inline">Create</span>
                  </Link>
                  <Link href="/favorites" className="hidden sm:inline-flex rounded-full p-2 text-text-secondary hover:bg-background">
                    <BookmarkIcon className="h-5 w-5" />
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative" ref={userRef}>
                    <button
                      onClick={() => setUserOpen(!userOpen)}
                      className="rounded-full p-1 border-2 border-primary hover:bg-background transition overflow-hidden"
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name || 'User'} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover" />
                      ) : (
                        <ProfileIcon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                      )}
                    </button>
                    {userOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-surface rounded-lg shadow-lg border border-border py-2 z-50">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="font-semibold text-text text-sm truncate">{user.name || 'User'}</p>
                          <p className="text-text-secondary text-xs truncate">{user.email}</p>
                        </div>
                        <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background" onClick={() => setUserOpen(false)}>
                          <ProfileIcon className="h-5 w-5" /> Profile
                        </Link>
                        <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background" onClick={() => setUserOpen(false)}>
                          <SettingsIcon className="h-5 w-5" /> Settings
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-background">
                          <LogoutIcon className="h-5 w-5" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-primary text-white px-4 sm:px-6 py-2 text-sm font-medium hover:bg-primary-dark transition whitespace-nowrap"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
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
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-surface z-50 md:hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-lg font-semibold text-text">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-background">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-3 p-4 border-b border-border">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
                    {(user.name || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-text-secondary truncate">{user.email}</p>
                </div>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-medium transition ${
                    router.pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-text hover:bg-background'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {user && (
              <div className="border-t border-border p-3 space-y-1">
                <Link
                  href="/uploadmedia"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-full text-sm font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PlusIcon className="h-5 w-5" /> Create Post
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-2 w-full px-3 py-3 text-sm text-text hover:bg-background rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ProfileIcon className="h-5 w-5" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-3 text-sm text-error hover:bg-error/10 rounded-lg"
                >
                  <LogoutIcon className="h-5 w-5" /> Sign Out
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
}