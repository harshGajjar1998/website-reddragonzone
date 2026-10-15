"use client";

/**
 * Static-export image loader: maps a `/images/...` or `/brand/...` raster to the
 * pre-generated WebP of the requested width (see scripts/optimize-images.mjs).
 * SVGs and anything else are served as-is.
 */
const OPTIMIZED = /^\/(images|brand)\/.+\.(png|jpe?g|webp)$/i;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!OPTIMIZED.test(src)) return src;
  return `/_img${src.replace(/\.[^.]+$/, "")}-${width}.webp`;
}
