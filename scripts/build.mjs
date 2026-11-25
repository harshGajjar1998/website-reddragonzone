/**
 * `npm run build`: the static export for Netlify, or – with CMS_PREVIEW=1 – the CMS draft-preview
 * server for Hostinger's Node.js app. That host's Linux is too old for Next's native compiler, so
 * Turbopack can't run there: the preview is built with webpack (WebAssembly compiler) instead.
 *
 * After a static export, writes out/.htaccess with the old-site 301 redirects from the CMS
 * (/api/public/redirects/apache) for Apache / LiteSpeed hosts. Netlify ignores the file; the China
 * nginx server gets the same rules from deploy/china/site-build.sh in the CMS repo.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const preview = process.env.CMS_PREVIEW === "1";

// Same .env files Next reads (.env.local etc.); @next/env comes with next.
createRequire(require.resolve("next"))("@next/env").loadEnvConfig(process.cwd());
const cms = process.env.CMS_API_URL?.replace(/\/$/, "");

/*
 * Static export: fetch the CMS bundle once and let every page read it from disk (CMS_BUNDLE_FILE,
 * see src/lib/cms/api.ts). With 650+ products the bundle is over Next's 2 MB fetch-cache limit,
 * so without this each of the ~700 pages downloads it again, which overloads the CMS and fails the build.
 */
const env = { ...process.env };
if (!preview && cms) {
  const url = `${cms}/api/public/bundle?build=${Date.now()}`;
  let body;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(120_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    body = await res.text();
    JSON.parse(body);
  } catch (e) {
    console.error(`Could not fetch the CMS bundle from ${url}: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
  }
  const file = resolve("node_modules/.cache/redragon/cms-bundle.json");
  mkdirSync(resolve(file, ".."), { recursive: true });
  writeFileSync(file, body);
  env.CMS_BUNDLE_FILE = file;
  console.log(`CMS bundle saved for this build (${(body.length / 1e6).toFixed(1)} MB)`);
}

const args = ["build", ...(preview ? ["--webpack"] : [])];
const { status } = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), ...args], { stdio: "inherit", env });
if (status !== 0 || preview || !existsSync("out")) process.exit(status ?? 1);

try {
  const res = await fetch(`${cms}/api/public/redirects/apache`, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  writeFileSync("out/.htaccess", `${await res.text()}\nErrorDocument 404 /404.html\n`);
  console.log("Wrote out/.htaccess (old-site redirects)");
} catch (e) {
  // Never fail the build over redirects: the site works without them.
  console.warn(`Old-site redirects skipped: ${e instanceof Error ? e.message : e}`);
}
