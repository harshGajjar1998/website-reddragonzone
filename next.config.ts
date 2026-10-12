import type { NextConfig } from "next";

/**
 * Static export for Netlify: `next build` writes the whole site to `out/`.
 * - trailingSlash → every route is emitted as `route/index.html`, so refreshing
 *   or deep-linking any page finds a real file (no "Page not found").
 * - Image optimisation needs a server, so images are served as-is.
 * - Redirects live in `public/_redirects` (Netlify reads it from the deploy root).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
