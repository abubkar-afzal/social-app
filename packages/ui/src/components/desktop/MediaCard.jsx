import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, PauseIcon, BookmarkIcon, PlusIcon } from '../../icons';
import { fetchMediaBatch } from '../../utils/mockData';

const SkeletonCard = () => (
  <div className="rounded-lg overflow-hidden bg-surface shadow-sm">
    <div className="aspect-square bg-border animate-pulse" />
    <div className="p-3">
      <div className="h-4 bg-border rounded mb-2 animate-pulse" />
      <div className="flex justify-between">
        <div className="w-8 h-8 rounded-full bg-border animate-pulse" />
        <div className="w-8 h-8 rounded-full bg-border animate-pulse" />
      </div>
    </div>
  </div>
);

const VideoPlayer = ({ src }) => (
  <video
    src={src}
    className="w-full h-full object-cover"
    muted
    loop
    playsInline
    preload="metadata"
    onMouseEnter={(e) => e.target.play()}
    onMouseLeave={(e) => {
      e.target.pause();
      e.target.currentTime = 0;
    }}
  />
);

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
      <button onClick={togglePlay} className="rounded-full bg-white/20 p-4 hover:bg-white/30 transition">
        {isPlaying ? <PauseIcon className="h-12 w-12 text-white" /> : <PlayIcon className="h-12 w-12 text-white" />}
      </button>
      <audio ref={audioRef} src={src} className="hidden" onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export const DesktopMediaCardItem = ({ media }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Link to={`/media/${media.id}`}>
      <div className="group relative rounded-lg overflow-hidden bg-surface shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square w-full overflow-hidden">
          {media.type === 'video' ? (
            <VideoPlayer src={media.src} />
          ) : media.type === 'audio' ? (
            <AudioPlayer src={media.src} />
          ) : (
            <img
  src={media.src}
  alt={media.title}
  className="w-full h-full object-cover"
  loading="lazy"
  onError={(e) => {
    // If the stream fails, fall back to the direct Drive thumbnail URL
    if (media.fallbackSrc && e.target.src !== media.fallbackSrc) {
      e.target.src = media.fallbackSrc;
    }
  }}
/>
          )}
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsSaved(!isSaved);
              }}
              className={`rounded-full p-2 ${isSaved ? 'bg-primary text-white' : 'bg-white/90 text-text hover:bg-white'}`}
            >
              <BookmarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-between items-end">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                {media.user?.avatarUrl ? (
  <img src={media.user.avatarUrl} alt={media.user.name || 'User'} className="w-6 h-6 rounded-full object-cover" />
) : (
  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
    {(media.user?.name || media.user?.email || 'U')[0].toUpperCase()}
  </div>
)}
<span className="text-white text-xs truncate">
  {media.user?.name || media.user?.email?.split('@')[0] || 'User'}
</span>
              </div>
              <span className="text-white text-sm font-medium truncate block">{media.title}</span>
              <span className="text-white/70 text-xs">
                {media.viewsCount} views · {media.likesCount} likes
              </span>
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="rounded-full bg-primary p-2 text-white hover:bg-primary-dark ml-2"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function DesktopMediaCardGrid() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  const loadItems = useCallback(async (pageNum) => await fetchMediaBatch(pageNum, 12), []);

  useEffect(() => {
    const initialLoad = async () => {
      const items = await loadItems(0);
      setMediaItems(items);
      setPage(1);
      setLoading(false);
    };
    initialLoad();
  }, [loadItems]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    const items = await loadItems(page);
    if (items.length === 0) setHasMore(false);
    else {
      setMediaItems((prev) => [...prev, ...items]);
      setPage((prev) => prev + 1);
    }
  }, [page, hasMore, loadItems]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return (
    <div className="container mx-auto px-6 py-8">
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mediaItems.map((item) => (
              <DesktopMediaCardItem key={item.id} media={item} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-10" />
          {hasMore && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
        </>
      )}
    </div>
  );
}