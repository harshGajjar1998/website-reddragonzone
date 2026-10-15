import type { NextConfig } from "next";
import widths from "./image-widths.json";

/**
 * Static export for Netlify: `next build` writes the whole site to `out/`.
 * - trailingSlash → every route is emitted as `route/index.html`, so refreshing
 *   or deep-linking any page finds a real file (no "Page not found").
 * - There is no image server, so `scripts/optimize-images.mjs` pre-builds resized WebP
 *   copies and `image-loader.ts` points next/image's srcset at them (widths below).
 * - Redirects live in `public/_redirects` (Netlify reads it from the deploy root).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    imageSizes: widths.imageSizes,
    deviceSizes: widths.deviceSizes,
  },
};

export default nextConfig;
