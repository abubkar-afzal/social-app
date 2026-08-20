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
        if (entries[0].isIntersecting) {
          loadPhotos(page);
        }
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Photos</h1>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo) => (
          <Link href={`/media/${photo.id}`} key={photo.id}>
            <div className="break-inside-avoid rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <img src={photo.src} alt={photo.title} className="w-full object-cover" loading="lazy" />
              <div className="p-3">
                <h3 className="font-semibold truncate text-sm">{photo.title}</h3>
                <p className="text-xs text-text-secondary">{photo.views} views</p>
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