import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { apiUrl } from '../../utils/apiConfig';

export default function UploadMediaScreen() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PHOTO');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success') {
      setFile(result);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      Alert.alert('Error', 'Please select a file and enter a title');
      return;
    }
    setUploading(true);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
  Alert.alert('Error', 'You must sign in to upload.');
  navigation.navigate('Login');
  return;
}
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
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
      Alert.alert('Success', 'Post created');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setUploading(false);
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

        <View className="flex-row gap-2 mb-4">
          {['PHOTO', 'VIDEO', 'AUDIO'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              className={`flex-1 py-3 rounded-lg ${type === t ? 'bg-primary' : 'bg-surface border border-border'}`}
            >
              <Text className={`text-center font-medium ${type === t ? 'text-white' : 'text-text'}`}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          className="bg-surface rounded-lg px-4 py-3 mb-4 border border-border"
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity
          onPress={pickFile}
          className="bg-surface border-2 border-dashed border-border rounded-lg py-6 mb-4 items-center"
        >
          <Text className="text-2xl mb-2">📁</Text>
          <Text className="text-text font-medium">{file ? file.name : 'Tap to select file'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUpload}
          disabled={uploading}
          className="bg-primary py-4 rounded-lg"
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