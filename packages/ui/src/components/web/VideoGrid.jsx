import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchMediaBatch } from '../../utils/mockData';

export default function VideoGrid() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const sentinelRef = useRef(null);

  useEffect(() => {
    loadVideos(0);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadVideos(page);
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page]);

  const loadVideos = async (pageNum) => {
    const items = await fetchMediaBatch(pageNum, 8, 'video');
    if (pageNum === 0) {
      setVideos(items);
      setLoading(false);
    } else {
      setVideos(prev => [...prev, ...items]);
    }
    setPage(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {videos.map((video) => (
          <Link href={`/media/${video.id}`} key={video.id}>
            <div className="rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <video
                src={video.src}
                className="w-full aspect-video object-cover"
                muted
                loop
                autoPlay
                playsInline
                preload="auto"
              />
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  {video.user?.avatarUrl ? (
                    <img src={video.user.avatarUrl} alt={video.user.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {(video.user?.name || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-text-secondary truncate">{video.user?.name || 'User'}</span>
                </div>
                <h3 className="font-semibold text-sm sm:text-base truncate">{video.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary">{video.viewsCount || 0} views</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div ref={sentinelRef} className="h-10" />
      {loading && <div className="text-center py-4">Loading...</div>}
    </div>
  );
}