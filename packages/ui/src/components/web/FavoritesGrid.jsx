import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../utils/useAuth';
import { apiUrl, authFetch } from '../../utils/apiConfig';
import {
  PlayIcon,
  BookmarkIcon,
  TrashIcon,
  HeartIcon,
} from '../../icons';

export default function FavoritesGrid() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    try {
      const res = await authFetch(apiUrl('/api/user/favorites'));
      if (res.ok) {
        const data = await res.json();
        setItems(data.media || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const removeFavorite = async (mediaId) => {
    try {
      const res = await authFetch(apiUrl(`/api/media/${mediaId}/favorite`), {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems((prev) => prev.filter((m) => m.id !== mediaId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <BookmarkIcon className="h-16 w-16 mx-auto text-text-secondary mb-4" />
        <h1 className="text-2xl font-bold text-text mb-4">Your Favorites</h1>
        <p className="text-text-secondary mb-6">Sign in to view and manage your favorite posts.</p>
        <Link
          href="/login"
          className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Favorites</h1>
          <p className="text-text-secondary mt-1">
            {items.length} {items.length === 1 ? 'post' : 'posts'} saved
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden bg-surface shadow-sm">
              <div className="aspect-square bg-border animate-pulse" />
              <div className="p-3">
                <div className="h-4 bg-border rounded mb-2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl">
          <BookmarkIcon className="h-16 w-16 mx-auto text-text-secondary mb-4" />
          <p className="text-text-secondary mb-4">No favorites yet.</p>
          <Link
            href="/"
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark"
          >
            Explore posts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden bg-surface shadow-md hover:shadow-xl transition-all"
            >
              <Link href={`/media/${item.id}`}>
                <div className="aspect-square overflow-hidden">
                  {item.type === 'VIDEO' && (
                    <video
                      src={apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`)}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                      }}
                    />
                  )}
                  {item.type === 'PHOTO' && (
                    <img
                      src={apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  {item.type === 'AUDIO' && (
                    <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
                      <PlayIcon className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute top-2 right-2 flex gap-1 pointer-events-auto">
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="rounded-full bg-white/90 p-2 hover:bg-error hover:text-white transition"
                    title="Remove from favorites"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  {item.user?.avatarUrl ? (
                    <img
                      src={item.user.avatarUrl}
                      alt={item.user.name || 'User'}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {(item.user?.name || item.user?.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-text-secondary truncate">
                    {item.user?.name || item.user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-text truncate">{item.title}</p>
                <p className="text-xs text-text-secondary">
                  {item.viewsCount} views · {item.likesCount} likes
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}