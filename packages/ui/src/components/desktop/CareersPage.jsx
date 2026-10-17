import React from 'react';

const ROLES = [
  { title: 'Senior Frontend Engineer', location: 'Remote', type: 'Full-time' },
  { title: 'Product Designer', location: 'Remote', type: 'Full-time' },
  { title: 'Backend Engineer (Node.js)', location: 'Remote', type: 'Full-time' },
  { title: 'Community Manager', location: 'Karachi, PK', type: 'Full-time' },
  { title: 'Content Moderator', location: 'Remote', type: 'Part-time' },
];

export default function DesktopCareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-4">Careers at AR Media</h1>
        <p className="text-lg text-text-secondary mb-8">
          Join our team and help shape the future of visual discovery. We're a remote-first
          company that values creativity, ownership, and kindness.
        </p>

        <div className="space-y-4">
          {ROLES.map((role) => (
            <div key={role.title} className="bg-surface p-5 rounded-xl shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-text">{role.title}</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    {role.location} · {role.type}
                  </p>
                </div>
                <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-text mt-10 mb-3">Why AR Media?</h2>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary">
          <li>Fully remote team with flexible hours</li>
          <li>Competitive compensation and equity</li>
          <li>Health, dental, and vision benefits</li>
          <li>Annual learning budget</li>
        </ul>
      </main>
      
    </div>
  );
}