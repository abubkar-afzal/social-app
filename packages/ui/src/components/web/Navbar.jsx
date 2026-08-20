import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SearchIcon, PlusIcon, BellIcon, ProfileIcon, BookmarkIcon, HomeIcon, VideoIcon, ImageIcon, AudioIcon } from '../../icons';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${searchQuery}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">P</span>
            <span className="hidden sm:inline text-xl font-semibold text-text">PinShare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/" className={`px-4 py-2 rounded-full text-sm font-medium ${router.pathname === '/' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
              Home
            </Link>
            <Link href="/videos" className={`px-4 py-2 rounded-full text-sm font-medium ${router.pathname === '/videos' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
              Videos
            </Link>
            <Link href="/photos" className={`px-4 py-2 rounded-full text-sm font-medium ${router.pathname === '/photos' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
              Photos
            </Link>
            <Link href="/audio" className={`px-4 py-2 rounded-full text-sm font-medium ${router.pathname === '/audio' ? 'bg-primary text-white' : 'text-text hover:bg-background'}`}>
              Audio
            </Link>
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
            <Link href="/login" className="hidden sm:flex items-center gap-1 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary-dark transition">
              <PlusIcon className="h-5 w-5" />
              Create
            </Link>
            <Link href="/account" className="rounded-full p-2 text-text-secondary hover:bg-background">
              <BookmarkIcon className="h-6 w-6" />
            </Link>
            <button className="rounded-full p-2 text-text-secondary hover:bg-background relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error" />
            </button>
            <Link href="/account" className="rounded-full p-1 border-2 border-primary">
              <ProfileIcon className="h-7 w-7 text-primary" />
            </Link>
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
      </div>
    </header>
  );
}