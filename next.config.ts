import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/auth-proxy/:path*",
        destination: "/api/auth/:path*",
      },
      {
        source: "/api-proxy/:path*",
        destination: "https://d3uib3r331utfe.cloudfront.net/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
