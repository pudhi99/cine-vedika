/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
  experimental: {
    turbo: false, // Disable Turbopack
  },
};

export default config;
