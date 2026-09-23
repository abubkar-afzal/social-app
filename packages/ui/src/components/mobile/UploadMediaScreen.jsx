import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { apiUrl } from '../../utils/apiConfig';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useAudioPlayer } from 'expo-audio';

export default function UploadMediaScreen() {
  const [file, setFile] = useState(null); // { uri, name, mimeType }
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PHOTO');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Photo access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,             // ✨ native crop UI
      quality: 0.9,
      // aspect is omitted so user can crop freely
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFile({
        uri: asset.uri,
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        mimeType: asset.mimeType || 'image/jpeg',
      });
      setType('PHOTO');
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,   // videos can't be cropped with ImagePicker
      quality: 0.9,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setFile({
        uri: asset.uri,
        name: asset.fileName || `video_${Date.now()}.mp4`,
        mimeType: asset.mimeType || 'video/mp4',
      });
      setType('VIDEO');
    }
  };

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true,
    });
    if (result.type === 'success') {
      setFile({
        uri: result.uri,
        name: result.name,
        mimeType: result.mimeType || 'audio/mpeg',
      });
      setType('AUDIO');
    }
  };

  const pickFile = () => {
    Alert.alert('Select type', 'What are you uploading?', [
      { text: 'Photo', onPress: pickPhoto },
      { text: 'Video', onPress: pickVideo },
      { text: 'Audio', onPress: pickAudio },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleUpload = async () => {
    if (!file || !title) {
      Alert.alert('Error', 'Please select a file and enter a title');
      return;
    }
    setUploading(true);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      });
      formData.append('title', title);
      formData.append('type', type);
      formData.append('description', description || '');

      const res = await fetch(apiUrl('/api/media/upload'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Upload failed');
      }
      const data = await res.json();
      Alert.alert('Success', 'Post created');
      navigation.replace('MediaDetail', { mediaId: data.id, type });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setUploading(false);
  };

  /* ------------------ Inline preview renderers ------------------ */
  const renderPreview = () => {
    if (!file) return null;

    if (type === 'PHOTO') {
      return (
        <Image
          source={{ uri: file.uri }}
          style={{ width: '100%', height: 240, borderRadius: 12 }}
          resizeMode="contain"
        />
      );
    }

    if (type === 'VIDEO') {
      const VideoPreview = () => {
        const player = useVideoPlayer(file.uri, (p) => { p.loop = false; p.muted = false; });
        return (
          <VideoView
            player={player}
            style={{ width: '100%', height: 240, borderRadius: 12 }}
            contentFit="contain"
            nativeControls
          />
        );
      };
      return <VideoPreview />;
    }

    if (type === 'AUDIO') {
      const AudioPreview = () => {
        const player = useAudioPlayer({ uri: file.uri });
        const [isPlaying, setIsPlaying] = useState(false);
        const toggle = () => {
          if (isPlaying) player.pause();
          else player.play();
          setIsPlaying(!isPlaying);
        };
        return (
          <View className="bg-surface border border-border rounded-xl p-4 items-center">
            <TouchableOpacity onPress={toggle} className="bg-primary rounded-full p-5">
              <Text className="text-3xl text-white">{isPlaying ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>
            <Text className="text-text mt-2" numberOfLines={1}>{file.name}</Text>
          </View>
        );
      };
      return <AudioPreview />;
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold text-text mb-6">Create Post</Text>

        <TextInput
          className="bg-surface rounded-lg px-4 py-3 mb-4 border border-border"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          className="bg-surface rounded-lg px-4 py-3 mb-4 border border-border"
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Picker */}
        <TouchableOpacity
          onPress={pickFile}
          className="bg-surface border-2 border-dashed border-border rounded-lg py-6 mb-4 items-center"
        >
          <Text className="text-2xl mb-2">📁</Text>
          <Text className="text-text font-medium">
            {file ? 'Change file' : 'Tap to select a file'}
          </Text>
          <Text className="text-xs text-text-secondary mt-1">
            Photo (with crop), Video, or Audio
          </Text>
        </TouchableOpacity>

        {/* Preview */}
        {file && (
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-medium text-text">Preview</Text>
              <TouchableOpacity onPress={() => setFile(null)}>
                <Text className="text-error text-sm">Remove</Text>
              </TouchableOpacity>
            </View>
            {renderPreview()}
          </View>
        )}

        <TouchableOpacity
          onPress={handleUpload}
          disabled={uploading || !file || !title}
          className={`py-4 rounded-lg ${uploading || !file || !title ? 'bg-border' : 'bg-primary'}`}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold">Upload</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}