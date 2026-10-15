import SEO from '../components/SEO';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import Hero from '../../../packages/ui/src/components/web/Hero';
import Footer from '../../../packages/ui/src/components/web/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Home"
        description="Explore trending videos, photos, and audio from creators around the world."
        url="/"
      />
      <Navbar />
      <main className="flex-1"><Hero /></main>
      <Footer />
    </div>
  );
}