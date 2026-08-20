import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchMediaBatch } from '../../utils/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

export default function MobilePhotoGrid() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    loadPhotos(0);
  }, []);

  const loadPhotos = async (pageNum) => {
    const items = await fetchMediaBatch(pageNum, 12, 'photo');
    if (pageNum === 0) {
      setPhotos(items);
      setLoading(false);
    } else {
      setPhotos(prev => [...prev, ...items]);
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
      data={photos}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="bg-surface rounded-xl overflow-hidden mb-3 shadow-md"
          style={{ width: CARD_WIDTH }}
          onPress={() => navigation.navigate('MediaDetail', { mediaId: item.id, type: 'photo' })}
          activeOpacity={0.8}
        >
          <Image source={{ uri: item.src }} style={{ width: '100%', aspectRatio: 1 }} />
          <View className="p-2">
            <Text className="text-sm font-semibold text-text" numberOfLines={1}>{item.title}</Text>
            <Text className="text-xs text-text-secondary">{item.views} views</Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      onEndReached={() => loadPhotos(page)}
      onEndReachedThreshold={0.5}
    />
  );
}