import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Video, Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { fetchMediaBatch } from '../../utils/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

const SkeletonCard = () => (
  <View className="bg-surface rounded-xl overflow-hidden mb-3 shadow-md">
    <View className="aspect-square bg-border animate-pulse" />
    <View className="p-3">
      <View className="h-4 bg-border rounded mb-2 animate-pulse" />
      <View className="flex-row justify-between">
        <View className="w-8 h-8 rounded-full bg-border animate-pulse" />
        <View className="w-8 h-8 rounded-full bg-border animate-pulse" />
      </View>
    </View>
  </View>
);

const VideoPlayer = ({ src }) => (
  <Video source={{ uri: src }} style={{ width: '100%', height: '100%' }} resizeMode="cover" shouldPlay isMuted isLooping />
);

const AudioPlayer = ({ src, color }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    if (isPlaying && sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: src });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <View className="w-full h-full items-center justify-center" style={{ backgroundColor: color }}>
      <TouchableOpacity onPress={togglePlay} className="rounded-full bg-white/20 p-4">
        <Text className="text-4xl text-white">{isPlaying ? '⏸️' : '▶️'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export const MobileMediaCardItem = ({ media }) => {
  const navigation = useNavigation();
  const onPress = () => navigation.navigate('MediaDetail', { mediaId: media.id, type: media.type });

  return (
    <TouchableOpacity
      className="bg-surface rounded-xl overflow-hidden mb-3 shadow-md"
      style={{ width: CARD_WIDTH }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View className="aspect-square">
        {media.type === 'video' ? <VideoPlayer src={media.src} /> : media.type === 'audio' ? <AudioPlayer src={media.src} color={media.color} /> : <Image source={{ uri: media.src }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />}
      </View>
      <View className="p-3">
        <Text className="text-base font-semibold text-text mb-2" numberOfLines={1}>{media.title}</Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-text-secondary">{media.views} views</Text>
          <View className="flex-row gap-2">
            <Text className="text-lg">🔖</Text>
            <Text className="text-lg text-primary">＋</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MobileMediaCard({ initialItems = [] }) {
  const [mediaItems, setMediaItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    const items = await fetchMediaBatch(0);
    setMediaItems(items);
    setPage(1);
    setInitialLoading(false);
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newItems = await fetchMediaBatch(page);
    if (newItems.length === 0) setHasMore(false);
    else {
      setMediaItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const newItems = await fetchMediaBatch(0);
    setMediaItems(newItems);
    setPage(1);
    setHasMore(true);
    setRefreshing(false);
  };

  if (initialLoading) {
    return (
      <View className="flex-row flex-wrap gap-3 px-3">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </View>
    );
  }

  return (
    <FlatList
      data={mediaItems}
      renderItem={({ item }) => <MobileMediaCardItem media={item} />}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
      contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListFooterComponent={loading ? <View className="py-4"><ActivityIndicator size="large" color="#e6005c" /></View> : null}
    />
  );
}