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
  // 564×564 centred at (1078, 444) in the 688px category hero
  "category.hero": { box: { left: 796, top: 162, w: 564, h: 564 }, fit: "contain", preload: true },
  "category.spotlight": { box: { left: 766, top: 47, w: 594, h: 594 }, fit: "contain", shadow: "drop-office-spotlight", preload: true },
  "showcase.card": { box: { left: 0, top: 40, w: 416, h: 416 }, fit: "contain" },
  featuredGrid: { box: { left: 10.69, top: 27.79, w: 149.63, h: 149.63 }, fit: "contain" },
  officeMobileTile: { box: { right: 0, top: 10, w: 180, h: 180 }, fit: "contain" },
};

/** CMS image + its placement: the designed one for this exact image, else the slot default. */
export function placed(slot: keyof typeof DEFAULTS, src: string, alt: string, dims: (src: string) => Size): Art {
  const designed = layout(slot, src) as Placement | undefined;
  return { src, ...(alt ? { alt } : {}), ...(designed ?? { ...dims(src), ...DEFAULTS[slot]! }) } as Art;
}
