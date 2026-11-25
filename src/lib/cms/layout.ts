import type { Art } from "@/components/gaming/ArtImage";
import type { ArtSpec, LatestItem } from "@/data/gaming";
import type { MegaMenu, MegaMenuTile } from "@/data/navigation";
import type { Download } from "@/data/pages";
import designLayout from "@/data/design-layout.json";

/* ==================================================================
   Design layout: exact image placement from Figma, kept in code while
   the images themselves come from the CMS. Entries are keyed by image
   path, so a placement only applies while that exact image is in use –
   when an editor swaps an image, the slot's default placement is used.
   Generated from the original data files when content moved to the CMS;
   edit design-layout.json to fine-tune a placement.
   ================================================================== */

type Placement = Omit<Art, "src" | "alt">;
type Size = { width: number; height: number };

type Slots = {
  "category.tile": Placement;
  "category.mobileTile": Placement;
  "category.hero": Placement;
  "category.spotlight": Placement;
  /** keyed by category slug */
  "category.tileLabelTop": number;
  "product.image": Size;
  "product.small": ArtSpec;
  "product.large": ArtSpec;
  "product.gallery": Size & { crop?: Art["crop"] };
  "product.featuresHero": Size & { crop?: Art["crop"] };
  "product.feature": Size;
  "showcase.card": Placement;
  latest: { center: Placement; side: Art; slots?: LatestItem["slots"]; centerBounds?: LatestItem["centerBounds"] };
  /** `content` marks the layer that shows the CMS image */
  featuredCard: { layers: (Art & { content?: boolean })[] };
  featuredGrid: Placement;
  officeTile: Size & { left: number; top: number; artOnTop: boolean };
  officeMobileTile: Placement;
  /** keyed by top-level menu label */
  megaPanel: Omit<MegaMenu, "tiles">;
  megaTile: Pick<MegaMenuTile, "labelX" | "labelY" | "labelAlign" | "labelWidth" | "images"> & { twoLines?: boolean };
  searchProduct: { imageHeight: number };
  about: Size & { h: number };
  supportTile: { width: number; inset: 88 | 40; plain?: boolean; art: Size & { left: number; top: number } };
  /** key "pattern": tiles per row */
  supportRows: number[];
  download: Omit<Download["image"], "src">;
  blog: Size;
};

const registry = designLayout as unknown as { [K in keyof Slots]?: Record<string, Slots[K]> };

export function layout<K extends keyof Slots>(slot: K, key: string): Slots[K] | undefined {
  return registry[slot]?.[key];
}

/** Placement for images that don't have a designed one yet (new or replaced in the CMS). */
const DEFAULTS: Partial<Record<keyof Slots, Omit<Placement, "width" | "height">>> = {
  // 720×308 slider tile, product on the right
  "category.tile": { box: { left: 380, top: -20, w: 400, h: 400 }, fit: "contain", shadow: "drop-bento" },
  "category.mobileTile": { box: { left: 188, top: 0, w: 220, h: 220 }, fit: "contain" },
  // 560×560 inside the category hero frame (see FRAMES)
  "category.hero": { box: { left: 800, top: 64, w: 560, h: 560 }, fit: "contain", preload: true },
  "category.spotlight": { box: { left: 766, top: 47, w: 594, h: 594 }, fit: "contain", shadow: "drop-office-spotlight", preload: true },
  "showcase.card": { box: { left: 0, top: 40, w: 416, h: 416 }, fit: "contain" },
  featuredGrid: { box: { left: 10.69, top: 27.79, w: 149.63, h: 149.63 }, fit: "contain" },
  officeMobileTile: { box: { right: 0, top: 10, w: 180, h: 180 }, fit: "contain" },
};

/* ------------------------------------------------------------------
   Image frames (container rule, site-wide): a section's image lives in a
   fixed, padded frame inside the section and never touches or crosses
   its edges. Any placement (designed or default) is scaled down and
   moved to fit its slot's frame. Coordinates are px in the section.
   Slots without a frame (slider tiles, cards) crop inside their own
   clipped tile by design.
   ------------------------------------------------------------------ */
type Frame = { left: number; top: number; w: number; h: number };

const FRAMES: Partial<Record<keyof Slots, Frame>> = {
  // 1440×688 gaming category hero: right column, 64px top/bottom, 80px right
  "category.hero": { left: 720, top: 64, w: 640, h: 560 },
  // 1440×688 office category spotlight: right of the 556px copy column, 48px top/bottom
  "category.spotlight": { left: 700, top: 48, w: 660, h: 592 },
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** Scale `art` down to fit `frame`, centre it vertically in the frame and keep it inside horizontally. */
export function fitToFrame<T extends Placement>(art: T, frame: Frame): T {
  const { box } = art;
  if (box.left === undefined) return art;
  const ow = art.outer?.w ?? box.w;
  const oh = art.outer?.h ?? box.h;
  const s = Math.min(1, frame.w / ow, frame.h / oh);
  const w = ow * s;
  const h = oh * s;
  const left = clamp(box.left + (ow - w) / 2, frame.left, frame.left + frame.w - w);
  return {
    ...art,
    box: { left, top: frame.top + (frame.h - h) / 2, w: box.w * s, h: box.h * s },
    ...(art.outer ? { outer: { w, h } } : {}),
  };
}

/** CMS image + its placement: the designed one for this exact image, else the slot default – fitted to the slot's frame. */
export function placed(slot: keyof typeof DEFAULTS, src: string, alt: string, dims: (src: string) => Size): Art {
  const designed = layout(slot, src) as Placement | undefined;
  const placement = designed ?? ({ ...dims(src), ...DEFAULTS[slot]! } as Placement);
  const frame = FRAMES[slot];
  return { src, ...(alt ? { alt } : {}), ...(frame ? fitToFrame(placement, frame) : placement) } as Art;
}
