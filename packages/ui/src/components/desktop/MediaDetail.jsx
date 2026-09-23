import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMediaById, fetchSuggestions } from '../../utils/mockData';
import { apiUrl, authFetch } from '../../utils/apiConfig';
import { useAuth } from '../../utils/useAuth';
import {
  PlayIcon, PauseIcon, BookmarkIcon, HeartIcon, ShareIcon, EyeIcon,
} from '../../icons';

const getUserDisplayName = (user) => {
  if (!user) return 'Unknown';
  return user.name || user.email?.split('@')[0] || 'User';
};

const getUserInitial = (user) => getUserDisplayName(user).charAt(0).toUpperCase();

const VideoPlayer = ({ src }) => {
  const [isMuted, setIsMuted] = useState(true);
  return (
    <div className="relative">
      <video src={src} className="w-full aspect-video object-cover bg-black" autoPlay muted={isMuted} loop playsInline controls />
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };
  const onTimeUpdate = () => {
    if (audioRef.current) {
      const c = audioRef.current.currentTime;
      const d = audioRef.current.duration || 1;
      setCurrentTime(c);
      setDuration(d);
      setProgress((c / d) * 100);
    }
  };
  const fmt = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
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
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <audio ref={audioRef} src={src} className="hidden" onTimeUpdate={onTimeUpdate} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

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
        <p className="text-sm font-semibold truncate">{item.title}</p>
        <p className="text-xs text-text-secondary">{item.views} views</p>
      </div>
    </div>
  </Link>
);

export default function DesktopMediaDetail() {
  const { id: mediaId } = useParams();
  const { user } = useAuth();

  const [media, setMedia] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [following, setFollowing] = useState(false);
  const [isOwnPost, setIsOwnPost] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (mediaId) loadMedia();
  }, [mediaId, user?.id]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const item = await fetchMediaById(mediaId);
      setMedia(item);
      setLikesCount(item.likesCount || 0);
      setFavoritesCount(item.favoritesCount || 0);
      setLiked(item.liked || false);
      setFavorited(item.favorited || false);
      setFollowing(item.following || false);
      setIsOwnPost(item.isOwnPost || false);

      authFetch(apiUrl(`/api/media/${mediaId}/view`), { method: 'POST' }).catch(() => {});

      try {
        const res = await fetch(apiUrl(`/api/media/${mediaId}/comments`));
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (e) { console.error(e); }

      const sugg = await fetchSuggestions(item.type, mediaId);
      setSuggestions(sugg);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const requireAuth = () => {
    if (!user) {
      alert('Please sign in to use this feature.');
      return false;
    }
    return true;
  };

  const toggleLike = async () => {
    if (!requireAuth()) return;
    const next = !liked;
    setLiked(next);
    setLikesCount((c) => c + (next ? 1 : -1));
    try {
      await authFetch(apiUrl(`/api/media/${mediaId}/like`), { method: next ? 'POST' : 'DELETE' });
    } catch (e) {
      setLiked(!next);
      setLikesCount((c) => c + (next ? -1 : 1));
    }
  };

  const toggleFavorite = async () => {
    if (!requireAuth()) return;
    const next = !favorited;
    setFavorited(next);
    setFavoritesCount((c) => c + (next ? 1 : -1));
    try {
      await authFetch(apiUrl(`/api/media/${mediaId}/favorite`), { method: next ? 'POST' : 'DELETE' });
    } catch (e) {
      setFavorited(!next);
      setFavoritesCount((c) => c + (next ? -1 : 1));
    }
  };

  const toggleFollow = async () => {
    if (!requireAuth() || isOwnPost) return;
    const next = !following;
    setFollowing(next);
    try {
      await authFetch(apiUrl(`/api/user/${media.userId}/follow`), { method: next ? 'POST' : 'DELETE' });
    } catch (e) { setFollowing(!next); }
  };

  const shareMedia = async () => {
    const url = `http://localhost:3000/media/${media.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: media.title,
          text: media.description || 'Check out this post on PinShare!',
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } catch (e) {}
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      const res = await authFetch(apiUrl(`/api/media/${mediaId}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentText('');
      }
    } catch (e) { console.error(e); }
    setPostingComment(false);
  };

  const deleteComment = async (commentId) => {
    if (!requireAuth()) return;
    if (!confirm('Delete this comment?')) return;
    try {
      const res = await authFetch(apiUrl(`/api/media/${mediaId}/comments`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });
      if (res.ok) setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) { console.error(e); }
  };

  if (loading || !media) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const posterName = getUserDisplayName(media.user);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden bg-surface shadow-lg">
            {media.type === 'video' && <VideoPlayer src={media.src} />}
            {media.type === 'photo' && <img src={media.src} alt={media.title} className="w-full object-cover" />}
            {media.type === 'audio' && <AudioPlayer src={media.src} />}
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold text-text">{media.title}</h1>
            {media.description && <p className="text-text-secondary mt-1">{media.description}</p>}

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={toggleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                  liked ? 'bg-primary text-white border-primary' : 'bg-surface text-text border-border hover:border-primary'
                }`}
              >
                <HeartIcon className="h-5 w-5" />
                <span>{likesCount}</span>
              </button>

              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                  favorited ? 'bg-primary text-white border-primary' : 'bg-surface text-text border-border hover:border-primary'
                }`}
              >
                <BookmarkIcon className="h-5 w-5" />
                <span>{favoritesCount}</span>
              </button>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface text-text-secondary">
                <EyeIcon className="h-5 w-5" />
                <span>{media.viewsCount || 0}</span>
              </div>

              <button
                onClick={shareMedia}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface text-text hover:border-primary transition"
              >
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 bg-surface rounded-xl p-4">
            {media.user?.avatarUrl ? (
              <img src={media.user.avatarUrl} alt={posterName} className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                {getUserInitial(media.user)}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-text">{posterName}</p>
              {media.user?.followersCount !== undefined && (
                <p className="text-sm text-text-secondary">{media.user.followersCount} followers</p>
              )}
            </div>
            {!isOwnPost && (
              <button
                onClick={toggleFollow}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  following ? 'bg-background text-text border border-border' : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold text-text mb-4">Comments ({comments.length})</h2>

            <form onSubmit={submitComment} className="flex gap-3 mb-6">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="You" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  {(user?.name || 'U')[0].toUpperCase()}
                </div>
              )}
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={user ? 'Add a comment...' : 'Sign in to comment'}
                disabled={!user}
                className="flex-1 bg-surface rounded-full px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={postingComment || !commentText.trim() || !user}
                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark disabled:opacity-50"
              >
                {postingComment ? '...' : 'Post'}
              </button>
            </form>

            {comments.length === 0 ? (
              <p className="text-text-secondary text-sm">No comments yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    {c.user.avatarUrl ? (
                      <img src={c.user.avatarUrl} alt={c.user.name || 'User'} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                        {(c.user.name || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{c.user.name || 'User'}</p>
                        <p className="text-xs text-text-secondary">{new Date(c.createdAt).toLocaleDateString()}</p>
                        {user?.id === c.user.id && (
                          <button onClick={() => deleteComment(c.id)} className="ml-auto text-error text-xs hover:underline">
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-text-secondary mt-1">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-text mb-4">More like this</h2>
          <div className="grid grid-cols-2 gap-4">
            {suggestions.map((item) => <SuggestionCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
}