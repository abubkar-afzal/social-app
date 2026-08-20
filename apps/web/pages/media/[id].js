import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../../packages/ui/src/components/web/Navbar';
import MediaDetail from '../../../../packages/ui/src/components/web/MediaDetail';
import Footer from '../../../../packages/ui/src/components/web/Footer';

export default function MediaDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {id && <MediaDetail mediaId={id} />}
      </main>
      <Footer />
    </div>
  );
}