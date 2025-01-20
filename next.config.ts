import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devServer: {
    port: 3061, // Change this to your desired port number
  },
  output: 'export'
};

export default nextConfig;
