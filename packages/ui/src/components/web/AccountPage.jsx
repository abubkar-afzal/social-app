import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/useAuth';
import { apiUrl, authFetch } from '../../utils/apiConfig';
import {
  PlayIcon,
  PencilSquareIcon as EditIcon,
  TrashIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  XMarkIcon as CloseIcon,
} from '../../icons';

export default function AccountPage() {
  const { user, loading: authLoading, logout, setUser } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      try {
        const res = await authFetch(apiUrl('/api/user/media'));
        if (res.ok) {
          const data = await res.json();
          setMedia(data.media || []);
        }
      } catch (e) {
        console.error('Failed to load user media', e);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const openEdit = () => {
    setEditName(user.name || '');
    setEditBio(user.bio || '');
    setAvatarFile(null);
    setAvatarPreview(user.avatarUrl || '');
    setEditOpen(true);
  };

  const handleAvatarSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      let newAvatarUrl = user.avatarUrl || '';

      // 1. Upload avatar if a new file was selected
      if (avatarFile) {
        setUploadingAvatar(true);
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const avatarRes = await authFetch(apiUrl('/api/user/avatar'), {
          method: 'POST',
          body: formData,
        });

        if (!avatarRes.ok) {
          const err = await avatarRes.json().catch(() => ({}));
          throw new Error(err.error || 'Avatar upload failed');
        }

        const avatarData = await avatarRes.json();
        newAvatarUrl = avatarData.avatarUrl;
        setUploadingAvatar(false);
      }

      // 2. Update name/bio (and avatar if changed)
      const profileRes = await authFetch(apiUrl('/api/user/profile'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          bio: editBio,
          avatarUrl: newAvatarUrl,
        }),
      });

      if (profileRes.ok) {
        const updated = await profileRes.json();
        if (setUser) setUser(updated);
        setEditOpen(false);
      } else {
        alert('Failed to save profile');
      }
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to save profile');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    const res = await authFetch(apiUrl(`/api/user/media/${id}`), { method: 'DELETE' });
    if (res.ok) setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-text mb-4">Please sign in</h1>
        <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark">
          Sign In
        </Link>
      </div>
    );
  }

  const filteredMedia =
    filter === 'all' ? media : media.filter((m) => m.type.toLowerCase() === filter);
  const stats = {
    total: media.length,
    videos: media.filter((m) => m.type === 'VIDEO').length,
    photos: media.filter((m) => m.type === 'PHOTO').length,
    audios: media.filter((m) => m.type === 'AUDIO').length,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile header */}
      <div className="bg-surface rounded-2xl shadow-md p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || 'User'}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary"
              onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?img=1'; }}
            />
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold">
              {(user.name || 'U')[0].toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-text">{user.name || 'User'}</h1>
            <p className="text-text-secondary mt-1">{user.email}</p>
            {user.bio && <p className="text-text-secondary mt-2">{user.bio}</p>}

            <div className="flex justify-center md:justify-start gap-6 mt-4">
              <div className="text-center"><p className="text-2xl font-bold text-text">{stats.total}</p><p className="text-sm text-text-secondary">Posts</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-text">{stats.videos}</p><p className="text-sm text-text-secondary">Videos</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-text">{stats.photos}</p><p className="text-sm text-text-secondary">Photos</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-text">{stats.audios}</p><p className="text-sm text-text-secondary">Audio</p></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button
              onClick={openEdit}
              className="bg-surface border border-primary text-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition flex items-center justify-center gap-2"
            >
              <EditIcon className="h-5 w-5" /> Edit Profile
            </button>
            <Link href="/uploadmedia" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition flex items-center justify-center gap-2">
              <PlusIcon className="h-5 w-5" /> Create Post
            </Link>
            <button
              onClick={handleLogout}
              className="bg-surface border border-error text-error px-6 py-2 rounded-full hover:bg-error hover:text-white transition flex items-center justify-center gap-2"
            >
              <LogoutIcon className="h-5 w-5" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { key: 'all', label: 'All' },
          { key: 'video', label: '🎬 Videos' },
          { key: 'photo', label: '🖼️ Photos' },
          { key: 'audio', label: '🎵 Audio' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-5 py-2 rounded-full whitespace-nowrap transition ${
              filter === f.key ? 'bg-primary text-white' : 'bg-surface text-text border border-border hover:bg-background'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Media grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl">
          <p className="text-text-secondary mb-4">No posts yet.</p>
          <Link href="/uploadmedia" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden bg-surface shadow-md hover:shadow-xl transition-all">
              <Link href={`/media/${item.id}`}>
                <div className="aspect-square overflow-hidden">
                  {item.type === 'VIDEO' && (
                    <video src={apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`)} className="w-full h-full object-cover" muted loop playsInline
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }} />
                  )}
                  {item.type === 'PHOTO' && (
                    <img src={apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`)} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  )}
                  {item.type === 'AUDIO' && (
                    <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
                      <PlayIcon className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
              </Link>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(item.id)} className="rounded-full bg-white/90 p-2 hover:bg-error hover:text-white">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-text truncate">{item.title}</p>
                <p className="text-xs text-text-secondary">{item.viewsCount} views · {item.likesCount} likes</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} className="p-1 hover:bg-background rounded-full">
                <CloseIcon className="h-5 w-5 text-text-secondary" />
              </button>
            </div>

            {/* Avatar upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                    {(editName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition"
                  title="Change avatar"
                >
                  <PencilSquareIconSmall />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-text-secondary mt-2">
                {avatarFile ? avatarFile.name : 'Tap the pencil to change your picture'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 bg-surface border border-border text-text py-2 rounded-lg hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={saving || uploadingAvatar}
                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {uploadingAvatar ? 'Uploading...' : saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Small inline pencil icon for the avatar button
function PencilSquareIconSmall() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}