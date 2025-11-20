/* @type {import('next').NextConfig} */

import { hostname } from "os";

const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/login",
        destination: "/signin",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "nextui.org",
      },
      {
        protocol: "https",
        hostname: "qualzen-store.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "qualzen-store.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com", // todo:  remove
      },
      {
        protocol: "https",
        hostname: "static.cdn-luma.com", // todo:  remove
      },
      {
        protocol: "https",
        hostname: "lumalabs.ai", // todo:  remove
      },
      {
        protocol: "https",
        hostname: "qual-test-warfeo.s3.ap-south-1.amazonaws.com", // todo:  remove
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com", // todo:  remove
      },
      {
        protocol: "https",
        hostname: "varfoestore.1be3c7f6dc46cafe42bce3c71227a5e5.r2.cloudflarestorage.com", // todo:  remove
      },
    ],
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/,

        use: [{ loader: "@svgr/webpack", options: { icon: true } }],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
