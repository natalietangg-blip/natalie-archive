/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-3dfc584c8b3948aebb7dab46addcdaeb.r2.dev',
      },
    ],
  },
}

module.exports = nextConfig
