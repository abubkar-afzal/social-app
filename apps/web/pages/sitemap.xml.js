const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ar-media-sigma.vercel.app';

function generateSiteMap(mediaItems) {
  const staticPages = ['', '/videos', '/photos', '/audio', '/about', '/blog', '/help', '/privacy', '/terms'];
  const now = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (path) => `
    <url>
      <loc>${SITE_URL}${path}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${path === '' ? 'daily' : 'weekly'}</changefreq>
      <priority>${path === '' ? '1.0' : '0.8'}</priority>
    </url>`
    )
    .join('')}
  ${mediaItems
    .map(
      (item) => `
    <url>
      <loc>${SITE_URL}/media/${item.id}</loc>
      <lastmod>${item.updatedAt || now}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>`
    )
    .join('')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  try {
    const apiRes = await fetch(`${SITE_URL}/api/media?page=0&limit=500`);
    const data = await apiRes.json();
    const sitemap = generateSiteMap(data.media || []);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();
  } catch (e) {
    res.statusCode = 500;
    res.end();
  }

  return { props: {} };
}

export default function SiteMap() {
  return null;
}