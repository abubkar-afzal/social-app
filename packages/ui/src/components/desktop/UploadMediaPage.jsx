import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CropperModal from './CropperModal';
import { apiUrl, authFetch, getStoredToken } from '../../utils/apiConfig';
import {
  PencilSquareIcon as EditIcon,
  XMarkIcon as CloseIcon,
} from '../../icons';

export default function DesktopUploadMedia() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [type, setType] = useState('PHOTO');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [cropperOpen, setCropperOpen] = useState(false);

  const fileInputRef = useRef(null);

  const acceptFor = {
    PHOTO: 'image/*',
    VIDEO: 'video/*',
    AUDIO: 'audio/*',
  };

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    let detected = 'PHOTO';
    if (f.type.startsWith('video/')) detected = 'VIDEO';
    else if (f.type.startsWith('audio/')) detected = 'AUDIO';
    setType(detected);

    setFile(f);
    setCroppedBlob(null);
    setPreview(URL.createObjectURL(f));
  };

  const handleCropDone = ({ blob, previewUrl }) => {
    setCroppedBlob(blob);
    setPreview(previewUrl);
    setCropperOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!getStoredToken()) {
      navigate('/login');
      return;
    }
    if (!file || !title) {
      setError('Please provide a title and select a file.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();

      if (croppedBlob) {
        formData.append('file', croppedBlob, `cropped_${Date.now()}.jpg`);
      } else {
        formData.append('file', file);
      }

      formData.append('title', title);
      formData.append('type', type);
      formData.append('description', description || '');

      const res = await authFetch(apiUrl('/api/media/upload'), {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      navigate(`/media/${data.id}`);
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  const clearFile = () => {
    setFile(null);
    setPreview('');
    setCroppedBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-text mb-6">Create Post</h1>

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
            placeholder="Give your post a title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="flex gap-2">
            {['PHOTO', 'VIDEO', 'AUDIO'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t);
                  clearFile();
                }}
                className={`flex-1 py-3 rounded-lg font-medium transition ${
                  type === t
                    ? 'bg-primary text-white'
                    : 'bg-background border border-border text-text hover:bg-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
            placeholder="Tell us about your post"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">File</label>

          {!preview ? (
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition">
              <input
                ref={fileInputRef}
                type="file"
                id="file-input-desktop"
                onChange={handleFileSelect}
                accept={acceptFor[type]}
                className="hidden"
              />
              <label htmlFor="file-input-desktop" className="cursor-pointer block">
                <p className="text-4xl mb-2">📁</p>
                <p className="text-text font-medium">Click to select a file</p>
                <p className="text-xs text-text-secondary mt-1">
                  {type === 'PHOTO'
                    ? 'JPG, PNG, WEBP'
                    : type === 'VIDEO'
                    ? 'MP4, WEBM'
                    : 'MP3, WAV'}
                </p>
              </label>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-border bg-black">
              {type === 'PHOTO' && (
                <img src={preview} alt="Preview" className="w-full max-h-96 object-contain" />
              )}
              {type === 'VIDEO' && (
                <video src={preview} controls className="w-full max-h-96" />
              )}
              {type === 'AUDIO' && (
                <div className="p-4 bg-surface">
                  <audio src={preview} controls className="w-full" />
                </div>
              )}

              <div className="absolute top-2 right-2 flex gap-1">
                {type === 'PHOTO' && (
                  <button
                    type="button"
                    onClick={() => setCropperOpen(true)}
                    className="rounded-full bg-white/90 p-2 hover:bg-white shadow"
                    title="Crop image"
                  >
                    <EditIcon className="h-4 w-4 text-text" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearFile}
                  className="rounded-full bg-white/90 p-2 hover:bg-error hover:text-white shadow"
                  title="Remove"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="p-2 bg-surface border-t border-border">
                <p className="text-xs text-text-secondary truncate">
                  {croppedBlob ? 'Cropped image' : file?.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-error/10 border border-error text-error rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file || !title}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Publish'}
        </button>
      </form>

      {cropperOpen && preview && (
        <CropperModal
          imageSrc={preview}
          aspect={type === 'PHOTO' ? 1 : 16 / 9}
          circular={false}
          title="Crop your image"
          onCancel={() => setCropperOpen(false)}
          onCropDone={handleCropDone}
        />
      )}
    </div>
  );
}