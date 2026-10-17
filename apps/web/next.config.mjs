/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['ui'],

  images: {
    remotePatterns: [
            { protocol: 'https', hostname: 'ar-media-sigma.vercel.app', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },

  async headers() {
    return [
      {
        // Match all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          },
          { key: 'Access-Control-Max-Age', value: '86400' },
          { key: 'Access-Control-Expose-Headers', value: 'Content-Length, Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;