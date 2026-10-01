import React from 'react';
import FavoritesGrid from '../../../packages/ui/src/components/web/FavoritesGrid';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
  
      <main className="flex-1">
        <FavoritesGrid />
      </main>
     
    </div>
  );
}