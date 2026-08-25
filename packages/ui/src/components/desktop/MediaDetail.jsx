import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMediaById, fetchSuggestions } from '../../utils/mockData';
import { PlayIcon, PauseIcon, BookmarkIcon, PlusIcon, HeartIcon, ShareIcon, CommentIcon, MoreIcon } from '../../icons';

// Video Player
const VideoPlayer = ({ src }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video object-cover bg-black"
        autoPlay
        muted={isMuted}
        loop
        playsInline
      />
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};

// Audio Player
const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full aspect-video bg-gradient-to-br from-primary-light via-primary to-primary-dark flex flex-col items-center justify-center p-8">
      <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6">
        <button onClick={togglePlay} className="p-4">
          {isPlaying ? <PauseIcon className="h-12 w-12 text-white" /> : <PlayIcon className="h-12 w-12 text-white" />}
        </button>
      </div>
      <div className="w-full max-w-md">
        <div className="flex justify-between text-white text-sm mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 cursor-pointer">
          <div className="bg-white h-2 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={src}
        className="hidden"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

// Suggestion Card
const SuggestionCard = ({ item }) => (
  <Link to={`/media/${item.id}`}>
    <div className="group rounded-lg overflow-hidden bg-surface shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="aspect-square overflow-hidden">
        {item.type === 'video' && (
          <video
            src={item.src}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />
        )}
        {item.type === 'photo' && (
          <img src={item.src} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        )}
        {item.type === 'audio' && (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <PlayIcon className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <img src={item.userAvatar} alt={item.user} className="w-6 h-6 rounded-full" />
          <span className="text-xs text-text-secondary truncate">{item.user}</span>
        </div>
        <p className="text-sm font-semibold truncate">{item.title}</p>
        <p className="text-xs text-text-secondary">{item.views} views</p>
      </div>
    </div>
  </Link>
);

export default function DesktopMediaDetail() {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadMedia();
  }, [id]);

  const loadMedia = async () => {
    setLoading(true);
    const item = await fetchMediaById(id);
    setMedia(item);
    const sugg = await fetchSuggestions(item.type, id);
    setSuggestions(sugg);
    setLoading(false);
  };

  const addComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([
        ...comments,
        { id: comments.length + 1, user: 'Demo User', avatar: 'https://i.pravatar.cc/150?img=5', text: comment, time: 'Just now' },
      ]);
      setComment('');
    }
  };

  if (loading || !media) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden bg-surface shadow-lg">
            {media.type === 'video' && <VideoPlayer src={media.src} />}
            {media.type === 'photo' && <img src={media.src} alt={media.title} className="w-full object-cover" />}
            {media.type === 'audio' && <AudioPlayer src={media.src} />}
          </div>

          <div className="mt-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text">{media.title}</h1>
                <p className="text-text-secondary mt-1">{media.description}</p>
                <div className="flex gap-2 mt-3">
                  {media.tags?.map((tag) => (
                    <span key={tag} className="text-xs bg-background px-3 py-1 rounded-full text-text-secondary">#{tag}</span>
                  ))}
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-background"><MoreIcon className="h-6 w-6 text-text-secondary" /></button>
            </div>

            <div className="flex gap-6 mt-4 text-sm">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 ${isLiked ? 'text-primary' : 'text-text-secondary'}`}
              >
                <HeartIcon className="h-6 w-6" />
                <span>{media.likes + (isLiked ? 1 : 0)}</span>
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-2 ${isSaved ? 'text-primary' : 'text-text-secondary'}`}
              >
                <BookmarkIcon className="h-6 w-6" />
                <span>{media.saves + (isSaved ? 1 : 0)}</span>
              </button>
              <button className="flex items-center gap-2 text-text-secondary">
                <ShareIcon className="h-6 w-6" />
                <span>Share</span>
              </button>
            </div>

            <div className="flex items-center gap-4 mt-6 bg-surface rounded-xl p-4">
              <img src={media.userAvatar} alt={media.user} className="w-14 h-14 rounded-full" />
              <div className="flex-1">
                <p className="font-semibold text-text">{media.user}</p>
                <p className="text-sm text-text-secondary">1.2k followers</p>
              </div>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  isFollowing
                    ? 'bg-background text-text border border-border'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold text-text mb-4">Comments ({comments.length})</h2>
              <form onSubmit={addComment} className="flex gap-3 mb-6">
                <img src="https://i.pravatar.cc/150?img=5" alt="You" className="w-10 h-10 rounded-full" />
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-surface rounded-full px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark">Post</button>
              </form>
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <img src={c.avatar} alt={c.user} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-sm">{c.user}</p>
                      <p className="text-text-secondary">{c.text}</p>
                      <p className="text-xs text-text-secondary mt-1">{c.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-text mb-4">More like this</h2>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
            {suggestions.map((item) => <SuggestionCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
}