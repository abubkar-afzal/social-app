import React from 'react';

export default function Blog() {
  const posts = [
    { id: 1, title: '10 Tips for Better Photography', excerpt: 'Learn how to capture stunning photos with your phone.' },
    { id: 2, title: 'The Future of Video Sharing', excerpt: 'Trends shaping the video content landscape.' },
    { id: 3, title: 'Audio Storytelling', excerpt: 'Why audio is making a comeback in social media.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-6">Blog</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-surface p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-text">{post.title}</h2>
              <p className="text-text-secondary mt-2">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}