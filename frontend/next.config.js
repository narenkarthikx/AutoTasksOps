/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure backend API proxy if needed
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : 'http://localhost:3001/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
