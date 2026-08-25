import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { fetchMediaBatch } from '../../utils/mockData';

export default function MobileAudioGrid() {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const soundRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadAudios(0);
  }, []);

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
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
      setPlayingId(null);
    } else {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync({ uri: audio.src });
      soundRef.current = sound;
      await sound.playAsync();
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
        <TouchableOpacity
          className="bg-surface rounded-xl overflow-hidden mb-3 shadow-md"
          onPress={() => navigation.navigate('MediaDetail', { mediaId: item.id, type: 'audio' })}
          activeOpacity={0.8}
        >
          <View className="p-4 flex-row items-center gap-3">
            <TouchableOpacity onPress={() => togglePlay(item)} className="w-16 h-16 rounded-full bg-primary items-center justify-center">
              <Text className="text-2xl text-white">{playingId === item.id ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-base font-semibold text-text" numberOfLines={1}>{item.title}</Text>
              <Text className="text-xs text-text-secondary">{item.views} views</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 12 }}
      onEndReached={() => loadAudios(page)}
      onEndReachedThreshold={0.5}
    />
  );
}