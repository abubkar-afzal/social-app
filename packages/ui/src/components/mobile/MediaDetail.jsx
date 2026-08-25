import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, FlatList, TextInput, Platform } from 'react-native';
import { Video, Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchMediaById, fetchSuggestions } from '../../utils/mockData';

const VideoPlayer = ({ src }) => (
  <Video
    source={{ uri: src }}
    style={{ width: '100%', aspectRatio: 16 / 9 }}
    resizeMode="contain"
    shouldPlay
    useNativeControls
    isMuted={false}
  />
);

const AudioPlayer = ({ src, title }) => {
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
    <View className="aspect-square bg-gradient-to-br from-primary-light to-primary-dark items-center justify-center">
      <TouchableOpacity onPress={togglePlay} className="rounded-full bg-white/20 p-6">
        <Text className="text-6xl">{isPlaying ? '⏸️' : '▶️'}</Text>
      </TouchableOpacity>
      <Text className="text-white text-lg mt-4 font-semibold">{title}</Text>
    </View>
  );
};

const SuggestionCard = ({ item, navigation }) => (
  <TouchableOpacity
    className="bg-surface rounded-xl overflow-hidden mr-3"
    style={{ width: 150 }}
    onPress={() => navigation.navigate('MediaDetail', { mediaId: item.id, type: item.type })}
    activeOpacity={0.8}
  >
    {item.type === 'photo' ? (
      <Image source={{ uri: item.src }} style={{ width: '100%', aspectRatio: 1 }} />
    ) : (
      <View className="aspect-square bg-gradient-to-br from-primary to-primary-dark items-center justify-center">
        <Text className="text-3xl">{item.type === 'video' ? '▶️' : '🎵'}</Text>
      </View>
    )}
    <View className="p-2">
      <Text className="text-xs font-semibold text-text" numberOfLines={1}>{item.title}</Text>
      <Text className="text-xs text-text-secondary">{item.views} views</Text>
    </View>
  </TouchableOpacity>
);

export default function MobileMediaDetail() {
  const [media, setMedia] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { mediaId } = route.params;

  useEffect(() => {
    loadMedia();
  }, [mediaId]);

  const loadMedia = async () => {
    setLoading(true);
    const item = await fetchMediaById(mediaId);
    setMedia(item);
    const sugg = await fetchSuggestions(item.type, mediaId);
    setSuggestions(sugg);
    setLoading(false);
  };

  const addComment = () => {
    if (comment.trim()) {
      setComments([...comments, { id: comments.length + 1, user: 'Demo User', text: comment, time: 'Just now' }]);
      setComment('');
    }
  };

  if (loading || !media) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#e6005c" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" style={{ paddingTop: Platform.OS === 'android' ? 20 : 0 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
        <Text className="text-primary text-lg">← Back</Text>
      </TouchableOpacity>

      <View className="bg-surface rounded-b-xl overflow-hidden">
        {media.type === 'video' && <VideoPlayer src={media.src} />}
        {media.type === 'photo' && <Image source={{ uri: media.src }} style={{ width: '100%', aspectRatio: 1 }} />}
        {media.type === 'audio' && <AudioPlayer src={media.src} title={media.title} />}
      </View>

      <View className="p-4">
        <Text className="text-2xl font-bold text-text">{media.title}</Text>
        <Text className="text-text-secondary mt-1">{media.description}</Text>

        <View className="flex-row gap-6 mt-4">
          <TouchableOpacity onPress={() => setIsLiked(!isLiked)} className="flex-row items-center gap-1">
            <Text className="text-2xl">{isLiked ? '❤️' : '🤍'}</Text>
            <Text className="text-text-secondary">{media.likes + (isLiked ? 1 : 0)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSaved(!isSaved)} className="flex-row items-center gap-1">
            <Text className="text-2xl">{isSaved ? '🔖' : '📑'}</Text>
            <Text className="text-text-secondary">{media.saves + (isSaved ? 1 : 0)}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Text className="text-2xl">📤</Text>
            <Text className="text-text-secondary">Share</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-3 mt-6 bg-surface rounded-xl p-4">
          <Image source={{ uri: media.userAvatar }} className="w-12 h-12 rounded-full" />
          <View className="flex-1">
            <Text className="font-semibold text-text">{media.user}</Text>
            <Text className="text-sm text-text-secondary">1.2k followers</Text>
          </View>
          <TouchableOpacity onPress={() => setIsFollowing(!isFollowing)} className={`px-4 py-2 rounded-full ${isFollowing ? 'bg-background border border-border' : 'bg-primary'}`}>
            <Text className={`font-medium ${isFollowing ? 'text-text' : 'text-white'}`}>{isFollowing ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <Text className="text-xl font-bold text-text mb-4">Comments ({comments.length})</Text>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput className="flex-1 bg-surface rounded-full px-4 py-2 border border-border" placeholder="Add a comment..." value={comment} onChangeText={setComment} />
            <TouchableOpacity onPress={addComment} className="bg-primary px-4 py-2 rounded-full">
              <Text className="text-white font-medium">Post</Text>
            </TouchableOpacity>
          </View>
          {comments.map((c) => (
            <View key={c.id} className="flex-row gap-3 mb-4">
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} className="w-10 h-10 rounded-full" />
              <View className="flex-1">
                <Text className="font-semibold text-sm">{c.user}</Text>
                <Text className="text-text-secondary">{c.text}</Text>
                <Text className="text-xs text-text-secondary mt-1">{c.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Text className="text-xl font-bold text-text px-4 mt-6">More like this</Text>
      <FlatList
        data={suggestions}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => <SuggestionCard item={item} navigation={navigation} />}
        keyExtractor={(item) => item.id}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}