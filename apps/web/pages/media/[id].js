import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MediaDetail from '../../../../packages/ui/src/components/web/MediaDetail';
import SEO from '../../components/SEO';

export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/media/${params.id}`);
    if (!res.ok) return { props: { media: null } };
    const media = await res.json();
    return { props: { media } };
  } catch {
    return { props: { media: null } };
  }
}

export default function MediaDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [media, setMedia] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={media?.title || 'Media'}
        description={media?.description || 'View and interact with shared media on AR Media.'}
        image={media?.thumbnailUrl || undefined}
        url={`/media/${id}`}
        type="article"
      />
      <main className="flex-1">
        {id && <MediaDetail mediaId={id} media={media} setMedia={setMedia} />}
      </main>
    </div>
  );
}