import SEO from '../components/SEO';
import Hero from '../../../packages/ui/src/components/web/Hero';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Home"
        description="Explore trending videos, photos, and audio from creators around the world."
        url="/"
      />
      
      <main className="flex-1"><Hero /></main>
      
    </div>
  );
}