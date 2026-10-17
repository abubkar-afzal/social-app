import React from 'react';

const POSTS = [
  { id: 1, title: '10 Tips for Better Photography', excerpt: 'Learn how to capture stunning photos with your phone, no professional gear required.', date: 'Oct 12, 2026', tag: 'Photography' },
  { id: 2, title: 'The Future of Video Sharing', excerpt: 'Trends shaping the video content landscape over the next decade.', date: 'Oct 5, 2026', tag: 'Video' },
  { id: 3, title: 'Audio Storytelling is Back', excerpt: 'Why audio is making a comeback in social media and how to make the most of it.', date: 'Sep 28, 2026', tag: 'Audio' },
  { id: 4, title: 'Building a Creator Community', excerpt: 'Strategies for growing an engaged audience without burning out.', date: 'Sep 20, 2026', tag: 'Community' },
  { id: 5, title: 'How We Scale AR Media', excerpt: 'A peek behind the curtain at our infrastructure and engineering decisions.', date: 'Sep 15, 2026', tag: 'Engineering' },
];

export default function DesktopBlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-2">Blog</h1>
        <p className="text-lg text-text-secondary mb-8">
          Stories, tips, and updates from the AR Media team.
        </p>

        <div className="space-y-4">
          {POSTS.map((post) => (
            <article key={post.id} className="bg-surface p-5 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                  {post.tag}
                </span>
                <span className="text-xs text-text-secondary">{post.date}</span>
              </div>
              <h2 className="text-lg font-semibold text-text mb-1">{post.title}</h2>
              <p className="text-sm text-text-secondary">{post.excerpt}</p>
              <button className="text-primary text-sm font-medium mt-3 hover:underline">
                Read more →
              </button>
            </article>
          ))}
        </div>
      </main>
      
    </div>
  );
}