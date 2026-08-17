import { useState } from 'react';
import { SearchIcon, BellIcon, ProfileIcon, PlusIcon, BookmarkIcon } from '../../icons';

export default function DesktopNavbar() {
  const [query, setQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm" style={{ WebkitAppRegion: 'drag' }}>
      <div className="flex h-16 items-center justify-between px-4">
        {/* Window controls (Electron) */}
        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
          <div className="flex space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-error" />
            <span className="h-3 w-3 rounded-full bg-warning" />
            <span className="h-3 w-3 rounded-full bg-success" />
          </div>
        </div>

        {/* Brand */}
        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
          <span className="text-2xl font-bold text-primary">P</span>
          <span className="text-lg font-semibold text-text hidden sm:inline">PinShare</span>
        </div>

        {/* Search (desktop centered) */}
        <div className="flex-1 max-w-md mx-4" style={{ WebkitAppRegion: 'no-drag' }}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full bg-background border border-border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
          <button className="rounded-full bg-primary text-white p-2 hover:bg-primary-dark" aria-label="Create">
            <PlusIcon className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-text-secondary hover:bg-background" aria-label="Notifications">
            <BellIcon className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-text-secondary hover:bg-background" aria-label="Bookmarks">
            <BookmarkIcon className="h-5 w-5" />
          </button>
          <button className="rounded-full p-1 border-2 border-primary" aria-label="Profile">
            <ProfileIcon className="h-6 w-6 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
}