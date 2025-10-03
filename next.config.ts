import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-dialog"],
  },

  // Docker-specific configuration
  output: 'standalone',

  // Image optimization for external domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/dvhf52ob/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    domains: ["cdn.sanity.io"],
  },

  // Compression
  compress: true,

  // PoweredByHeader
  poweredByHeader: false,

  // Generate build-time sitemap
  async generateBuildId() {
    return "wildlife-photography-" + Date.now();
  },
};

export default nextConfig;
