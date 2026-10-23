import type { Art } from "@/components/gaming/ArtImage";
import type { ProductRange } from "@/lib/useProductRange";

export type { ProductRange };

/** Display name + URL root of each product range */
export const RANGES: Record<ProductRange, { label: string; base: string }> = {
  gaming: { label: "Gaming", base: "/gaming" },
  office: { label: "Office", base: "/office" },
};

/* ==================================================================
   Catalogue types (Figma file "Untitled": Gaming Landing page,
   kEYBOARD PAGE, KEWBOARD DETAIL PAGE, SPECIAL PAGE). Categories and
   products come from the CMS (src/lib/cms) – add one there and its
   listing / detail page exists on the next build. The office range
   uses the same shapes (src/data/office.ts).
   ================================================================== */

/* ------------------------------------------------------------------
   Categories
   ------------------------------------------------------------------ */

export type FilterGroup = {
  title: string;
  options: string[];
  /** Render options in two columns (Layout & Size, Connectivity …) */
  columns?: 1 | 2;
  /** Starts collapsed (Key Features in the design) */
  collapsed?: boolean;
};

export type GamingCategory = {
  /** CMS entry id (used by the CMS visual editor's preview) */
  cmsId?: number;
  /** Defaults to "gaming" */
  range?: ProductRange;
  slug: string;
  /** Nav / tile label */
  label: string;
  /** Tile label when it wraps onto two lines */
  labelLines?: [string, string];
  /** Oversized grey word behind the tile label */
  ghost: string;
  /** Product render on the "Gaming Category" slider tile (720×308) */
  tileArt: Art;
  /** Tile label top – the design nudges a few */
  tileLabelTop?: number;
  /** Render on the 390×152 mobile tile (Figma "Game Product" screen 2); a generic placement is used when absent */
  mobileTileArt?: Art;

  /* Category landing page */
  hero: {
    breadcrumb: string;
    title: string;
    description: string;
    image: Art;
  };
  listing: {
    breadcrumb: string;
    title: string;
    description: string;
    /** 956×439 banner above the product grid (page 1 only) */
    banner?: string;
  };
  filters: FilterGroup[];
};

/** Placement of a render inside a card; may swap in a card-specific (e.g. pre-rendered) image */
export type ArtSpec = Omit<Art, "src" | "width" | "height" | "alt"> & Partial<Pick<Art, "src" | "width" | "height">>;

export type GalleryImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  bg?: string;
  /** Figma fill crop inside the 337×368 cell (defaults to cover) */
  crop?: Art["crop"];
};

export type ProductFeature = {
  image: { src: string; width: number; height: number; bg?: string };
  title?: string;
  text?: string;
  /** 740px wide card (else 524px) */
  wide?: boolean;
};

/** Hero of the featured ("special") product page */
export type FeaturedHero = {
  eyebrow: string;
  title: string;
  description: string;
  /** Vertical outlined model name beside the product */
  model: string;
  /** Two-line faint outlined wordmark */
  ghostLines: [string, string];
  image: { src: string; alt: string };
  thumbnails: { src: string; alt: string }[];
};

export type FeaturedDetail = {
  hero: FeaturedHero;
  showcase: {
    title: [string, string];
    description: string;
    /** 1280×600 lead image and 1280×512 closing image */
    banners?: { top?: string; bottom?: string };
    /** Mobile 362×232 banners (Figma "Spice detal" screen 2) */
    mobileBanners?: { top?: string; bottom?: string };
    /** `mobileImage`: 136×144 thumbnail used by the mobile feature rows */
    cards: { title: string; text: string; image: Art; mobileImage?: string }[];
  };
  exploded?: boolean;
  /** Callout labels on the exploded view, in callout order */
  explodedParts?: string[];
  /** Pre-labelled exploded render used on mobile (391×545) */
  mobileExploded?: string;
};

export type GamingProduct = {
  /** CMS entry id (used by the CMS visual editor's preview) */
  cmsId?: number;
  /** Defaults to "gaming" */
  range?: ProductRange;
  slug: string;
  category: string;
  name: string;
  series?: string;
  /** Top-right label on cards */
  keywords: string;
  /** Hover tagline on cards */
  tagline: string;
  description?: string;
  /** Primary render used on cards */
  image: { src: string; width: number; height: number };
  /** Placement inside a 308×384 card (default: 274px square at 17,76) */
  smallArt?: ArtSpec;
  /** Placement inside a 470×416 card (default: 422px square at 24,-3) */
  largeArt?: ArtSpec;
  /** Values matched against the category's filter options */
  tags?: string[];
  gallery?: GalleryImage[];
  modules?: { label: string; href?: string }[];
  colors?: { name: string; hex: string }[];
  details?: { title: string; body: string }[];
  keyFeatures?: {
    description: string;
    hero: { src: string; width: number; height: number; crop?: Art["crop"] };
    items: ProductFeature[];
  };
  /** Featured products get the "special" detail page */
  featured?: FeaturedDetail;
};

export const rangeOf = (x: { range?: ProductRange }) => RANGES[x.range ?? "gaming"];

export const categoryHref = (c: Pick<GamingCategory, "range" | "slug">) => `${rangeOf(c).base}/${c.slug}`;

export const productHref = (p: Pick<GamingProduct, "range" | "category" | "slug">) =>
  `${rangeOf(p).base}/${p.category}/${p.slug}`;

/* ------------------------------------------------------------------
   Landing pages
   ------------------------------------------------------------------ */

export type GamingHeroContent = { title: [string, string]; description: string; image: string };

export type LatestItem = {
  name: string;
  href: string;
  /** Art when the item sits in the centre stage / in a side slot */
  center: Art;
  side: Art;
  /** Exact pre-rendered art for a slot (overrides the generic `side` placement) */
  slots?: { left?: Art; right?: Art };
  /** Visible product inside the centre image (fractions of the image), used to size it in the side slots */
  centerBounds?: { l: number; t: number; r: number; b: number };
};

export type FeaturedCard = {
  product: Pick<GamingProduct, "range" | "category" | "slug">;
  name: string;
  label: string;
  description: string;
  /** Layers inside the 416×432 card */
  art: Art[];
};

/* ------------------------------------------------------------------
   Featured products – mobile grid (Figma "Game Product" screen 4):
   twelve 171×205 cards. `image.box` is relative to the card.
   ------------------------------------------------------------------ */

export type MobileFeaturedCard = {
  name: string;
  description: string;
  href: string;
  image: Art;
};

export type GamingContent = {
  categories: GamingCategory[];
  products: GamingProduct[];
  hero: GamingHeroContent;
  latest: LatestItem[];
  featuredCards: FeaturedCard[];
  featuredGrid: MobileFeaturedCard[];
};
