import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/auth-proxy/:path*",
        destination: "/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
