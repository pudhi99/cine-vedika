/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "upload.wikimedia.org",
      "commons.wikimedia.org",
      "m.media-amazon.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
