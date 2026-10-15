import Head from 'next/head';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ar-media-sigma.vercel.app';
const SITE_NAME = 'AR Media';
const DEFAULT_OG = `${SITE_URL}/og-image.png`;

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  author,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullDescription =
    description ||
    'Discover, share, and inspire. Explore a world of videos, photos, and audio curated by people like you.';
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image || DEFAULT_OG;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:type" content={type} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
    </Head>
  );
}