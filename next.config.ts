import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://ilkaf168c5.ufs.sh/f/**")],
  },
};

export default nextConfig;
