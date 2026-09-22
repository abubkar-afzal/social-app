import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import Footer from '../../../packages/ui/src/components/web/Footer';
import { apiUrl, authFetch, getStoredToken } from '../../../packages/ui/src/utils/apiConfig';

export default function UploadMedia() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PHOTO');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure user is logged in
    const token = getStoredToken();
    if (!token) {
      setError('You must sign in to upload media.');
      router.push('/login');
      return;
    }

    if (!file || !title) {
      setError('Please provide a title and select a file.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('type', type);
    formData.append('description', description || '');

    try {
      // Use authFetch so the Authorization header is sent automatically
      const res = await authFetch(apiUrl('/api/media/upload'), {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/media/${data.id}`);
      }, 1200);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold text-text mb-6">Create Post</h1>

        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow-md p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
                  onClick={() => setType(t)}
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
              className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tell us about your post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">File</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition">
              <input
                type="file"
                id="file-input"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,video/*,audio/*"
                className="hidden"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <p className="text-4xl mb-2">📁</p>
                <p className="text-text font-medium">
                  {file ? file.name : 'Click to select a file'}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Images, videos, or audio
                </p>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-error/10 border border-error text-error rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success/10 border border-success text-success rounded-lg p-3 text-sm">
              Upload successful! Redirecting...
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
      </main>
      <Footer />
    </div>
  );
}