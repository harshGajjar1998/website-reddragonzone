import type { NextConfig } from "next";
import widths from "./image-widths.json";

/**
 * Static export for Netlify: `next build` writes the whole site to `out/`.
 * - trailingSlash → every route is emitted as `route/index.html`, so refreshing
 *   or deep-linking any page finds a real file (no "Page not found").
 * - There is no image server, so `scripts/optimize-images.mjs` pre-builds resized WebP
 *   copies and `image-loader.ts` points next/image's srcset at them (widths below).
 * - Redirects live in `public/_redirects` (Netlify reads it from the deploy root).
 * - Content comes from the CMS at build time (src/lib/cms). CMS_BUILD_STAMP makes each build fetch it
 *   afresh: Netlify keeps .next/cache between builds, and a cached response would hide new content.
 */
const nextConfig: NextConfig = {
  output: "export",
  // The CMS draft-preview server (scripts/cms-preview.mjs) builds into its own folder
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // …and hides the dev badge so the editor shows the page exactly as visitors see it
  devIndicators: process.env.CMS_PREVIEW === "1" ? false : undefined,
  env: { CMS_BUILD_STAMP: String(Date.now()) },
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    imageSizes: widths.imageSizes,
    deviceSizes: widths.deviceSizes,
  },
};

export default nextConfig;
