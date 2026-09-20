let idCounter = 0;
import { apiUrl } from './apiConfig';

export const generateMediaItem = (index, type = null) => {
  const types = ['video', 'photo', 'audio'];
  const itemType = type || types[index % 3];
  
  const videos = [
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
  ];

  const photos = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/600?random=5',
    'https://picsum.photos/800/600?random=6',
  ];

  const audios = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  ];

  const titles = [
    'Amazing Nature', 'City Lights', 'Chill Beats', 'Mountain View',
    'Cooking Tutorial', 'Abstract Art', 'Ocean Waves', 'Forest Walk',
    'Urban Life', 'Sunset Vibes', 'Rainy Day', 'Starry Night'
  ];

  const users = [
    'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Rodriguez',
    'Lisa Wang', 'Tom Brown', 'Emma Wilson', 'James Taylor'
  ];

  const colors = ['#ff6b9d', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

  return {
    id: (++idCounter).toString(),
    type: itemType,
    title: `${titles[index % titles.length]} ${index + 1}`,
    description: `Beautiful ${itemType} content shared by ${users[index % users.length]}`,
    user: users[index % users.length],
    userAvatar: `https://i.pravatar.cc/150?img=${index % 10 + 1}`,
    color: colors[index % colors.length],
    src: itemType === 'video' ? videos[index % videos.length] : 
         itemType === 'audio' ? audios[index % audios.length] : 
         photos[index % photos.length],
    likes: Math.floor(Math.random() * 5000),
    views: Math.floor(Math.random() * 10000),
    saves: Math.floor(Math.random() * 1000),
    tags: ['trending', 'featured', 'popular'].slice(0, (index % 3) + 1),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  };
};

export const fetchMediaBatch = async (page, pageSize = 10, type = null) => {
  const params = new URLSearchParams({ page, limit: pageSize });
  if (type) params.append('type', String(type).toUpperCase());
  const res = await fetch(apiUrl(`/api/media?${params}`));
  if (!res.ok) throw new Error('Failed to fetch media');
  const data = await res.json();
  return data.media.map((item) => ({
    ...item,
    type: item.type.toLowerCase(),
    src: apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`),
    thumbnail: item.thumbnailUrl || null,
    likes: item.likesCount,
    views: item.viewsCount,
    user: item.user?.name || 'Unknown User',
    userAvatar: item.user?.avatarUrl || 'https://i.pravatar.cc/150?img=1',
  }));
};

export const fetchMediaById = async (id) => {
  const res = await fetch(apiUrl(`/api/media/${id}`));
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
    user: item.user?.name || 'Unknown User',
    userAvatar: item.user?.avatarUrl || 'https://i.pravatar.cc/150?img=1',
  };
};

export const fetchSuggestions = async (type, excludeId, limit = 8) => {
  const items = await fetchMediaBatch(0, limit, type);
  return items.filter((item) => item.id !== excludeId);
};


// Authentication remains mocked for now
export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password.length >= 6) {
        resolve({
          id: '1',
          name: 'Demo User',
          email: email,
          avatar: 'https://i.pravatar.cc/150?img=5',
          bio: 'Passionate about sharing beautiful content',
          followers: 1234,
          following: 567,
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const registerUser = (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name && email && password.length >= 6) {
        resolve({
          id: '1',
          name: name,
          email: email,
          avatar: 'https://i.pravatar.cc/150?img=5',
          bio: 'New user',
          followers: 0,
          following: 0,
        });
      } else {
        reject(new Error('Invalid registration data'));
      }
    }, 1000);
  });
};