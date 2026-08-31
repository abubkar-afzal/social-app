import React, { useState } from 'react';

export default function UploadMedia() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PHOTO'); // or 'VIDEO' or 'AUDIO'
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('type', type);
    formData.append('description', 'Uploaded from web');

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('Uploaded media:', data);
      // data.googleDriveFileId contains the Drive file ID
      alert('Upload successful!');
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="PHOTO">Photo</option>
        <option value="VIDEO">Video</option>
        <option value="AUDIO">Audio</option>
      </select>
      <input type="file" onChange={handleFileChange} accept="image/*,video/*,audio/*" required />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}