import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator,
  Alert, Modal, TextInput, Dimensions, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { useMobileAuth } from './useMobileAuth';
import { apiUrl } from '../../utils/apiConfig';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

function UserRow({ user }) {
  const [following, setFollowing] = useState(user.isFollowedByMe);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const next = !following;
    setFollowing(next);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const res = await fetch(apiUrl(`/api/user/${user.id}/follow`), {
        method: next ? 'POST' : 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('failed');
    } catch {
      setFollowing(!next);
    }
    setBusy(false);
  };

  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-border">
      {user.avatarUrl ? (
        <Image source={{ uri: user.avatarUrl }} style={{ width: 44, height: 44, borderRadius: 22 }} />
      ) : (
        <View className="w-11 h-11 rounded-full bg-primary items-center justify-center">
          <Text className="text-white font-bold">{(user.name || 'U')[0].toUpperCase()}</Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="font-semibold text-text">{user.name || 'User'}</Text>
        <Text className="text-xs text-text-secondary">{user.email}</Text>
      </View>
      <TouchableOpacity
        onPress={toggle}
        disabled={busy}
        className={`px-4 py-2 rounded-full ${following ? 'bg-background border border-border' : 'bg-primary'} ${busy ? 'opacity-50' : ''}`}
      >
        <Text className={following ? 'text-text' : 'text-white font-semibold'}>
          {following ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MobileAccount() {
  const navigation = useNavigation();
  const { user, loading: authLoading, logout, setUser } = useMobileAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const [activeTab, setActiveTab] = useState('posts');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);

  const [mediaEditOpen, setMediaEditOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaType, setMediaType] = useState('PHOTO');
  const [savingMedia, setSavingMedia] = useState(false);

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

  useEffect(() => {
    if (!user || activeTab === 'posts') return;
    const load = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        const endpoint = activeTab === 'followers' ? 'followers' : 'following';
        const res = await fetch(apiUrl(`/api/user/${user.id}/${endpoint}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (activeTab === 'followers') setFollowers(data.users || []);
          else setFollowing(data.users || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [user, activeTab]);

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
      Alert.alert('Permission denied', 'Please allow photo access.');
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
        if (!avatarRes.ok) throw new Error('Avatar upload failed');
        const avatarData = await avatarRes.json();
        newAvatarUrl = avatarData.avatarUrl;
        setUploadingAvatar(false);
      }
      const profileRes = await fetch(apiUrl('/api/user/profile'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName, bio: editBio, avatarUrl: newAvatarUrl }),
      });
      if (profileRes.ok) {
        const updated = await profileRes.json();
        if (setUser) setUser(updated);
        setEditOpen(false);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setSaving(false);
  };

  const openMediaEdit = (item) => {
    setEditingMedia(item);
    setMediaTitle(item.title || '');
    setMediaDescription(item.description || '');
    setMediaType(item.type || 'PHOTO');
    setMediaEditOpen(true);
  };

  const saveMedia = async () => {
    if (!editingMedia) return;
    setSavingMedia(true);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const res = await fetch(apiUrl(`/api/user/media/${editingMedia.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: mediaTitle, description: mediaDescription, type: mediaType }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMedia((prev) => prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)));
        setMediaEditOpen(false);
        setEditingMedia(null);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setSavingMedia(false);
  };

  const confirmDelete = (item) => {
    Alert.alert('Delete post', `"${item.title}" will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const token = await SecureStore.getItemAsync('authToken');
          const res = await fetch(apiUrl(`/api/user/media/${item.id}`), {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) setMedia((prev) => prev.filter((m) => m.id !== item.id));
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
    return <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#e6005c" /></View>;
  }

  if (!user) {
    return (
      <View className="bg-background flex-1 items-center justify-center px-6">
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')} className="bg-primary px-6 py-3 rounded-full">
          <Text className="text-white font-semibold">Sign In to continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredMedia =
  filter === 'all'
    ? media
    : media.filter((m) => (m.type || '').toLowerCase() === filter);
  const stats = {
    total: media.length,
    videos: media.filter((m) => m.type === 'VIDEO').length,
    photos: media.filter((m) => m.type === 'PHOTO').length,
    audios: media.filter((m) => m.type === 'AUDIO').length,
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e6005c" />}
    >
      {/* Header */}
      <View className="bg-surface p-6 items-center border-b border-border">
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={{ width: 96, height: 96, borderRadius: 48 }} />
        ) : (
          <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
            <Text className="text-white text-4xl font-bold">{(user.name || 'U')[0].toUpperCase()}</Text>
          </View>
        )}
        <Text className="text-2xl font-bold text-text mt-3">{user.name || 'User'}</Text>
        <Text className="text-text-secondary">{user.email}</Text>
        {user.bio ? <Text className="text-text-secondary text-center mt-2">{user.bio}</Text> : null}

        <View className="flex-row gap-6 mt-4">
          <View className="items-center">
            <Text className="text-xl font-bold">{stats.total}</Text>
            <Text className="text-xs text-text-secondary">Posts</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveTab('followers')} className="items-center">
            <Text className="text-xl font-bold">{followers.length}</Text>
            <Text className="text-xs text-text-secondary">Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('following')} className="items-center">
            <Text className="text-xl font-bold">{following.length}</Text>
            <Text className="text-xs text-text-secondary">Following</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2 mt-5 flex-wrap justify-center">
          <TouchableOpacity onPress={openEdit} className="border border-primary px-4 py-2 rounded-full">
            <Text className="text-primary font-semibold">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('UploadMedia')} className="bg-primary px-4 py-2 rounded-full">
            <Text className="text-white font-semibold">+ Create Post</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} className="border border-error px-4 py-2 rounded-full">
            <Text className="text-error font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-border bg-surface">
        {[
          { key: 'posts', label: 'Posts' },
          { key: 'followers', label: 'Followers' },
          { key: 'following', label: 'Following' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 items-center border-b-2 ${activeTab === tab.key ? 'border-primary' : 'border-transparent'}`}
          >
            <Text className={activeTab === tab.key ? 'text-primary font-semibold' : 'text-text-secondary'}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* POSTS TAB */}
      {activeTab === 'posts' && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3">
            <View className="flex-row gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'video', label: '🎬 Videos' },
                { key: 'photo', label: '🖼️ Photos' },
                { key: 'audio', label: '🎵 Audio' },
              ].map((f) => (
                <TouchableOpacity key={f.key} onPress={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-full ${filter === f.key ? 'bg-primary' : 'bg-surface border border-border'}`}>
                  <Text className={filter === f.key ? 'text-white' : 'text-text'}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {loading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#e6005c" />
            </View>
          ) : filteredMedia.length === 0 ? (
            <View className="items-center justify-center py-20 px-6">
              <Text className="text-text-secondary mb-4 text-center">No posts yet.</Text>
              <TouchableOpacity onPress={() => navigation.navigate('UploadMedia')} className="bg-primary px-6 py-3 rounded-full">
                <Text className="text-white font-semibold">Create your first post</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row flex-wrap px-3 pb-6" style={{ gap: 12 }}>
              {filteredMedia.map((item) => (
                <View key={item.id} className="bg-surface rounded-xl overflow-hidden shadow-md" style={{ width: CARD_WIDTH }}>
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
                  <View className="flex-row justify-between items-center p-2">
                    <View className="flex-1 pr-2">
                      <Text className="text-sm font-semibold text-text" numberOfLines={1}>{item.title}</Text>
                      <Text className="text-xs text-text-secondary">{item.viewsCount} views</Text>
                    </View>
                    <View className="flex-row gap-1">
                      <TouchableOpacity onPress={() => openMediaEdit(item)} className="bg-background p-2 rounded-full">
                        <Text>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => confirmDelete(item)} className="bg-background p-2 rounded-full">
                        <Text>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {/* FOLLOWERS TAB */}
      {activeTab === 'followers' && (
        <View className="px-4">
          {followers.length === 0 ? (
            <Text className="text-text-secondary text-center py-20">No followers yet.</Text>
          ) : (
            followers.map((u) => <UserRow key={u.id} user={u} />)
          )}
        </View>
      )}

      {/* FOLLOWING TAB */}
      {activeTab === 'following' && (
        <View className="px-4">
          {following.length === 0 ? (
            <Text className="text-text-secondary text-center py-20">Not following anyone yet.</Text>
          ) : (
            following.map((u) => <UserRow key={u.id} user={u} />)
          )}
        </View>
      )}

      {/* Edit Profile Modal */}
      <Modal visible={editOpen} transparent animationType="slide" onRequestClose={() => setEditOpen(false)}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-surface rounded-t-3xl p-6">
            <Text className="text-xl font-bold mb-4">Edit Profile</Text>

            <View className="items-center mb-6">
              <TouchableOpacity onPress={pickAvatar} className="relative">
                {avatarPreview ? (
                  <Image source={{ uri: avatarPreview }} style={{ width: 96, height: 96, borderRadius: 48 }} />
                ) : (
                  <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                    <Text className="text-white text-3xl font-bold">{(editName || 'U')[0].toUpperCase()}</Text>
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
            <TextInput value={editName} onChangeText={setEditName} className="bg-background rounded-lg px-4 py-2 mb-3 border border-border" />

            <Text className="text-sm font-medium mb-1">Bio</Text>
            <TextInput value={editBio} onChangeText={setEditBio} multiline numberOfLines={3} className="bg-background rounded-lg px-4 py-2 mb-4 border border-border" />

            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setEditOpen(false)} className="flex-1 bg-background border border-border py-3 rounded-lg">
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveProfile} disabled={saving || uploadingAvatar} className="flex-1 bg-primary py-3 rounded-lg">
                {uploadingAvatar || saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center font-semibold">Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Media Modal */}
      <Modal visible={mediaEditOpen} transparent animationType="slide" onRequestClose={() => { setMediaEditOpen(false); setEditingMedia(null); }}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-surface rounded-t-3xl p-6">
            <Text className="text-xl font-bold mb-4">Edit Post</Text>

            <Text className="text-sm font-medium mb-1">Title</Text>
            <TextInput value={mediaTitle} onChangeText={setMediaTitle} className="bg-background rounded-lg px-4 py-2 mb-3 border border-border" />

            <Text className="text-sm font-medium mb-1">Description</Text>
            <TextInput value={mediaDescription} onChangeText={setMediaDescription} multiline numberOfLines={3} className="bg-background rounded-lg px-4 py-2 mb-3 border border-border" />

            <Text className="text-sm font-medium mb-1">Type</Text>
            <View className="flex-row gap-2 mb-4">
              {['PHOTO', 'VIDEO', 'AUDIO'].map((t) => (
                <TouchableOpacity key={t} onPress={() => setMediaType(t)}
                  className={`flex-1 py-2 rounded-lg ${mediaType === t ? 'bg-primary' : 'bg-background border border-border'}`}>
                  <Text className={`text-center font-medium ${mediaType === t ? 'text-white' : 'text-text'}`}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => { setMediaEditOpen(false); setEditingMedia(null); }} className="flex-1 bg-background border border-border py-3 rounded-lg">
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveMedia} disabled={savingMedia} className="flex-1 bg-primary py-3 rounded-lg">
                {savingMedia ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center font-semibold">Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}