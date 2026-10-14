import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useNavigation } from '@react-navigation/native';
import { fetchMediaBatch } from '../../utils/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

const SkeletonCard = () => (
  <View className="bg-surface rounded-xl overflow-hidden shadow-md mb-3" style={{ width: CARD_WIDTH }}>
    <View className="aspect-square bg-border animate-pulse" />
    <View className="p-2">
      <View className="h-4 bg-border rounded mb-1 animate-pulse" />
      <View className="h-3 bg-border rounded w-2/3 animate-pulse" />
    </View>
  </View>
);

const AudioCard = ({ audio, onPress, isPlaying, onToggle }) => (
  <TouchableOpacity
    className="bg-surface rounded-xl overflow-hidden shadow-md mb-3"
    style={{ width: CARD_WIDTH }}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View
      className="aspect-square items-center justify-center"
      style={{ backgroundColor: audio.color || '#e6005c' }}
    >
      <TouchableOpacity
        onPress={onToggle}
        className="rounded-full bg-white/20 p-4 mb-2"
      >
        <Text className="text-4xl">{isPlaying ? '⏸️' : '▶️'}</Text>
      </TouchableOpacity>
      <Text className="text-white font-medium px-2 text-center" numberOfLines={1}>
        {audio.title}
      </Text>
    </View>
    <View className="p-2">
      <View className="flex-row items-center gap-2 mb-1">
        {audio.user?.avatarUrl ? (
          <Image source={{ uri: audio.user.avatarUrl }} style={{ width: 20, height: 20, borderRadius: 10 }} />
        ) : (
          <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
            <Text className="text-white text-xs font-bold">{(audio.user?.name || 'U')[0].toUpperCase()}</Text>
          </View>
        )}
        <Text className="text-xs text-text-secondary flex-1" numberOfLines={1}>
          {audio.user?.name || 'User'}
        </Text>
      </View>
      <Text className="text-xs text-text-secondary">{audio.viewsCount} views</Text>
    </View>
  </TouchableOpacity>
);

export default function MobileAudioGrid() {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const navigation = useNavigation();
  const player = useAudioPlayer(null);

  useEffect(() => {
    loadAudios(0);
  }, []);

  useEffect(() => {
    return () => {
      if (player) player.pause();
    };
  }, [player]);

  const loadAudios = async (pageNum) => {
    const items = await fetchMediaBatch(pageNum, 6, 'audio');
    if (pageNum === 0) {
      setAudios(items);
      setLoading(false);
    } else {
      if (items.length === 0) setHasMore(false);
      else setAudios((prev) => [...prev, ...items]);
    }
    setPage((prev) => prev + 1);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);
    await loadAudios(page);
    setLoadingMore(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    if (player) player.pause();
    setPlayingId(null);
    await loadAudios(0);
    setRefreshing(false);
  };

  const togglePlay = async (audio) => {
    if (playingId === audio.id) {
      player.pause();
      setPlayingId(null);
    } else {
      player.replace({ uri: audio.src });
      player.play();
      setPlayingId(audio.id);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-row flex-wrap gap-3 px-3 pt-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={audios}
        renderItem={({ item }) => (
          <AudioCard
            audio={item}
            onPress={() => navigation.navigate('MediaDetail', { mediaId: item.id, type: 'audio' })}
            isPlaying={playingId === item.id}
            onToggle={() => togglePlay(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <View className="px-4 pb-3">
            <Text className="text-2xl font-bold text-text">🎵 Audio</Text>
          </View>
        }
        ListFooterComponent={loadingMore ? (
          <View className="py-4"><ActivityIndicator size="large" color="#e6005c" /></View>
        ) : null}
      />
    </View>
  );
}