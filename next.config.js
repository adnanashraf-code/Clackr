/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable linting and TS check during production build to avoid compilation failures on user's system
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
