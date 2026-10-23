/* ==================================================================
   Homepage content types. The content itself comes from the CMS
   (homepage sections, see src/lib/cms) – these are the shapes the
   home components render.
   ================================================================== */

export type Img = { src: string; alt: string };

export type FeaturedProduct = {
  id: string;
  series: string;
  model: string;
  description: string;
  href: string;
  /** Square product render shown in the 623×432 slot (cropped to fill it) */
  image: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Button text */
  cta: string;
  href: string;
  /** Vertical outlined model name beside the product */
  model: string;
  /** Two-line faint outlined wordmark at the bottom-left */
  ghostLines: [string, string];
  image: Img;
  thumbnails: Img[];
};

/** Gaming / Office split ("Section 9") */
export type SplitPanel = { title: string; ghost: string; description: string; href: string; image: Img };
export type HomeSplit = { gaming: SplitPanel; office: SplitPanel };

/** Exploded architectural blueprint – the artwork is fixed, the copy is editable */
export type Blueprint = { eyebrow: string; product: string; parts: string[] };

/** "Choose Your Gears" cards; artwork placement is per slot in ProductCategoriesSection */
export type GearCard = { title: string; ghost: string; href: string; image: Img };
export type HomeGears = { eyebrow: string; title: string; gaming: GearCard[]; office: GearCard[] };

/** Esports community sign-up (shown on most pages) */
export type Community = {
  eyebrow: string;
  title: string;
  body: string;
  button: string;
  images: Img[];
  /** Phone crops of the same photos: the first is also shown large */
  mobileImages: Img[];
};

/**
 * The homepage, top to bottom, as arranged in the CMS visual editor (hidden sections left out).
 * Consecutive hero slides form one carousel. `ids` are the CMS section ids, used by the editor's preview.
 */
export type HomeBlock =
  | { type: "hero"; ids: string[]; slides: HeroSlide[] }
  | { type: "split"; ids: string[]; split: HomeSplit }
  | { type: "blueprint"; ids: string[]; blueprint: Blueprint }
  | { type: "gears"; ids: string[]; gears: HomeGears }
  | { type: "featured"; ids: string[]; products: FeaturedProduct[] }
  | { type: "community"; ids: string[]; community: Community }
  | { type: "text"; ids: string[]; title: string; body: string };

export type HomeContent = {
  blocks: HomeBlock[];
  /** First "Email signup" section – also shown on most other pages (null when there is none) */
  community: Community | null;
};
