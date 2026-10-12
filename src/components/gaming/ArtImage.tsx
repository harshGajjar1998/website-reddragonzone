import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * A product render placed exactly as in Figma.
 *
 * `box` is the layer's frame (px, relative to the positioned parent). Inside it the
 * image is either fitted (`cover`/`contain`) or, when Figma crops the fill, placed
 * with `crop` – the image rect as percentages of the box (Figma's "w/h/left/top %").
 * `rotate` / `flip` reproduce rotated or mirrored layers; for a 90° rotation give
 * the *unrotated* layer size in `box.w/h` and the visual centre in `box.left/top`
 * via `center: true`.
 */
export type Art = {
  src: string;
  alt?: string;
  /** Intrinsic size (any value with the right ratio works) */
  width: number;
  height: number;
  box: { left?: number; right?: number; top?: number; bottom?: number; w: number; h: number };
  fit?: "cover" | "contain";
  crop?: { w: number; h: number; left: number; top: number };
  rotate?: number;
  flipX?: boolean;
  flipY?: boolean;
  /** Visual (post-rotation) box used for positioning when rotated */
  outer?: { w: number; h: number };
  /** Filter utility, e.g. "drop-bento" */
  shadow?: string;
  /** Solid fill behind the image */
  bg?: string;
  opacity?: number;
  blur?: number;
  sizes?: string;
  preload?: boolean;
};

export default function ArtImage({ art, className = "" }: { art: Art; className?: string }) {
  const { box, outer } = art;
  const transforms = [
    art.rotate ? `rotate(${art.rotate}deg)` : "",
    art.flipX ? "scaleX(-1)" : "",
    art.flipY ? "scaleY(-1)" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const position: CSSProperties = {
    left: box.left,
    right: box.right,
    top: box.top,
    bottom: box.bottom,
    width: outer?.w ?? box.w,
    height: outer?.h ?? box.h,
    opacity: art.opacity,
    filter: art.blur ? `blur(${art.blur}px)` : undefined,
  };

  const image = art.crop ? (
    <Image
      src={art.src}
      alt={art.alt ?? ""}
      width={art.width}
      height={art.height}
      sizes={art.sizes}
      preload={art.preload}
      draggable={false}
      className="absolute max-w-none"
      style={{
        width: `${art.crop.w}%`,
        height: `${art.crop.h}%`,
        left: `${art.crop.left}%`,
        top: `${art.crop.top}%`,
      }}
    />
  ) : (
    <Image
      src={art.src}
      alt={art.alt ?? ""}
      fill
      sizes={art.sizes ?? `${Math.ceil(box.w)}px`}
      preload={art.preload}
      draggable={false}
      className={art.fit === "contain" ? "object-contain" : "object-cover"}
    />
  );

  const inner = (
    <div
      className={`relative flex-none ${art.crop ? "overflow-hidden" : ""} ${art.shadow ?? ""}`}
      style={{ width: box.w, height: box.h, transform: transforms || undefined, background: art.bg }}
    >
      {image}
    </div>
  );

  return (
    <div className={`pointer-events-none absolute flex items-center justify-center ${className}`} style={position}>
      {inner}
    </div>
  );
}
