// packages/ui/src/utils/mockData.js
import { apiUrl, authFetch, safeJson } from './apiConfig';

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
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch media');
  console.log(data)
  return (data.media || []).map((item) => ({
    ...item,
    type: item.type.toLowerCase(),
    // Stream URL (goes through your backend — same-origin-like, uses master Drive token)
    src: apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`),
    // Direct Drive URL (fallback — works cross-origin without auth)
    fallbackSrc: `https://drive.google.com/thumbnail?id=${item.googleDriveFileId}&sz=w800`,
    thumbnail: item.thumbnailUrl || null,
    likes: item.likesCount,
    views: item.viewsCount,
  }));
};

/**
 * Fetch a single media by id (detail endpoint).
 */
export const fetchMediaById = async (id) => {
  const res = await authFetch(apiUrl(`/api/media/${id}`));
  const item = await safeJson(res);

  if (!res.ok) {
    throw new Error(item?.error || `Failed to fetch media (${res.status})`);
  }

  return {
    ...item,
    type: item.type.toLowerCase(),
    // Stream URL (goes through your backend)
    src: apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`),
    // Direct Google Drive URLs — used as fallbacks when stream fails
    fallbackSrc: `https://drive.google.com/thumbnail?id=${item.googleDriveFileId}&sz=w1600`,
    fallbackDownloadUrl: `https://drive.google.com/uc?export=download&id=${item.googleDriveFileId}`,
    thumbnail: item.thumbnailUrl || null,
    likes: item.likesCount,
    views: item.viewsCount,
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
  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error(data?.error || `Upload failed (${res.status})`);
  }
  return data;
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
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.error || 'Like failed');
  return data;
};

/**
 * Toggle favorite on a media.
 */
export const toggleFavoriteApi = async (mediaId, favorite) => {
  const res = await authFetch(apiUrl(`/api/media/${mediaId}/favorite`), {
    method: favorite ? 'POST' : 'DELETE',
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.error || 'Favorite failed');
  return data;
};

/**
 * Toggle follow on a user.
 */
export const toggleFollowApi = async (userId, follow) => {
  const res = await authFetch(apiUrl(`/api/user/${userId}/follow`), {
    method: follow ? 'POST' : 'DELETE',
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.error || 'Follow failed');
  return data;
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
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch comments');
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
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.error || 'Failed to post comment');
  return data;
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
  if (!res.ok) {
    const data = await safeJson(res).catch(() => ({}));
    throw new Error(data?.error || 'Failed to delete comment');
  }
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