import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
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

const VideoCard = ({ video, onPress }) => {
  const player = useVideoPlayer(video.src, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <TouchableOpacity
      className="bg-surface rounded-xl overflow-hidden shadow-md mb-3"
      style={{ width: CARD_WIDTH }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={{ width: '100%', aspectRatio: 1, position: 'relative' }}>
        <VideoView
          player={player}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
          <View className="flex-row items-center gap-2 mb-1">
            {video.user?.avatarUrl ? (
              <Image source={{ uri: video.user.avatarUrl }} style={{ width: 20, height: 20, borderRadius: 10 }} />
            ) : (
              <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
                <Text className="text-white text-xs font-bold">{(video.user?.name || 'U')[0].toUpperCase()}</Text>
              </View>
            )}
            <Text className="text-white text-xs" numberOfLines={1}>{video.user?.name || 'User'}</Text>
          </View>
          <Text className="text-white text-sm font-medium" numberOfLines={1}>{video.title}</Text>
          <Text className="text-white/70 text-xs">{video.viewsCount} views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MobileVideoGrid() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadVideos(0);
  }, []);

  const loadVideos = async (pageNum) => {
    const items = await fetchMediaBatch(pageNum, 8, 'video');
    if (pageNum === 0) {
      setVideos(items);
      setLoading(false);
    } else {
      if (items.length === 0) setHasMore(false);
      else setVideos((prev) => [...prev, ...items]);
    }
    setPage((prev) => prev + 1);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);
    await loadVideos(page);
    setLoadingMore(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await loadVideos(0);
    setRefreshing(false);
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
        data={videos}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onPress={() => navigation.navigate('MediaDetail', { mediaId: item.id, type: 'video' })}
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
            <Text className="text-2xl font-bold text-text">🎬 Videos</Text>
          </View>
        }
        ListFooterComponent={loadingMore ? (
          <View className="py-4"><ActivityIndicator size="large" color="#e6005c" /></View>
        ) : null}
      />
    </View>
  );
}