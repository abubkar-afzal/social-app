// packages/ui/src/utils/mockData.js
import { apiUrl, authFetch } from './apiConfig';

/* -------------------------------------------------------------------------- */
/*                              MEDIA FETCHERS                                */
/* -------------------------------------------------------------------------- */

/**
 * Fetch a batch of media (list endpoint).
 * IMPORTANT: `user` stays as an OBJECT so components can access user.name, user.avatarUrl, etc.
 */
export const fetchMediaBatch = async (page, pageSize = 10, type = null) => {
  const params = new URLSearchParams({ page, limit: pageSize });
  if (type) params.append('type', String(type).toUpperCase());

  const res = await authFetch(apiUrl(`/api/media?${params}`));
  if (!res.ok) throw new Error('Failed to fetch media');

  const data = await res.json();

  return (data.media || []).map((item) => ({
    ...item,
    // convert uppercase enum to lowercase for components
    type: item.type.toLowerCase(),
    // build playable stream URL
    src: apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`),
    thumbnail: item.thumbnailUrl || null,
    // legacy aliases used by some components
    likes: item.likesCount,
    views: item.viewsCount,
    // DO NOT touch item.user — keep it as an object: { id, name, avatarUrl, email }
  }));
};

/**
 * Fetch a single media by id (detail endpoint).
 */
export const fetchMediaById = async (id) => {
  const res = await authFetch(apiUrl(`/api/media/${id}`));
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch media');
  }

  const item = await res.json();

  return {
    ...item,
    type: item.type.toLowerCase(),
    src: apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`),
    thumbnail: item.thumbnailUrl || null,
    likes: item.likesCount,
    views: item.viewsCount,
    // user, liked, favorited, following, isOwnPost all preserved from API response
  };
};

/**
 * Fetch suggestions (same type, exclude current id).
 */
export const fetchSuggestions = async (type, excludeId, limit = 8) => {
  const items = await fetchMediaBatch(0, limit + 1, type);
  return items.filter((item) => item.id !== excludeId).slice(0, limit);
};

/* -------------------------------------------------------------------------- */
/*                              MEDIA MUTATIONS                               */
/* -------------------------------------------------------------------------- */

/**
 * Upload media via form-data.
 * The caller is responsible for building the FormData.
 * The Authorization header is added automatically by `authFetch`.
 */
export const uploadMedia = async (formData) => {
  const res = await authFetch(apiUrl('/api/media/upload'), {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
};

/* -------------------------------------------------------------------------- */
/*                                SOCIAL APIs                                 */
/* -------------------------------------------------------------------------- */

/**
 * Toggle like on a media. Returns the new liked state.
 */
export const toggleLikeApi = async (mediaId, like) => {
  const res = await authFetch(apiUrl(`/api/media/${mediaId}/like`), {
    method: like ? 'POST' : 'DELETE',
  });
  if (!res.ok) throw new Error('Like failed');
  return res.json();
};

/**
 * Toggle favorite on a media.
 */
export const toggleFavoriteApi = async (mediaId, favorite) => {
  const res = await authFetch(apiUrl(`/api/media/${mediaId}/favorite`), {
    method: favorite ? 'POST' : 'DELETE',
  });
  if (!res.ok) throw new Error('Favorite failed');
  return res.json();
};

/**
 * Toggle follow on a user.
 */
export const toggleFollowApi = async (userId, follow) => {
  const res = await authFetch(apiUrl(`/api/user/${userId}/follow`), {
    method: follow ? 'POST' : 'DELETE',
  });
  if (!res.ok) throw new Error('Follow failed');
  return res.json();
};

/**
 * Record a unique view on a media.
 */
export const recordViewApi = async (mediaId) => {
  try {
    await authFetch(apiUrl(`/api/media/${mediaId}/view`), { method: 'POST' });
  } catch (e) {
    // ignore view errors
  }
};

/**
 * Fetch comments for a media.
 */
export const fetchComments = async (mediaId) => {
  const res = await fetch(apiUrl(`/api/media/${mediaId}/comments`));
  if (!res.ok) throw new Error('Failed to fetch comments');
  const data = await res.json();
  return data.comments || [];
};

/**
 * Post a comment.
 */
export const postComment = async (mediaId, text) => {
  const res = await authFetch(apiUrl(`/api/media/${mediaId}/comments`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to post comment');
  return res.json();
};

/**
 * Delete a comment.
 */
export const deleteComment = async (mediaId, commentId) => {
  const res = await authFetch(apiUrl(`/api/media/${mediaId}/comments`), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentId }),
  });
  if (!res.ok) throw new Error('Failed to delete comment');
};

/* -------------------------------------------------------------------------- */
/*                              MOCK AUTH (dev)                               */
/* -------------------------------------------------------------------------- */

/**
 * Mock login. Real auth is Google OAuth via /api/auth/google.
 * Kept for dev fallback / email-password flow placeholders.
 */
export const loginUser = (email, password) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password.length >= 6) {
        resolve({
          id: '1',
          name: 'Demo User',
          email,
          avatar: 'https://i.pravatar.cc/150?img=5',
          bio: 'Passionate about sharing beautiful content',
          followers: 1234,
          following: 567,
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });

/**
 * Mock register.
 */
export const registerUser = (name, email, password) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name && email && password.length >= 6) {
        resolve({
          id: '1',
          name,
          email,
          avatar: 'https://i.pravatar.cc/150?img=5',
          bio: 'New user',
          followers: 0,
          following: 0,
        });
      } else {
        reject(new Error('Invalid registration data'));
      }
    }, 800);
  });