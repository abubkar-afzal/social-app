import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchMediaBatch } from '../../utils/mockData';

export default function PhotoGrid() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const sentinelRef = useRef(null);

  useEffect(() => {
    loadPhotos(0);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadPhotos(page);
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page]);

  const loadPhotos = async (pageNum) => {
    const items = await fetchMediaBatch(pageNum, 12, 'photo');
    if (pageNum === 0) {
      setPhotos(items);
      setLoading(false);
    } else {
      setPhotos(prev => [...prev, ...items]);
    }
    setPage(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Photos</h1>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
        {photos.map((photo) => (
          <Link href={`/media/${photo.id}`} key={photo.id}>
            <div className="break-inside-avoid rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <img src={photo.src} alt={photo.title} className="w-full object-cover" loading="lazy" />
              <div className="p-2 sm:p-3">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  {photo.user?.avatarUrl ? (
                    <img src={photo.user.avatarUrl} alt={photo.user.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                      {(photo.user?.name || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-[10px] sm:text-xs text-text-secondary truncate">{photo.user?.name || 'User'}</span>
                </div>
                <h3 className="font-semibold truncate text-xs sm:text-sm">{photo.title}</h3>
                <p className="text-[10px] sm:text-xs text-text-secondary">{photo.viewsCount || 0} views</p>
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