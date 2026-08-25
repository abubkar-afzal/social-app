import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchMediaBatch } from '../../utils/mockData';
import { PlayIcon, PauseIcon } from '../../icons';

export default function DesktopAudioGrid() {
  const [audios, setAudios] = useState([]);
  const [page, setPage] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const audioRefs = useRef({}); // store refs for each audio element
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
    } else {
      setAudios(prev => [...prev, ...items]);
    }
    setPage(prev => prev + 1);
  };

  const togglePlay = (e, audioId) => {
    e.preventDefault();
    e.stopPropagation();

    // Stop any currently playing audio
    if (playingId && playingId !== audioId) {
      const prevAudio = audioRefs.current[playingId];
      if (prevAudio) {
        prevAudio.pause();
        prevAudio.currentTime = 0;
      }
    }

    if (playingId === audioId) {
      // Pause current
      const currentAudio = audioRefs.current[audioId];
      if (currentAudio) {
        currentAudio.pause();
      }
      setPlayingId(null);
    } else {
      // Play new audio
      setPlayingId(audioId);
      // The audio element will autoPlay when rendered because we set autoPlay based on playingId
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Audio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {audios.map((audio) => (
          <Link to={`/media/${audio.id}`} key={audio.id}>
            <div className="rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <button
                  onClick={(e) => togglePlay(e, audio.id)}
                  className="rounded-full bg-white/20 p-4 hover:bg-white/30 transition"
                >
                  {playingId === audio.id ? (
                    <PauseIcon className="h-12 w-12 text-white" />
                  ) : (
                    <PlayIcon className="h-12 w-12 text-white" />
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
              <div className="p-4">
                <h3 className="font-semibold truncate">{audio.title}</h3>
                <p className="text-sm text-text-secondary">{audio.views} views</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div ref={sentinelRef} className="h-10" />
    </div>
  );
}