import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, PauseIcon, BookmarkIcon, PlusIcon, HeartIcon, TrendingIcon } from '../../icons';
import { fetchMediaBatch } from '../../utils/mockData';

// Skeleton Loader
const HeroSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-surface shadow-sm">
    <div className="aspect-[3/4] bg-border animate-pulse" />
    <div className="p-3">
      <div className="h-4 bg-border rounded mb-2 animate-pulse" />
      <div className="h-3 bg-border rounded w-2/3 animate-pulse" />
    </div>
  </div>
);

// Video Card with Autoplay on hover
const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Link to={`/media/${video.id}`}>
      <div className="group relative rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
        <video
          ref={videoRef}
          src={video.src}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Hover Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
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

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 mb-1">
            <img src={video.userAvatar} alt={video.user} className="w-6 h-6 rounded-full" />
            <span className="text-white text-xs">{video.user}</span>
          </div>
          <h3 className="text-white font-semibold truncate">{video.title}</h3>
          <div className="flex items-center gap-3 text-white/80 text-xs mt-1">
            <span>👁️ {video.views}</span>
            <span>❤️ {video.likes}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Photo Card
const PhotoCard = ({ photo }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Link to={`/media/${photo.id}`}>
      <div className="group relative rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
        <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" loading="lazy" />
        
        {/* Hover Overlay */}
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
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src={photo.userAvatar} alt={photo.user} className="w-6 h-6 rounded-full" />
              <span className="text-white text-xs">{photo.user}</span>
            </div>
            <h3 className="text-white font-semibold truncate">{photo.title}</h3>
            <div className="flex items-center gap-3 text-white/80 text-xs mt-1">
              <span>👁️ {photo.views}</span>
              <span>❤️ {photo.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Audio Card
const AudioCard = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = (e) => {
    e.preventDefault();
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
    <Link to={`/media/${audio.id}`}>
      <div className="group relative rounded-lg overflow-hidden bg-gradient-to-br from-primary-light via-primary to-primary-dark shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div className="aspect-square flex flex-col items-center justify-center p-4">
          <button
            onClick={togglePlay}
            className="rounded-full bg-white/20 p-5 hover:bg-white/30 transition group-hover:scale-110 mb-3"
          >
            {isPlaying ? (
              <PauseIcon className="h-12 w-12 text-white" />
            ) : (
              <PlayIcon className="h-12 w-12 text-white" />
            )}
          </button>
          <h3 className="text-white font-semibold text-center truncate w-full">
            {audio.title}
          </h3>
          <p className="text-white/80 text-xs mt-1">
            {audio.views} views
          </p>
          <audio ref={audioRef} src={audio.src} className="hidden" onEnded={() => setIsPlaying(false)} />
        </div>

        {/* Hover Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className={`rounded-full p-2 ${isSaved ? 'bg-white/90 text-primary' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            <BookmarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default function DesktopHero() {
  const [heroItems, setHeroItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const sentinelRef = useRef(null);

  useEffect(() => {
    loadHeroItems(0);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadHeroItems(page);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page, hasMore]);

  const loadHeroItems = async (pageNum) => {
    const items = await fetchMediaBatch(pageNum, 15);
    if (pageNum === 0) {
      setHeroItems(items);
      setLoading(false);
    } else {
      if (items.length === 0) {
        setHasMore(false);
      } else {
        setHeroItems(prev => [...prev, ...items]);
      }
    }
    setPage(prev => prev + 1);
  };

  const filteredItems = activeFilter === 'all'
    ? heroItems
    : heroItems.filter(item => item.type === activeFilter);

  return (
    <section className="bg-background py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text mb-3">
            Discover, Share & Inspire
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Explore a world of videos, photos, and audio curated by people like you.
          </p>
        </div>

        {/* Filter Tabs
        <div className="flex justify-center gap-3 mb-8">
          {[
            { key: 'all', label: 'All', icon: '✨' },
            { key: 'video', label: 'Videos', icon: '🎬' },
            { key: 'photo', label: 'Photos', icon: '🖼️' },
            { key: 'audio', label: 'Audio', icon: '🎵' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-6 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                activeFilter === filter.key
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-surface text-text hover:bg-background border border-border'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div> */}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <HeroSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {/* Pinterest Masonry Layout */}
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`break-inside-avoid ${
                    index % 5 === 0 ? 'aspect-[3/4]' : 
                    index % 5 === 1 ? 'aspect-square' : 
                    index % 5 === 2 ? 'aspect-[4/5]' : 
                    index % 5 === 3 ? 'aspect-[3/4]' : 
                    'aspect-[16/9]'
                  }`}
                >
                  {item.type === 'video' && <VideoCard video={item} />}
                  {item.type === 'photo' && <PhotoCard photo={item} />}
                  {item.type === 'audio' && <AudioCard audio={item} />}
                </div>
              ))}
            </div>

            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="h-10" />
            
            {hasMore && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}