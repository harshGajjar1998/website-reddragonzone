/**
 * `npm run build`: the static export for Netlify, or – with CMS_PREVIEW=1 – the CMS draft-preview
 * server for Hostinger's Node.js app. That host's Linux is too old for Next's native compiler, so
 * Turbopack can't run there: the preview is built with webpack (WebAssembly compiler) instead.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const args = ["build", ...(process.env.CMS_PREVIEW === "1" ? ["--webpack"] : [])];
const { status } = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), ...args], { stdio: "inherit" });
process.exit(status ?? 1);
