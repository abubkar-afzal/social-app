import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { Video, Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { fetchMediaBatch } from '../../utils/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

const HeroSkeleton = () => (
  <View className="bg-surface rounded-xl overflow-hidden shadow-md mb-3" style={{ width: CARD_WIDTH }}>
    <View className="aspect-square bg-border animate-pulse" />
    <View className="p-2">
      <View className="h-4 bg-border rounded mb-1 animate-pulse" />
      <View className="h-3 bg-border rounded w-2/3 animate-pulse" />
    </View>
  </View>
);

const VideoCard = ({ video, onPress }) => (
  <TouchableOpacity className="bg-surface rounded-xl overflow-hidden shadow-md mb-3" style={{ width: CARD_WIDTH }} onPress={onPress} activeOpacity={0.85}>
    <Video source={{ uri: video.src }} style={{ width: '100%', aspectRatio: 1 }} resizeMode="cover" shouldPlay isMuted isLooping />
    <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
      <Text className="text-white text-sm font-medium" numberOfLines={1}>{video.title}</Text>
      <Text className="text-white/70 text-xs">{video.views} views</Text>
    </View>
  </TouchableOpacity>
);

const PhotoCard = ({ photo, onPress }) => (
  <TouchableOpacity className="bg-surface rounded-xl overflow-hidden shadow-md mb-3" style={{ width: CARD_WIDTH }} onPress={onPress} activeOpacity={0.85}>
    <Image source={{ uri: photo.src }} style={{ width: '100%', aspectRatio: 1 }} />
    <View className="p-2">
      <Text className="text-sm font-medium text-text" numberOfLines={1}>{photo.title}</Text>
      <Text className="text-xs text-text-secondary">{photo.views} views</Text>
    </View>
  </TouchableOpacity>
);

const AudioCard = ({ audio, onPress }) => {
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
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audio.src });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <TouchableOpacity className="bg-surface rounded-xl overflow-hidden shadow-md mb-3" style={{ width: CARD_WIDTH }} onPress={onPress} activeOpacity={0.85}>
      <View className="aspect-square items-center justify-center" style={{ backgroundColor: audio.color }}>
        <TouchableOpacity onPress={togglePlay} className="rounded-full bg-white/20 p-4 mb-2">
          <Text className="text-4xl">{isPlaying ? '⏸️' : '▶️'}</Text>
        </TouchableOpacity>
        <Text className="text-white font-medium px-2 text-center" numberOfLines={1}>{audio.title}</Text>
      </View>
      <View className="p-2">
        <Text className="text-xs text-text-secondary">{audio.views} views</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function MobileHero() {
  const [heroItems, setHeroItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadInitialHero();
  }, []);

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const loadInitialHero = async () => {
    setLoading(true);
    const items = await fetchMediaBatch(0, 10);
    setHeroItems(shuffle(items));
    setPage(1);
    setHasMore(true);
    setLoading(false);
  };

  const loadMoreHero = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const items = await fetchMediaBatch(page, 10);
    if (items.length === 0) {
      setHasMore(false);
    } else {
      setHeroItems(prev => [...prev, ...shuffle(items)]);
      setPage(prev => prev + 1);
    }
    setLoadingMore(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const items = await fetchMediaBatch(0, 10);
    setHeroItems(shuffle(items));
    setPage(1);
    setHasMore(true);
    setRefreshing(false);
  };

  const filteredItems = activeFilter === 'all' ? heroItems : heroItems.filter(item => item.type === activeFilter);

  const renderHeroItem = ({ item }) => {
    const onPress = () => navigation.navigate('MediaDetail', { mediaId: item.id, type: item.type });
    if (item.type === 'video') return <VideoCard video={item} onPress={onPress} />;
    if (item.type === 'audio') return <AudioCard audio={item} onPress={onPress} />;
    return <PhotoCard photo={item} onPress={onPress} />;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-row flex-wrap gap-3 px-3 pt-4">
          {[...Array(6)].map((_, i) => <HeroSkeleton key={i} />)}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={filteredItems}
        renderItem={renderHeroItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreHero}
        onEndReachedThreshold={0.3}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <View className="px-4 pt-4 pb-2">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-text">Discover</Text>
              <TouchableOpacity className="bg-primary rounded-full px-4 py-2">
                <Text className="text-white text-sm font-medium">✨ Trending</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <View className="flex-row gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'video', label: '🎬 Videos' },
                  { key: 'photo', label: '🖼️ Photos' },
                  { key: 'audio', label: '🎵 Audio' },
                ].map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    onPress={() => setActiveFilter(filter.key)}
                    className={`px-5 py-2 rounded-full ${activeFilter === filter.key ? 'bg-primary' : 'bg-surface border border-border'}`}
                  >
                    <Text className={`font-medium ${activeFilter === filter.key ? 'text-white' : 'text-text'}`}>{filter.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        }
        ListFooterComponent={loadingMore ? <View className="py-4"><ActivityIndicator size="large" color="#e6005c" /></View> : null}
      />
    </View>
  );
}