import type { Art } from "@/components/gaming/ArtImage";
import type { LatestStage } from "@/components/gaming/LatestGearSection";
import type { FeaturedCard, GamingCategory, GamingProduct, LatestItem } from "@/data/gaming";

/* ==================================================================
   Office range types (Figma file "Untitled": Office landing page,
   Mice PAGE, Product page, SPECIAL PAGE). Same page templates as the
   gaming range; content comes from the CMS (src/lib/cms).
   ================================================================== */

const IMG = "/images/office";

/** Hero slide on a category page (Figma "Frame 4" – product spotlight) */
export type Spotlight = {
  series: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  art: Art;
};

export type OfficeCategory = GamingCategory & {
  /** Hero carousel; the design shows "01/05" */
  spotlights: Spotlight[];
};

/** "Office Category" bento – one tall tile + two short tiles */
export type OfficeTile = {
  slug: string;
  label: string;
  ghost: string;
  /** Pre-rendered art (render bounds inside the tile) */
  art: { src: string; width: number; height: number; left: number; top: number };
  /** Product art sits above (true) or below (false) the Browse link */
  artOnTop: boolean;
  /** 394×208 mobile tile art (Figma "Office Produce" screen 2), anchored to the tile's right edge */
  mobileArt: Art;
};

/** Stage decoration behind the office "The Latest" carousel (design artwork, not content) */
const L = `${IMG}/latest`;

export const officeLatestStage: LatestStage = {
  back: [
    { src: `${L}/stage-left.png`, left: 115.33, top: 167.69, w: 559, h: 525 },
    { src: `${L}/stage-right.png`, left: 765.81, top: 167.69, w: 559, h: 525 },
    { src: `${L}/frame-left.png`, left: 139.25, top: 198.5, w: 542, h: 463.5 },
    { src: `${L}/frame-right.png`, left: 759.08, top: 198.5, w: 542, h: 463.5 },
  ],
  glow: { src: `${L}/glow.png`, left: 413, top: 123, w: 614, h: 614 },
};

export type OfficeNewsletter = {
  eyebrow: string;
  title: string;
  description: string;
  images: { src: string; alt: string }[];
};

export type OfficeContent = {
  categories: OfficeCategory[];
  products: GamingProduct[];
  /** Page description for search engines */
  description: string;
  tiles: { tall: OfficeTile; short: [OfficeTile, OfficeTile] };
  latest: LatestItem[];
  featuredCards: FeaturedCard[];
  newsletter: OfficeNewsletter;
};
