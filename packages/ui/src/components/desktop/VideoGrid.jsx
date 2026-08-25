import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchMediaBatch } from '../../utils/mockData';

export default function DesktopVideoGrid() {
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
    const items = await fetchMediaBatch(pageNum, 9, 'video');
    if (pageNum === 0) {
      setVideos(items);
      setLoading(false);
    } else {
      setVideos(prev => [...prev, ...items]);
    }
    setPage(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link to={`/media/${video.id}`} key={video.id}>
            <div className="rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <video
                src={video.src}
                className="w-full aspect-video object-cover"
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
              <div className="p-4">
                <h3 className="font-semibold truncate">{video.title}</h3>
                <p className="text-sm text-text-secondary">{video.views} views</p>
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