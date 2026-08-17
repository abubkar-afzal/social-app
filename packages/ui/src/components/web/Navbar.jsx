import { useState } from 'react';
import {
  HomeIcon,
  SearchIcon,
  PlusIcon,
  BellIcon,
  ProfileIcon,
  BookmarkIcon,
} from '../../icons';

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo / Brand */}
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">P</span>
            <span className="hidden sm:inline text-xl font-semibold text-text">
              PinShare
            </span>
          </a>

          {/* Search - desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                placeholder="Search for videos, photos, audio..."
                className="w-full rounded-full bg-background border border-border py-2 pl-10 pr-4 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden rounded-full p-2 text-text-secondary hover:bg-background"
            aria-label="Search"
          >
            <SearchIcon className="h-6 w-6" />
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:flex items-center gap-1 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary-dark transition">
              <PlusIcon className="h-5 w-5" />
              Create
            </button>
            <button className="rounded-full p-2 text-text-secondary hover:bg-background" aria-label="Bookmarks">
              <BookmarkIcon className="h-6 w-6" />
            </button>
            <button className="rounded-full p-2 text-text-secondary hover:bg-background relative" aria-label="Notifications">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error" />
            </button>
            <button className="rounded-full p-1 border-2 border-primary" aria-label="Profile">
              <ProfileIcon className="h-7 w-7 text-primary" />
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                autoFocus
                placeholder="Search..."
                className="w-full rounded-full bg-background border border-border py-2 pl-10 pr-4 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}