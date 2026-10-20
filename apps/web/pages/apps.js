import SEO from '../components/SEO';
import AppsPage from '../../../packages/ui/src/components/web/AppsPage';

export default function Apps() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Download"
        description="Download AR Media for Android, Windows, macOS, and Linux."
        url="/apps"
      />
      <main className="flex-1">
        <AppsPage />
      </main>
    </div>
  );
}