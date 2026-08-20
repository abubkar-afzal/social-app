import React, { useState } from 'react';

export default function AccountPage() {
  const [user, setUser] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Passionate about sharing beautiful content',
    followers: 1234,
    following: 567,
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-6 mb-8">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-text-secondary">{user.bio}</p>
              <div className="flex gap-4 mt-2">
                <span>{user.followers} followers</span>
                <span>{user.following} following</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}