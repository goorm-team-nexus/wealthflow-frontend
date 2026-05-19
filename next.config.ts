import type { NextConfig } from "next";

const apiBaseUrl = process.env.API_BASE_URL ?? "https://d3uib3r331utfe.cloudfront.net";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
