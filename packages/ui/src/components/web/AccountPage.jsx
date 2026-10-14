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
import CropperModal from './CropperModal';
/* ---------- Reusable ---------- */
function UserCard({ user, onFollowChange }) {
  const [following, setFollowing] = useState(user.isFollowedByMe);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const next = !following;
    setFollowing(next);
    try {
      const res = await authFetch(apiUrl(`/api/user/${user.id}/follow`), {
        method: next ? 'POST' : 'DELETE',
      });
      if (!res.ok) throw new Error('failed');
      onFollowChange?.(user.id, next);
    } catch {
      setFollowing(!next);
    }
    setBusy(false);
  };

  return (
    <div className="bg-surface rounded-xl shadow-md p-4 flex items-center gap-3">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name || 'User'} className="w-12 h-12 rounded-full object-cover" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          {(user.name || 'U')[0].toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text truncate">{user.name || 'User'}</p>
        <p className="text-xs text-text-secondary truncate">{user.email}</p>
      </div>
      <button
        onClick={toggle}
        disabled={busy}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
          following ? 'bg-background text-text border border-border' : 'bg-primary text-white hover:bg-primary-dark'
        } disabled:opacity-50`}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}

export default function AccountPage() {
  const { user, loading: authLoading, logout, setUser } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
const [cropperOpen, setCropperOpen] = useState(false);
const [rawAvatarSrc, setRawAvatarSrc] = useState('');
  // Tabs
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'followers' | 'following'
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // Edit Profile
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Edit Media
  const [mediaEditOpen, setMediaEditOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaType, setMediaType] = useState('PHOTO');
  const [savingMedia, setSavingMedia] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
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

  useEffect(() => {
    if (!user || activeTab === 'posts') return;
    const load = async () => {
      setLoadingLists(true);
      try {
        const endpoint = activeTab === 'followers' ? 'followers' : 'following';
        const res = await authFetch(apiUrl(`/api/user/${user.id}/${endpoint}`));
        if (res.ok) {
          const data = await res.json();
          if (activeTab === 'followers') setFollowers(data.users || []);
          else setFollowing(data.users || []);
        }
      } catch (e) {
        console.error(e);
      }
      setLoadingLists(false);
    };
    load();
  }, [user, activeTab]);

  /* ---------- Profile ---------- */
  const openEdit = () => {
    setEditName(user.name || '');
    setEditBio(user.bio || '');
    setAvatarFile(null);
    setAvatarPreview(user.avatarUrl || '');
    setEditOpen(true);
  };
const handleAvatarCropDone = ({ blob, previewUrl }) => {
  // Convert blob to File so the existing upload logic works
  const croppedFile = new File([blob], `avatar_${Date.now()}.jpg`, { type: 'image/jpeg' });
  setAvatarFile(croppedFile);
  setAvatarPreview(previewUrl);
  setCropperOpen(false);
  setRawAvatarSrc('');
};
  const handleAvatarSelect = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    setRawAvatarSrc(reader.result);
    setCropperOpen(true);
  };
  reader.readAsDataURL(f);
};

  const saveProfile = async () => {
    setSaving(true);
    try {
      let newAvatarUrl = user.avatarUrl || '';
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

      const profileRes = await authFetch(apiUrl('/api/user/profile'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, bio: editBio, avatarUrl: newAvatarUrl }),
      });
      if (profileRes.ok) {
        const updated = await profileRes.json();
        if (setUser) setUser(updated);
        setEditOpen(false);
      }
    } catch (e) {
      alert(e.message || 'Failed to save profile');
    }
    setSaving(false);
  };

  /* ---------- Media Edit ---------- */
  const openMediaEdit = (item) => {
    setEditingMedia(item);
    setMediaTitle(item.title || '');
    setMediaDescription(item.description || '');
    setMediaType(item.type || 'PHOTO');
    setMediaEditOpen(true);
  };

  const saveMedia = async () => {
    if (!editingMedia) return;
    setSavingMedia(true);
    try {
      const res = await authFetch(apiUrl(`/api/user/media/${editingMedia.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: mediaTitle, description: mediaDescription, type: mediaType }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMedia((prev) => prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)));
        setMediaEditOpen(false);
        setEditingMedia(null);
      }
    } catch (e) {
      console.error(e);
    }
    setSavingMedia(false);
  };

  /* ---------- Delete ---------- */
  const confirmDelete = (item) => setDeleteTarget(item);
  const performDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await authFetch(apiUrl(`/api/user/media/${deleteTarget.id}`), { method: 'DELETE' });
      if (res.ok) setMedia((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    } catch (e) {
      console.error(e);
    }
    setDeleteTarget(null);
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
    // Replace container:
<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">

<div className="bg-surface rounded-2xl shadow-md p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
    {user.avatarUrl ? (
      <img
        src={user.avatarUrl}
        alt={user.name || 'User'}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary shrink-0"
        onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?img=1'; }}
      />
    ) : (
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-primary flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shrink-0">
        {(user.name || 'U')[0].toUpperCase()}
      </div>
    )}

    <div className="flex-1 text-center sm:text-left min-w-0">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text truncate">{user.name || 'User'}</h1>
      <p className="text-text-secondary text-sm mt-1 truncate">{user.email}</p>
      {user.bio && <p className="text-text-secondary text-sm mt-2">{user.bio}</p>}

      <div className="flex justify-center sm:justify-start gap-4 sm:gap-6 mt-3 sm:mt-4">
        <div className="text-center">
          <p className="text-lg sm:text-2xl font-bold text-text">{stats.total}</p>
          <p className="text-xs sm:text-sm text-text-secondary">Posts</p>
        </div>
        <button onClick={() => setActiveTab('followers')} className="text-center">
          <p className="text-lg sm:text-2xl font-bold text-text">{followers.length}</p>
          <p className="text-xs sm:text-sm text-text-secondary">Followers</p>
        </button>
        <button onClick={() => setActiveTab('following')} className="text-center">
          <p className="text-lg sm:text-2xl font-bold text-text">{following.length}</p>
          <p className="text-xs sm:text-sm text-text-secondary">Following</p>
        </button>
      </div>
    </div>

    <div className="flex flex-col sm:flex-col gap-2 w-full sm:w-auto">
      <button
        onClick={openEdit}
        className="bg-surface border border-primary text-primary px-4 sm:px-6 py-2 rounded-full hover:bg-primary hover:text-white transition flex items-center justify-center gap-2 text-sm"
      >
        <EditIcon className="h-4 w-4" /> Edit Profile
      </button>
      <Link
        href="/uploadmedia"
        className="bg-primary text-white px-4 sm:px-6 py-2 rounded-full hover:bg-primary-dark transition flex items-center justify-center gap-2 text-sm"
      >
        <PlusIcon className="h-4 w-4" /> Create Post
      </Link>
      <button
        onClick={handleLogout}
        className="bg-surface border border-error text-error px-4 sm:px-6 py-2 rounded-full hover:bg-error hover:text-white transition flex items-center justify-center gap-2 text-sm"
      >
        <LogoutIcon className="h-4 w-4" /> Sign Out
      </button>
    </div>
  </div>
</div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-border overflow-x-auto">
  {[
    { key: 'posts', label: 'Posts' },
    { key: 'followers', label: 'Followers' },
    { key: 'following', label: 'Following' },
  ].map((tab) => (
    <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key)}
      className={`px-3 sm:px-5 py-3 text-sm font-medium transition border-b-2 -mb-px whitespace-nowrap ${
        activeTab === tab.key
          ? 'border-primary text-primary'
          : 'border-transparent text-text-secondary hover:text-text'
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>

      {/* POSTS TAB */}
      {activeTab === 'posts' && (
        <>
          <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
  {[
    { key: 'all', label: 'All' },
    { key: 'video', label: '🎬 Videos' },
    { key: 'photo', label: '🖼️ Photos' },
    { key: 'audio', label: '🎵 Audio' },
  ].map((f) => (
    <button
      key={f.key}
      onClick={() => setFilter(f.key)}
      className={`px-4 sm:px-5 py-2 rounded-full text-sm whitespace-nowrap shrink-0 transition ${
        filter === f.key ? 'bg-primary text-white' : 'bg-surface text-text border border-border hover:bg-background'
      }`}
    >
      {f.label}
    </button>
  ))}
</div>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
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
                        <video
                          src={apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`)}
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
                      {item.type === 'PHOTO' && (
                        <img
                          src={apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      {item.type === 'AUDIO' && (
                        <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
                          <PlayIcon className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openMediaEdit(item)}
                      className="rounded-full bg-white/90 p-2 hover:bg-primary hover:text-white"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(item)}
                      className="rounded-full bg-white/90 p-2 hover:bg-error hover:text-white"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-semibold text-text truncate">{item.title}</p>
                    <p className="text-xs text-text-secondary">
                      {item.viewsCount} views · {item.likesCount} likes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* FOLLOWERS TAB */}
      {activeTab === 'followers' && (
        <>
          {loadingLists ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : followers.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-2xl text-text-secondary">No followers yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
  {followers.map((u) => <UserCard key={u.id} user={u} />)}
</div>
          )}
        </>
      )}

      {/* FOLLOWING TAB */}
      {activeTab === 'following' && (
        <>
          {loadingLists ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : following.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-2xl text-text-secondary">Not following anyone yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {following.map((u) => (
                <UserCard key={u.id} user={u} />
              ))}
            </div>
          )}
        </>
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
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-24 h-24 rounded-full object-cover border-4 border-primary" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                    {(editName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark"
                >
                  <EditIcon className="h-4 w-4" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
              </div>
              <p className="text-xs text-text-secondary mt-2">
                {avatarFile ? avatarFile.name : 'Click the pencil to change your picture'}
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
              <button onClick={() => setEditOpen(false)} className="flex-1 bg-surface border border-border text-text py-2 rounded-lg hover:bg-background">
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

      {/* Edit Media Modal */}
      {mediaEditOpen && editingMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text">Edit Post</h2>
              <button
                onClick={() => {
                  setMediaEditOpen(false);
                  setEditingMedia(null);
                }}
                className="p-1 hover:bg-background rounded-full"
              >
                <CloseIcon className="h-5 w-5 text-text-secondary" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={mediaDescription}
                  onChange={(e) => setMediaDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <div className="flex gap-2">
                  {['PHOTO', 'VIDEO', 'AUDIO'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMediaType(t)}
                      className={`flex-1 py-2 rounded-lg font-medium transition ${
                        mediaType === t ? 'bg-primary text-white' : 'bg-background border border-border text-text'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setMediaEditOpen(false);
                  setEditingMedia(null);
                }}
                className="flex-1 bg-surface border border-border text-text py-2 rounded-lg hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={saveMedia}
                disabled={savingMedia}
                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {savingMedia ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-text mb-3">Delete post?</h2>
            <p className="text-text-secondary text-sm mb-6">
              "{deleteTarget.title}" will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-surface border border-border text-text py-2 rounded-lg hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                className="flex-1 bg-error text-white py-2 rounded-lg hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {cropperOpen && rawAvatarSrc && (
  <CropperModal
    imageSrc={rawAvatarSrc}
    aspect={1}
    circular={true}
    title="Crop your profile picture"
    onCancel={() => {
      setCropperOpen(false);
      setRawAvatarSrc('');
    }}
    onCropDone={handleAvatarCropDone}
  />
)}
    </div>
  );
}