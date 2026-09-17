import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Market guides were briefly live under /projects/markets before moving
  // to Services > Markets.
  async redirects() {
    return [
      { source: "/projects/markets", destination: "/services/markets", permanent: true },
      { source: "/projects/markets/:slug", destination: "/services/markets/:slug", permanent: true },
      // Investor Services pages were removed from Approach and Expertise.
      { source: "/services/approach/investor-services", destination: "/investors", permanent: true },
      { source: "/services/expertise/investor-services", destination: "/investors", permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      // Render runs Next.js on localhost:10000 behind a reverse proxy.
      // Next.js CSRF protection compares the browser's Origin header against
      // the internal host header — they differ, causing "fetch invalid" errors.
      // Listing the public hostname here tells Next.js to accept that origin.
      allowedOrigins: ["usflooring.onrender.com"],
    },
  },
};

export default nextConfig;
