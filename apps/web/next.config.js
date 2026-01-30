/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  distDir: "build",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.contentstack.io"
      }
    ]
  }
};

module.exports = nextConfig;

