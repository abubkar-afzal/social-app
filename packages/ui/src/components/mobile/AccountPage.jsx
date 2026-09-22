import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { useMobileAuth } from './useMobileAuth';
import { apiUrl } from '../../utils/apiConfig';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

export default function MobileAccount() {
  const navigation = useNavigation();
  const { user, loading: authLoading, logout, setUser } = useMobileAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadMedia = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const res = await fetch(apiUrl('/api/user/media'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
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
    loadMedia();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMedia();
    setRefreshing(false);
  };

  const openEdit = () => {
    setEditName(user.name || '');
    setEditBio(user.bio || '');
    setAvatarFile(null);
    setAvatarPreview(user.avatarUrl || '');
    setEditOpen(true);
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Please allow photo access to change your avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setAvatarFile(asset);
      setAvatarPreview(asset.uri);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      let newAvatarUrl = user.avatarUrl || '';

      // 1. Upload new avatar if selected
      if (avatarFile) {
        setUploadingAvatar(true);
        const formData = new FormData();
        formData.append('avatar', {
          uri: avatarFile.uri,
          name: avatarFile.fileName || `avatar_${Date.now()}.jpg`,
          type: avatarFile.mimeType || 'image/jpeg',
        });

        const avatarRes = await fetch(apiUrl('/api/user/avatar'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!avatarRes.ok) {
          const err = await avatarRes.json().catch(() => ({}));
          throw new Error(err.error || 'Avatar upload failed');
        }

        const avatarData = await avatarRes.json();
        newAvatarUrl = avatarData.avatarUrl;
        setUploadingAvatar(false);
      }

      // 2. Save name/bio/avatar
      const profileRes = await fetch(apiUrl('/api/user/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          bio: editBio,
          avatarUrl: newAvatarUrl,
        }),
      });

      if (profileRes.ok) {
        const updated = await profileRes.json();
        if (setUser) setUser(updated);
        setEditOpen(false);
      } else {
        Alert.alert('Error', 'Failed to save profile');
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setSaving(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete post', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const token = await SecureStore.getItemAsync('authToken');
          const res = await fetch(apiUrl(`/api/user/media/${id}`), {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) setMedia((prev) => prev.filter((m) => m.id !== id));
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.navigate('Main', { screen: 'Home' });
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
        <Text className="text-xl font-bold text-text mb-4">Please sign in</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="bg-primary px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredMedia =
    filter === 'all' ? media : media.filter((m) => m.type.toLowerCase() === filter);
  const stats = {
    total: media.length,
    videos: media.filter((m) => m.type === 'VIDEO').length,
    photos: media.filter((m) => m.type === 'PHOTO').length,
    audios: media.filter((m) => m.type === 'AUDIO').length,
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e6005c" />
      }
    >
      {/* Profile header */}
      <View className="bg-surface p-6 items-center border-b border-border">
        {user.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            style={{ width: 96, height: 96, borderRadius: 48 }}
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
            <Text className="text-white text-4xl font-bold">
              {(user.name || 'U')[0].toUpperCase()}
            </Text>
          </View>
        )}
        <Text className="text-2xl font-bold text-text mt-3">{user.name || 'User'}</Text>
        <Text className="text-text-secondary">{user.email}</Text>
        {user.bio ? (
          <Text className="text-text-secondary text-center mt-2">{user.bio}</Text>
        ) : null}

        <View className="flex-row gap-6 mt-4">
          <View className="items-center">
            <Text className="text-xl font-bold">{stats.total}</Text>
            <Text className="text-xs text-text-secondary">Posts</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold">{stats.videos}</Text>
            <Text className="text-xs text-text-secondary">Videos</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold">{stats.photos}</Text>
            <Text className="text-xs text-text-secondary">Photos</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold">{stats.audios}</Text>
            <Text className="text-xs text-text-secondary">Audio</Text>
          </View>
        </View>

        <View className="flex-row gap-2 mt-5 flex-wrap justify-center">
          <TouchableOpacity
            onPress={openEdit}
            className="border border-primary px-4 py-2 rounded-full"
          >
            <Text className="text-primary font-semibold">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('UploadMedia')}
            className="bg-primary px-4 py-2 rounded-full"
          >
            <Text className="text-white font-semibold">+ Create Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            className="border border-error px-4 py-2 rounded-full"
          >
            <Text className="text-error font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3"
      >
        <View className="flex-row gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'video', label: '🎬 Videos' },
            { key: 'photo', label: '🖼️ Photos' },
            { key: 'audio', label: '🎵 Audio' },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full ${
                filter === f.key ? 'bg-primary' : 'bg-surface border border-border'
              }`}
            >
              <Text className={filter === f.key ? 'text-white' : 'text-text'}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Media grid */}
      {loading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#e6005c" />
        </View>
      ) : filteredMedia.length === 0 ? (
        <View className="items-center justify-center py-20 px-6">
          <Text className="text-text-secondary mb-4 text-center">No posts yet.</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('UploadMedia')}
            className="bg-primary px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Create your first post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row flex-wrap px-3 pb-6" style={{ gap: 12 }}>
          {filteredMedia.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                navigation.navigate('MediaDetail', { mediaId: item.id, type: item.type })
              }
              onLongPress={() => handleDelete(item.id)}
              className="bg-surface rounded-xl overflow-hidden shadow-md"
              style={{ width: CARD_WIDTH }}
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
                    <Text className="text-3xl">
                      {item.type === 'VIDEO' ? '▶️' : '🎵'}
                    </Text>
                  </View>
                )}
              </View>
              <View className="p-2">
                <Text className="text-sm font-semibold text-text" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-xs text-text-secondary">
                  {item.viewsCount} views
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Edit Profile Modal */}
      <Modal
        visible={editOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setEditOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-surface rounded-t-3xl p-6">
            <Text className="text-xl font-bold mb-4">Edit Profile</Text>

            {/* Avatar upload */}
            <View className="items-center mb-6">
              <TouchableOpacity onPress={pickAvatar} className="relative">
                {avatarPreview ? (
                  <Image
                    source={{ uri: avatarPreview }}
                    style={{ width: 96, height: 96, borderRadius: 48 }}
                  />
                ) : (
                  <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                    <Text className="text-white text-3xl font-bold">
                      {(editName || 'U')[0].toUpperCase()}
                    </Text>
                  </View>
                )}
                <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full">
                  <Text className="text-white">✏️</Text>
                </View>
              </TouchableOpacity>
              <Text className="text-xs text-text-secondary mt-2">
                {avatarFile ? 'New picture selected' : 'Tap to change picture'}
              </Text>
            </View>

            <Text className="text-sm font-medium mb-1">Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              className="bg-background rounded-lg px-4 py-2 mb-3 border border-border"
            />

            <Text className="text-sm font-medium mb-1">Bio</Text>
            <TextInput
              value={editBio}
              onChangeText={setEditBio}
              multiline
              numberOfLines={3}
              className="bg-background rounded-lg px-4 py-2 mb-4 border border-border"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setEditOpen(false)}
                className="flex-1 bg-background border border-border py-3 rounded-lg"
              >
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveProfile}
                disabled={saving || uploadingAvatar}
                className="flex-1 bg-primary py-3 rounded-lg"
              >
                {uploadingAvatar || saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-semibold">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}