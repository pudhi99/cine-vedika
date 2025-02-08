/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["upload.wikimedia.org", "commons.wikimedia.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
