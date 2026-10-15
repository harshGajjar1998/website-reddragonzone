/**
 * Pre-generates resized WebP copies of every raster image for the static export.
 *
 * `output: "export"` has no image server, so `next/image` uses the custom loader in
 * `image-loader.ts`, which points each srcset entry at `/_img/<path>-<width>.webp`.
 * This script writes those files for every width in image-widths.json (never upscaling).
 * Unchanged images are skipped, so re-runs are fast.
 */
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import sharp from "sharp";

const PUBLIC = "public";
const SOURCES = ["images", "brand"];
const OUT = join(PUBLIC, "_img");
const QUALITY = 78;

const widthsConfig = JSON.parse(await readFile("image-widths.json", "utf8"));
const WIDTHS = [...widthsConfig.imageSizes, ...widthsConfig.deviceSizes].sort((a, b) => a - b);
const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (RASTER.has(extname(entry.name).toLowerCase())) yield path;
  }
}

const mtime = (path) => stat(path).then((s) => s.mtimeMs, () => 0);

async function optimize(file) {
  const rel = relative(PUBLIC, file).replace(/\\/g, "/");
  const base = join(OUT, rel.slice(0, -extname(rel).length));
  const sourceTime = await mtime(file);
  const targets = WIDTHS.map((w) => ({ w, path: `${base}-${w}.webp` }));
  const stale = [];
  for (const t of targets) if ((await mtime(t.path)) < sourceTime) stale.push(t);
  if (stale.length === 0) return { file: rel, skipped: true };

  await mkdir(dirname(base), { recursive: true });
  const { width: original = Infinity } = await sharp(file).metadata();
  // Widths at or above the original all get the same full-size encode
  let fullSize;
  for (const t of stale) {
    if (t.w >= original) {
      fullSize ??= await sharp(file).webp({ quality: QUALITY }).toBuffer();
      await writeFile(t.path, fullSize);
    } else {
      await sharp(file).resize({ width: t.w }).webp({ quality: QUALITY }).toFile(t.path);
    }
  }
  return { file: rel, skipped: false };
}

const files = [];
for (const dir of SOURCES) for await (const f of walk(join(PUBLIC, dir))) files.push(f);

const started = Date.now();
let done = 0;
let written = 0;
const queue = [...files];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    for (let f = queue.shift(); f; f = queue.shift()) {
      const r = await optimize(f);
      done++;
      if (!r.skipped) written++;
    }
  }),
);
console.log(
  `optimize-images: ${files.length} images, ${written} (re)generated, ${done - written} up to date – ${((Date.now() - started) / 1000).toFixed(1)}s`,
);
