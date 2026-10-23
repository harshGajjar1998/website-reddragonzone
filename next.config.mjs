// Plain JS (not next.config.ts): the CMS preview is built on Hostinger, whose Linux is too old for
// Next's native compiler, and the WebAssembly fallback can't load a TypeScript config.
import { readFileSync } from "node:fs";

const widths = JSON.parse(readFileSync(new URL("./image-widths.json", import.meta.url), "utf8"));
const preview = process.env.CMS_PREVIEW === "1";

/**
 * Static export for Netlify: `next build` writes the whole site to `out/`.
 * - trailingSlash → every route is emitted as `route/index.html`, so refreshing
 *   or deep-linking any page finds a real file (no "Page not found").
 * - There is no image server, so `scripts/optimize-images.mjs` pre-builds resized WebP
 *   copies and `image-loader.ts` points next/image's srcset at them (widths below).
 * - Redirects live in `public/_redirects` (Netlify reads it from the deploy root).
 * - Content comes from the CMS at build time (src/lib/cms). CMS_BUILD_STAMP makes each build fetch it
 *   afresh: Netlify keeps .next/cache between builds, and a cached response would hide new content.
 *
 * CMS_PREVIEW=1 is the draft-preview server for the CMS visual editor (`npm run preview:cms` locally,
 * `npm run build:preview` + `npm start` on Hostinger): a Node server that renders drafts on every
 * request, locked by src/proxy.ts.
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  output: preview ? undefined : "export",
  // The local preview server (scripts/cms-preview.mjs) builds into its own folder
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // …and hides the dev badge so the editor shows the page exactly as visitors see it
  devIndicators: preview ? false : undefined,
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
