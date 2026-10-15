import { Html, Head, Main, NextScript } from 'next/document';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ar-media-sigma.vercel.app';
const SITE_NAME = 'AR Media';
const SITE_DESCRIPTION =
  'Discover, share, and inspire. Explore a world of videos, photos, and audio curated by people like you.';
const SITE_KEYWORDS =
  'AR Media, media sharing, videos, photos, audio, social media, pinterest, share media, discover media';
const TWITTER_HANDLE = '@armedia'; // update if you have one
const OG_IMAGE = `${SITE_URL}/my_logo.jpg`; // 1200×630 recommended
const FAVICON = `${SITE_URL}/my_logo.jpg`;
const THEME_COLOR = '#e6005c';

export default function Document() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        {/* -------------------- Charset & viewport -------------------- */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* -------------------- Primary meta -------------------- */}
        <title>{`${SITE_NAME} — Discover, Share & Inspire`}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="keywords" content={SITE_KEYWORDS} />
        <meta name="author" content={SITE_NAME} />
        <meta name="application-name" content={SITE_NAME} />

        {/* -------------------- Canonical & alternates -------------------- */}
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" hrefLang="en" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

        {/* -------------------- Robots -------------------- */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        {/* -------------------- Open Graph (Facebook, LinkedIn, WhatsApp) -------------------- */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={`${SITE_NAME} — Discover, Share & Inspire`} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${SITE_NAME} — Discover, Share & Inspire`} />
        <meta property="og:locale" content="en_US" />

        {/* -------------------- Twitter Card -------------------- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="twitter:title" content={`${SITE_NAME} — Discover, Share & Inspire`} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content={`${SITE_NAME} — Discover, Share & Inspire`} />

        {/* -------------------- PWA / Mobile -------------------- */}
        <meta name="theme-color" content={THEME_COLOR} media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />

        {/* -------------------- Icons -------------------- */}
        <link rel="icon" href={FAVICON} sizes="any" />
        <link rel="icon" href={`${SITE_URL}/my_logo.jpg`} type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* -------------------- Preconnect / DNS prefetch -------------------- */}
        <link rel="preconnect" href="https://accounts.google.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="preconnect" href="https://drive.google.com" />
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />

        {/* -------------------- Google Identity Services (required for sign-in) -------------------- */}
        <script src="https://accounts.google.com/gsi/client" async defer />

        {/* -------------------- JSON-LD Structured Data -------------------- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              inLanguage: 'en',
              publisher: {
                '@type': 'Organization',
                name: SITE_NAME,
                url: SITE_URL,
                logo: {
                  '@type': 'ImageObject',
                  url: `${SITE_URL}/icon.png`,
                },
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${SITE_URL}/?search={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}