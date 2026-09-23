import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PlayIcon, PauseIcon, BookmarkIcon, HeartIcon } from '../../icons';
import { fetchMediaBatch } from '../../utils/mockData';

const HeroSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-surface shadow-sm">
    <div className="aspect-[3/4] bg-border animate-pulse" />
    <div className="p-3">
      <div className="h-4 bg-border rounded mb-2 animate-pulse" />
      <div className="h-3 bg-border rounded w-2/3 animate-pulse" />
    </div>
  </div>
);

const VideoCard = ({ video }) => (
  <Link href={`/media/${video.id}`}>
    <div className="group relative rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      <video
        src={video.src}
        className="w-full h-full object-cover"
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2 mb-1">
          {video.user?.avatarUrl ? (
            <img src={video.user.avatarUrl} alt={video.user.name} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {(video.user?.name || 'U')[0].toUpperCase()}
            </div>
          )}
          <span className="text-white text-xs truncate">{video.user?.name || 'User'}</span>
        </div>
        <h3 className="text-white font-semibold truncate">{video.title}</h3>
        <p className="text-white/80 text-xs">{video.viewsCount} views</p>
      </div>
    </div>
  </Link>
);

const PhotoCard = ({ photo }) => (
  <Link href={`/media/${photo.id}`}>
    <div className="group relative rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        <div className="flex justify-end">
          <button className="rounded-full bg-white/90 p-2 hover:bg-white">
            <BookmarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            {photo.user?.avatarUrl ? (
              <img src={photo.user.avatarUrl} alt={photo.user.name} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {(photo.user?.name || 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="text-white text-xs">{photo.user?.name || 'User'}</span>
          </div>
          <h3 className="text-white font-semibold truncate">{photo.title}</h3>
          <p className="text-white/80 text-xs">{photo.viewsCount} views</p>
        </div>
      </div>
    </div>
  </Link>
);

const AudioCard = ({ audio }) => {
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
    <Link href={`/media/${audio.id}`}>
      <div className="group relative rounded-lg overflow-hidden bg-gradient-to-br from-primary-light to-primary-dark shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div className="aspect-square flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="rounded-full bg-white/20 p-5 hover:bg-white/30 transition group-hover:scale-110"
          >
            {isPlaying ? <PauseIcon className="h-12 w-12 text-white" /> : <PlayIcon className="h-12 w-12 text-white" />}
          </button>
          <audio ref={audioRef} src={audio.src} className="hidden" onEnded={() => setIsPlaying(false)} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-2 mb-1">
            {audio.user?.avatarUrl ? (
              <img src={audio.user.avatarUrl} alt={audio.user.name} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {(audio.user?.name || 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="text-white text-xs">{audio.user?.name || 'User'}</span>
          </div>
          <h3 className="text-white font-semibold truncate">{audio.title}</h3>
          <p className="text-white/80 text-xs">{audio.viewsCount} views</p>
        </div>
      </div>
    </Link>
  );
};

export default function Hero() {
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
        if (entries[0].isIntersecting && hasMore) loadHeroItems(page);
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page, hasMore]);

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  const loadHeroItems = async (pageNum) => {
    const items = await fetchMediaBatch(pageNum, 12);
    if (pageNum === 0) {
      setHeroItems(shuffle(items));
      setLoading(false);
    } else {
      if (items.length === 0) setHasMore(false);
      else setHeroItems((prev) => [...prev, ...shuffle(items)]);
    }
    setPage((prev) => prev + 1);
  };

  const filteredItems = activeFilter === 'all' ? heroItems : heroItems.filter((item) => item.type === activeFilter);

  return (
    <section className="bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">Discover, Share & Inspire</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Explore a world of videos, photos, and audio curated by people like you.
          </p>
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {['all', 'video', 'photo', 'audio'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeFilter === f
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text hover:bg-background border border-border'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <HeroSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`break-inside-avoid ${
                    index % 4 === 0
                      ? 'aspect-[3/4]'
                      : index % 4 === 1
                      ? 'aspect-square'
                      : index % 4 === 2
                      ? 'aspect-[4/5]'
                      : 'aspect-[3/4]'
                  }`}
                >
                  {item.type === 'video' && <VideoCard video={item} />}
                  {item.type === 'photo' && <PhotoCard photo={item} />}
                  {item.type === 'audio' && <AudioCard audio={item} />}
                </div>
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
    </section>
  );
}