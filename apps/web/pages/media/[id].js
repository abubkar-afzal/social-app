import React from 'react';
import { useRouter } from 'next/router';
import MediaDetail from '../../../../packages/ui/src/components/web/MediaDetail';

export default function MediaDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {id && <MediaDetail mediaId={id} />}
      </main>
    </div>
  );
}