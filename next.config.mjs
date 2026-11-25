// Plain JS (not next.config.ts): the CMS preview is built on Hostinger, whose Linux is too old for
// Next's native compiler, and the WebAssembly fallback can't load a TypeScript config.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const widths = JSON.parse(readFileSync(new URL("./image-widths.json", import.meta.url), "utf8"));
const preview = process.env.CMS_PREVIEW === "1";

/** The website code's git commit (GITHUB_SHA in Actions), or null for Next's random ID outside git */
function gitCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || null;
  } catch {
    return null;
  }
}

/**
 * Static export for Netlify: `next build` writes the whole site to `out/`.
 * - trailingSlash → every route is emitted as `route/index.html`, so refreshing
 *   or deep-linking any page finds a real file (no "Page not found").
 * - There is no image server, so `scripts/optimize-images.mjs` pre-builds resized WebP
 *   copies and `image-loader.ts` points next/image's srcset at them (widths below).
 * - Redirects live in `public/_redirects` (Netlify) and `public/.htaccess` (Hostinger); keep them in step.
 * - Content comes from the CMS at build time (src/lib/cms). CMS_BUILD_STAMP makes each build fetch it
 *   afresh: Netlify keeps .next/cache between builds, and a cached response would hide new content.
 *
 * CMS_PREVIEW=1 is the draft-preview server for the CMS visual editor (`npm run preview:cms` locally,
 * `npm run build` + `npm start` on Hostinger): a Node server that renders drafts on every
 * request, locked by src/proxy.ts.
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  output: preview ? undefined : "export",
  // The local preview server (scripts/cms-preview.mjs) builds into its own folder
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // …and hides the dev badge so the editor shows the page exactly as visitors see it
  devIndicators: preview ? false : undefined,
  env: {
    CMS_BUILD_STAMP: String(Date.now()),
    // The contact and newsletter forms post here from the browser (src/lib/forms.ts)
    CMS_FORMS_URL: `${(process.env.CMS_API_URL ?? "").replace(/\/$/, "")}/api/public/forms`,
  },
  // The same code builds the same build ID, so a CMS publish only changes the pages whose content
  // changed and scripts/deploy-ftp.sh uploads just those. (Default: a new random ID on every build,
  // which changes every page.) A code change gets a new commit, so a new ID.
  generateBuildId: async () => (preview ? null : gitCommit()),
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    imageSizes: widths.imageSizes,
    deviceSizes: widths.deviceSizes,
  },
};

export default nextConfig;
