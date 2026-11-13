import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The newsletter signup is gone; links from its confirmation emails land
  // on the home page instead of a missing page.
  async redirects() {
    return [
      { source: "/subscribe/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
