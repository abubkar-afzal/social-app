import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { PlayIcon, PauseIcon, BookmarkIcon, PlusIcon } from '../../icons';
import { fetchMediaBatch } from '../../utils/mockData';

// Skeleton Loader Component
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

// Video Player Component (muted, autoplay on hover)
const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);

  return (
    <video
      ref={videoRef}
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
};

// Audio Player Component
const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
      <button
        onClick={togglePlay}
        className="rounded-full bg-white/20 p-4 hover:bg-white/30 transition"
      >
        {isPlaying ? (
          <PauseIcon className="h-12 w-12 text-white" />
        ) : (
          <PlayIcon className="h-12 w-12 text-white" />
        )}
      </button>
      <audio
        ref={audioRef}
        src={src}
        className="hidden"
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

// Image Component
const ImageDisplay = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="w-full h-full object-cover"
    loading="lazy"
  />
);

// Individual Media Card
export const MediaCardItem = ({ media }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Link href={`/media/${media.id}`}>
      <div className="group relative rounded-lg overflow-hidden bg-surface shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square w-full overflow-hidden">
          {media.type === 'video' ? (
            <VideoPlayer src={media.src} />
          ) : media.type === 'audio' ? (
            <AudioPlayer src={media.src} />
          ) : (
            <ImageDisplay src={media.src} alt={media.title} />
          )}
        </div>
        
        {/* Hover overlay */}
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
          <div className="flex justify-between items-center">
            <div>
              <span className="text-white text-sm font-medium truncate block">
                {media.title}
              </span>
              <span className="text-white/70 text-xs">
                {media.views} views • {media.likes} likes
              </span>
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="rounded-full bg-primary p-2 text-white hover:bg-primary-dark"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Grid Component with Infinite Scroll
export default function MediaCardGrid() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const loadItems = useCallback(async (pageNum) => {
    return await fetchMediaBatch(pageNum);
  }, []);

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
    if (items.length === 0) {
      setHasMore(false);
    } else {
      setMediaItems(prev => [...prev, ...items]);
      setPage(prev => prev + 1);
    }
  }, [page, hasMore, loadItems]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems.map((item) => (
              <MediaCardItem key={item.id} media={item} />
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