import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useNavigation } from '@react-navigation/native';
import { fetchMediaBatch } from '../../utils/mockData';

const AudioCard = ({ audio, onPress, isPlaying, onToggle }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="bg-surface rounded-xl overflow-hidden mb-3 shadow-md">
      <View className="p-4 flex-row items-center gap-3">
        <TouchableOpacity onPress={onToggle} className="w-16 h-16 rounded-full bg-primary items-center justify-center">
          <Text className="text-2xl text-white">{isPlaying ? '⏸️' : '▶️'}</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-base font-semibold text-text" numberOfLines={1}>{audio.title}</Text>
          <Text className="text-xs text-text-secondary">{audio.views} views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MobileAudioGrid() {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const navigation = useNavigation();
  // Use a single audio player for the entire grid (or manage multiple; here we use one)
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
      setAudios(prev => [...prev, ...items]);
    }
    setPage(prev => prev + 1);
  };

  const togglePlay = async (audio) => {
    if (playingId === audio.id) {
      player.pause();
      setPlayingId(null);
    } else {
      // Replace the source and play
      player.replace({ uri: audio.src });
      player.play();
      setPlayingId(audio.id);
    }
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
      contentContainerStyle={{ padding: 12 }}
      onEndReached={() => loadAudios(page)}
      onEndReachedThreshold={0.5}
    />
  );
}