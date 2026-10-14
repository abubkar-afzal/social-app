import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchMediaBatch } from '../../utils/mockData';
import { PlayIcon, PauseIcon } from '../../icons';

export default function AudioGrid() {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const audioRefs = useRef({});
  const sentinelRef = useRef(null);

  useEffect(() => {
    loadAudios(0);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadAudios(page);
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

  const togglePlay = (e, audioId) => {
    e.preventDefault();
    e.stopPropagation();
    if (playingId === audioId) {
      const current = audioRefs.current[audioId];
      if (current) current.pause();
      setPlayingId(null);
    } else {
      if (playingId) {
        const prev = audioRefs.current[playingId];
        if (prev) prev.pause();
      }
      setPlayingId(audioId);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Audio</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {audios.map((audio) => (
          <Link href={`/media/${audio.id}`} key={audio.id}>
            <div className="rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <button
                  onClick={(e) => togglePlay(e, audio.id)}
                  className="rounded-full bg-white/20 p-3 sm:p-4 hover:bg-white/30 transition"
                >
                  {playingId === audio.id ? (
                    <PauseIcon className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                  ) : (
                    <PlayIcon className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                  )}
                </button>
                {playingId === audio.id && (
                  <audio
                    ref={(el) => (audioRefs.current[audio.id] = el)}
                    src={audio.src}
                    autoPlay
                    className="hidden"
                    onEnded={() => setPlayingId(null)}
                  />
                )}
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  {audio.user?.avatarUrl ? (
                    <img src={audio.user.avatarUrl} alt={audio.user.name} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                      {(audio.user?.name || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-[10px] sm:text-xs text-text-secondary truncate">{audio.user?.name || 'User'}</span>
                </div>
                <h3 className="font-semibold text-sm sm:text-base truncate">{audio.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary">{audio.viewsCount || 0} views</p>
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