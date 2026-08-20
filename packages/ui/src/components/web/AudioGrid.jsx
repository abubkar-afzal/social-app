import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchMediaBatch } from '../../utils/mockData';
import { PlayIcon, PauseIcon } from '../../icons';

export default function AudioGrid() {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    loadAudios(0);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadAudios(page);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page]);

  const loadAudios = async (pageNum) => {
    const items = await fetchMediaBatch(pageNum, 6, 'audio');
    if (pageNum === 0) {
      setAudios(items);
      setLoading(false);
    } else {
      setAudios(prev => [...prev, ...items]);
    }
    setPage(prev => prev + 1);
  };

  const togglePlay = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Audio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {audios.map((audio) => (
          <div key={audio.id} className="rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <button
                onClick={() => togglePlay(audio.id)}
                className="rounded-full bg-white/20 p-4 hover:bg-white/30 transition"
              >
                {playingId === audio.id ? (
                  <PauseIcon className="h-12 w-12 text-white" />
                ) : (
                  <PlayIcon className="h-12 w-12 text-white" />
                )}
              </button>
              {playingId === audio.id && <audio src={audio.src} autoPlay className="hidden" />}
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{audio.title}</h3>
              <p className="text-sm text-text-secondary">{audio.views} views</p>
            </div>
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className="h-10" />
      {loading && <div className="text-center py-4">Loading...</div>}
    </div>
  );
}