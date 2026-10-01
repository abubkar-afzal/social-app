import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator,
  FlatList, TextInput, Alert,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useAudioPlayer } from 'expo-audio';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { fetchMediaById, fetchSuggestions } from '../../utils/mockData';
import { apiUrl } from '../../utils/apiConfig';
import { useMobileAuth } from './useMobileAuth';
import { Share } from 'react-native';
const getUserDisplayName = (user) => {
  if (!user) return 'Unknown';
  return user.name || user.email?.split('@')[0] || 'User';
};
const getUserInitial = (user) => getUserDisplayName(user).charAt(0).toUpperCase();


const VideoPlayer = ({ src }) => {
  const player = useVideoPlayer(src, (p) => {
    p.loop = true;
    p.muted = false;
    p.play();
  });
  return <VideoView player={player} style={{ width: '100%', aspectRatio: 16 / 9 }} contentFit="contain" nativeControls />;
};

const AudioPlayer = ({ src }) => {
  const player = useAudioPlayer({ uri: src });
  const [isPlaying, setIsPlaying] = useState(false);
  const toggle = () => {
    if (isPlaying) player.pause();
    else player.play();
    setIsPlaying(!isPlaying);
  };
  return (
    <View className="aspect-square bg-gradient-to-br from-primary-light to-primary-dark items-center justify-center">
      <TouchableOpacity onPress={toggle} className="rounded-full bg-white/20 p-6">
        <Text className="text-6xl">{isPlaying ? '⏸️' : '▶️'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const SuggestionCard = ({ item, navigation }) => (
  <TouchableOpacity
    className="bg-surface rounded-xl overflow-hidden mr-3"
    style={{ width: 150 }}
    onPress={() => navigation.push('MediaDetail', { mediaId: item.id, type: item.type })}
    activeOpacity={0.85}
  >
    {item.type === 'photo' ? (
      <Image source={{ uri: item.src }} style={{ width: '100%', aspectRatio: 1 }} />
    ) : (
      <View className="aspect-square bg-gradient-to-br from-primary to-primary-dark items-center justify-center">
        <Text className="text-3xl">{item.type === 'video' ? '▶️' : '🎵'}</Text>
      </View>
    )}
    <View className="p-2">
      <Text className="text-xs font-semibold text-text" numberOfLines={1}>{item.title}</Text>
      <Text className="text-xs text-text-secondary">{item.viewsCount} views</Text>
    </View>
  </TouchableOpacity>
);

export default function MobileMediaDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { mediaId } = route.params;
  const { user } = useMobileAuth();

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
    loadMedia();
  }, [mediaId, user?.id]);

  const loadMedia = async () => {
    setLoading(true);
    const item = await fetchMediaById(mediaId);
    setMedia(item);
    setLikesCount(item.likesCount || 0);
    setFavoritesCount(item.favoritesCount || 0);
    setLiked(item.liked || false);
    setFavorited(item.favorited || false);
    setFollowing(item.following || false);
    setIsOwnPost(item.isOwnPost || false);

    // Record view (only if signed in)
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        fetch(apiUrl(`/api/media/${mediaId}/view`), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    } catch {}

    try {
      const res = await fetch(apiUrl(`/api/media/${mediaId}/comments`));
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (e) {
      console.error(e);
    }

    const sugg = await fetchSuggestions(item.type, mediaId);
    setSuggestions(sugg);
    setLoading(false);
  };

  const requireAuth = () => {
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to use this feature.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('Login') },
      ]);
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
      const token = await SecureStore.getItemAsync('authToken');
      await fetch(apiUrl(`/api/media/${mediaId}/like`), {
        method: next ? 'POST' : 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = async () => {
    if (!requireAuth()) return;
    const next = !favorited;
    setFavorited(next);
    setFavoritesCount((c) => c + (next ? 1 : -1));
    try {
      const token = await SecureStore.getItemAsync('authToken');
      await fetch(apiUrl(`/api/media/${mediaId}/favorite`), {
        method: next ? 'POST' : 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFollow = async () => {
    if (!requireAuth() || isOwnPost) return;
    const next = !following;
    setFollowing(next);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      await fetch(apiUrl(`/api/user/${media.userId}/follow`), {
        method: next ? 'POST' : 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const submitComment = async () => {
    if (!requireAuth()) return;
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const res = await fetch(apiUrl(`/api/media/${mediaId}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: commentText }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentText('');
      }
    } catch (e) {
      console.error(e);
    }
    setPostingComment(false);
  };
const shareMedia = async () => {
  try {
    await Share.share({
      message: `${media.title}\n${media.description || ''}\n\nCheck it out on AR Media: http://localhost:3000/media/${media.id}`,
    });
  } catch (e) {
    console.error(e);
  }
};

  const deleteComment = (commentId) => {
    if (!requireAuth()) return;
    Alert.alert('Delete comment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const token = await SecureStore.getItemAsync('authToken');
          const res = await fetch(apiUrl(`/api/media/${mediaId}/comments`), {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ commentId }),
          });
          if (res.ok) setComments((prev) => prev.filter((c) => c.id !== commentId));
        },
      },
    ]);
  };

  if (loading || !media) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#e6005c" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
        <Text className="text-primary text-lg">← Back</Text>
      </TouchableOpacity>

      <View className="bg-surface rounded-b-xl overflow-hidden">
        {media.type === 'video' && <VideoPlayer src={media.src} />}
        {media.type === 'photo' && (
          <Image source={{ uri: media.src }} style={{ width: '100%', aspectRatio: 1 }} />
        )}
        {media.type === 'audio' && <AudioPlayer src={media.src} />}
      </View>

      <View className="p-4">
        <Text className="text-2xl font-bold text-text">{media.title}</Text>
        {media.description ? <Text className="text-text-secondary mt-1">{media.description}</Text> : null}

        <View className="flex-row flex-wrap gap-3 mt-4">
  <TouchableOpacity
    onPress={toggleLike}
    className={`flex-row items-center gap-2 px-4 py-2 rounded-full border ${liked ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
  >
    <Text>{liked ? '❤️' : '🤍'}</Text>
    <Text className={liked ? 'text-white font-medium' : 'text-text'}>{likesCount}</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={toggleFavorite}
    className={`flex-row items-center gap-2 px-4 py-2 rounded-full border ${favorited ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
  >
    <Text>{favorited ? '⭐' : '☆'}</Text>
    <Text className={favorited ? 'text-white font-medium' : 'text-text'}>{favoritesCount}</Text>
  </TouchableOpacity>

  <View className="flex-row items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface">
    <Text>👁️</Text>
    <Text className="text-text-secondary">{media.viewsCount || 0}</Text>
  </View>

  <TouchableOpacity
    onPress={shareMedia}
    className="flex-row items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface"
  >
    <Text>📤</Text>
    <Text className="text-text">Share</Text>
  </TouchableOpacity>
</View>

        <View className="flex-row items-center gap-3 mt-6 bg-surface rounded-xl p-4">
  {media.user?.avatarUrl ? (
    <Image source={{ uri: media.user.avatarUrl }} style={{ width: 48, height: 48, borderRadius: 24 }} />
  ) : (
    <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
      <Text className="text-white text-lg font-bold">{getUserInitial(media.user)}</Text>
    </View>
  )}
  <View className="flex-1">
    <Text className="font-semibold text-text">{getUserDisplayName(media.user)}</Text>
    {media.user?.followersCount !== undefined && (
      <Text className="text-sm text-text-secondary">{media.user.followersCount} followers</Text>
    )}
  </View>
  {!isOwnPost && (
    <TouchableOpacity
      onPress={toggleFollow}
      className={`px-4 py-2 rounded-full ${following ? 'bg-background border border-border' : 'bg-primary'}`}
    >
      <Text className={following ? 'text-text' : 'text-white font-semibold'}>
        {following ? 'Following' : 'Follow'}
      </Text>
    </TouchableOpacity>
  )}
</View>


        <View className="mt-6">
          <Text className="text-xl font-bold text-text mb-4">Comments ({comments.length})</Text>

          <View className="flex-row items-center gap-2 mb-4">
            <TextInput
              className="flex-1 bg-surface rounded-full px-4 py-2 border border-border"
              placeholder={user ? 'Add a comment...' : 'Sign in to comment'}
              value={commentText}
              onChangeText={setCommentText}
              editable={!!user}
            />
            <TouchableOpacity
              onPress={submitComment}
              disabled={!commentText.trim() || !user || postingComment}
              className={`px-4 py-2 rounded-full ${!commentText.trim() || !user ? 'bg-border' : 'bg-primary'}`}
            >
              <Text className="text-white font-medium">{postingComment ? '...' : 'Post'}</Text>
            </TouchableOpacity>
          </View>

          {comments.length === 0 ? (
            <Text className="text-text-secondary text-sm">No comments yet. Be the first!</Text>
          ) : (
            comments.map((c) => (
              <View key={c.id} className="flex-row gap-3 mb-4">
                {c.user.avatarUrl ? (
                  <Image source={{ uri: c.user.avatarUrl }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                    <Text className="text-white font-bold">{(c.user.name || 'U')[0].toUpperCase()}</Text>
                  </View>
                )}
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold text-sm">{c.user.name || 'User'}</Text>
                    <Text className="text-xs text-text-secondary">{new Date(c.createdAt).toLocaleDateString()}</Text>
                    {user?.id === c.user.id && (
                      <TouchableOpacity onPress={() => deleteComment(c.id)} className="ml-auto">
                        <Text className="text-error text-xs">Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text className="text-text-secondary mt-1">{c.text}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      <Text className="text-xl font-bold text-text px-4 mt-6">More like this</Text>
      <FlatList
        data={suggestions}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => <SuggestionCard item={item} navigation={navigation} />}
        keyExtractor={(item) => item.id}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}