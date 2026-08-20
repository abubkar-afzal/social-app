import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useNavigation } from '@react-navigation/native';
import { fetchMediaBatch } from '../../utils/mockData';

const { width } = Dimensions.get('window');

const VideoCard = ({ video, onPress }) => {
  const player = useVideoPlayer(video.src, (player) => {
    player.loop = true;
    player.muted = true;
  });

  return (
    <TouchableOpacity
      className="bg-surface rounded-xl overflow-hidden mb-3 shadow-md"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <VideoView
        player={player}
        style={{ width: '100%', aspectRatio: 16/9 }}
        contentFit="cover"
      />
      <View className="p-3">
        <Text className="text-base font-semibold text-text mb-1" numberOfLines={1}>
          {video.title}
        </Text>
        <Text className="text-xs text-text-secondary">{video.views} views</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function MobileVideoGrid() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
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
      setVideos(prev => [...prev, ...items]);
    }
    setPage(prev => prev + 1);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#e6005c" />
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      renderItem={({ item }) => (
        <VideoCard
          video={item}
          onPress={() => navigation.navigate('MediaDetail', { mediaId: item.id, type: 'video' })}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 12 }}
      onEndReached={() => loadVideos(page)}
      onEndReachedThreshold={0.5}
    />
  );
}