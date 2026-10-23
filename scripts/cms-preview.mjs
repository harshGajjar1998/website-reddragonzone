/**
 * Draft-preview server for the CMS visual editor: `npm run preview:cms` → http://localhost:3002
 *
 * Same site as `npm run dev`, but it renders unpublished drafts (CMS_PREVIEW=1, authenticated with
 * CMS_PREVIEW_KEY from .env.local) and adds the bridge the editor talks to. It builds into its own
 * folder so it can run next to the normal dev server.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const port = process.env.PREVIEW_PORT ?? "3002";

const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", "-p", port], {
  stdio: "inherit",
  env: { ...process.env, CMS_PREVIEW: "1", NEXT_DIST_DIR: ".next-preview" },
});
child.on("exit", (code) => process.exit(code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
