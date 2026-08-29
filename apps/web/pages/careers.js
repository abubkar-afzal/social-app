import React from 'react';

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-text mb-6">Careers</h1>
        <p className="text-lg text-text-secondary mb-8">Join our team and help shape the future of visual discovery.</p>
        <div className="grid gap-6">
          {['Software Engineer', 'Product Designer', 'Data Scientist', 'Marketing Manager'].map((role) => (
            <div key={role} className="bg-surface p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-text">{role}</h2>
              <p className="text-text-secondary mt-2">We're looking for passionate individuals to join our remote-first team.</p>
              <button className="mt-4 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition">Apply Now</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}