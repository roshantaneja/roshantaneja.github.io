/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable Vercel ISR and API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Currently inert: next/image is not used anywhere. Kept for future use.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'daroshi11260.imgix.net',
      },
    ],
    unoptimized: true, // For compatibility with Vercel's default behavior
  },
  // Allow MapLibre and GIBS tile sources in headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
