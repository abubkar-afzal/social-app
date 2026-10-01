import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator,
  Alert, Dimensions, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useMobileAuth } from './useMobileAuth';
import { apiUrl } from '../../utils/apiConfig';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { user, loading: authLoading } = useMobileAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const res = await fetch(apiUrl('/api/user/favorites'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.media || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadFavorites();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const removeFavorite = (mediaId) => {
    Alert.alert('Remove favorite', 'Remove this post from your favorites?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const token = await SecureStore.getItemAsync('authToken');
          const res = await fetch(apiUrl(`/api/media/${mediaId}/favorite`), {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) setItems((prev) => prev.filter((m) => m.id !== mediaId));
        },
      },
    ]);
  };

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#e6005c" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl mb-4">🔖</Text>
        <Text className="text-xl font-bold text-text mb-2">Your Favorites</Text>
        <Text className="text-text-secondary text-center mb-6">
          Sign in to view and manage your favorite posts.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="bg-primary px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e6005c" />}
    >
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-text">Favorites</Text>
        <Text className="text-text-secondary text-sm mt-1">
          {items.length} {items.length === 1 ? 'post' : 'posts'} saved
        </Text>
      </View>

      {loading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#e6005c" />
        </View>
      ) : items.length === 0 ? (
        <View className="items-center justify-center py-20 px-6">
          <Text className="text-5xl mb-4">🔖</Text>
          <Text className="text-text-secondary mb-4 text-center">No favorites yet.</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            className="bg-primary px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Explore posts</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row flex-wrap px-3 pb-6" style={{ gap: 12 }}>
          {items.map((item) => (
            <View
              key={item.id}
              className="bg-surface rounded-xl overflow-hidden shadow-md"
              style={{ width: CARD_WIDTH }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('MediaDetail', { mediaId: item.id, type: item.type })}
                activeOpacity={0.85}
              >
                <View className="aspect-square">
                  {item.type === 'PHOTO' ? (
                    <Image
                      source={{ uri: apiUrl(`/api/media/stream?id=${item.googleDriveFileId}`) }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <View className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark items-center justify-center">
                      <Text className="text-3xl">{item.type === 'VIDEO' ? '▶️' : '🎵'}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              <View className="flex-row justify-between items-start p-2">
                <View className="flex-1 pr-2">
                  <View className="flex-row items-center gap-1 mb-1">
                    {item.user?.avatarUrl ? (
                      <Image
                        source={{ uri: item.user.avatarUrl }}
                        style={{ width: 16, height: 16, borderRadius: 8 }}
                      />
                    ) : (
                      <View className="w-4 h-4 rounded-full bg-primary items-center justify-center">
                        <Text className="text-white text-xs font-bold">
                          {(item.user?.name || item.user?.email || 'U')[0].toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <Text className="text-xs text-text-secondary" numberOfLines={1}>
                      {item.user?.name || item.user?.email?.split('@')[0] || 'User'}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold text-text" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className="text-xs text-text-secondary">
                    {item.viewsCount} views
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => removeFavorite(item.id)}
                  className="bg-background p-2 rounded-full"
                >
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}