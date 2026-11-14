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
import { existsSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const preview = process.env.CMS_PREVIEW === "1";
const args = ["build", ...(preview ? ["--webpack"] : [])];
const { status } = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), ...args], { stdio: "inherit" });
if (status !== 0 || preview || !existsSync("out")) process.exit(status ?? 1);

// Same .env files Next reads (.env.local etc.); @next/env comes with next.
createRequire(require.resolve("next"))("@next/env").loadEnvConfig(process.cwd());
const cms = process.env.CMS_API_URL?.replace(/\/$/, "");
try {
  const res = await fetch(`${cms}/api/public/redirects/apache`, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  writeFileSync("out/.htaccess", `${await res.text()}\nErrorDocument 404 /404.html\n`);
  console.log("Wrote out/.htaccess (old-site redirects)");
} catch (e) {
  // Never fail the build over redirects: the site works without them.
  console.warn(`Old-site redirects skipped: ${e instanceof Error ? e.message : e}`);
}
