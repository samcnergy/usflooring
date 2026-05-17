import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
