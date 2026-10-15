import type { Art } from "@/components/gaming/ArtImage";
import type { ProductRange } from "@/lib/useProductRange";

export type { ProductRange };

/** Display name + URL root of each product range */
export const RANGES: Record<ProductRange, { label: string; base: string }> = {
  gaming: { label: "Gaming", base: "/gaming" },
  office: { label: "Office", base: "/office" },
};

/* ==================================================================
   Gaming catalogue (Figma file "Untitled": Gaming Landing page,
   kEYBOARD PAGE, KEWBOARD DETAIL PAGE, SPECIAL PAGE).
   Every gaming page is rendered from this data – add a category or a
   product here and its listing / detail page exists automatically.
   ================================================================== */

const IMG = "/images/gaming";

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

const tileShadow = "drop-bento";

const defaultListingDescription =
  "Explore Red Dragon gaming gear built for performance — from gaming headsets and keyboards to mice, microphones, and more. Find the right gear to level up your gaming setup.";

const connectivityFilter: FilterGroup = {
  title: "Connectivity",
  columns: 2,
  options: ["Wired", "Wireless", "Bluetooth", "2.4GHz", "Tri-Mode"],
};

/** Category hero render: 564×564, centred at (1078, 444) in the 688px hero */
const heroArt = (src: string, alt: string, width = 1600, height = 1600): Art => ({
  src,
  alt,
  width,
  height,
  box: { left: 796, top: 162, w: 564, h: 564 },
  fit: "contain",
  preload: true,
});

function category(
  c: Omit<GamingCategory, "hero" | "listing" | "filters"> &
    Partial<Pick<GamingCategory, "filters">> & {
      hero?: Partial<GamingCategory["hero"]>;
      listing?: Partial<GamingCategory["listing"]>;
    },
): GamingCategory {
  const label = c.label;
  return {
    ...c,
    hero: {
      breadcrumb: label.toUpperCase(),
      title: label,
      description: defaultListingDescription,
      image: heroArt(c.tileArt.src, label, c.tileArt.width, c.tileArt.height),
      ...c.hero,
    },
    listing: {
      breadcrumb: `Gaming Products / Gaming ${label}`,
      title: `Gaming ${label.toLowerCase()}`,
      description: defaultListingDescription,
      ...c.listing,
    },
    filters: c.filters ?? [connectivityFilter],
  };
}

/** Order = slider order: each slide is [top-left, top-right, bottom-left, bottom-right] */
export const gamingCategories: GamingCategory[] = [
  category({
    slug: "mice",
    label: "Mice",
    ghost: "MICE",
    tileArt: {
      src: `${IMG}/categories/mice.png`,
      alt: "Redragon gaming mouse",
      width: 1600,
      height: 1600,
      box: { left: 403, top: -23, w: 451, h: 451 },
      shadow: tileShadow,
    },
    mobileTileArt: {
      src: `${IMG}/categories/mice.png`,
      alt: "Redragon gaming mouse",
      width: 1600,
      height: 1600,
      box: { left: 188, top: 0, w: 274, h: 274 },
    },
  }),
  category({
    slug: "headsets",
    label: "Headsets",
    ghost: "HEADSETS",
    tileArt: {
      src: `${IMG}/categories/headsets.png`,
      alt: "Redragon gaming headset",
      width: 1600,
      height: 1600,
      box: { left: 352, top: 0, w: 380, h: 380 },
      shadow: tileShadow,
    },
    mobileTileArt: {
      src: "/images/home/headset-h894.png",
      alt: "Redragon gaming headset",
      width: 1600,
      height: 1600,
      box: { left: 208, top: -18, w: 170, h: 170 },
    },
  }),
  category({
    slug: "keyboards",
    label: "Keyboards",
    ghost: "KEYBOARD",
    tileArt: {
      src: `${IMG}/categories/keyboards.png`,
      alt: "Redragon mechanical keyboard",
      width: 1600,
      height: 1600,
      // Layer is 541×194 rotated 90° (visual box 194×541)
      box: { left: 474, top: -9, w: 541, h: 194 },
      outer: { w: 194, h: 541 },
      rotate: 90,
      crop: { w: 100, h: 278.26, left: 0, top: -77.91 },
      shadow: tileShadow,
    },
    mobileTileArt: {
      src: `${IMG}/categories/keyboards.png`,
      alt: "Redragon mechanical keyboard",
      width: 1600,
      height: 1600,
      box: { left: 236, top: 0, w: 345, h: 124 },
      outer: { w: 124, h: 345 },
      rotate: 90,
      crop: { w: 100, h: 278.26, left: 0, top: -77.91 },
    },
    hero: {
      breadcrumb: "MECHANICAL KEYBOARDS",
      title: "Keyboards",
      description:
        // Line break as set in the design
        "Redragon keyboards transform gameplay. Tactile mechanics or hybrid designs—all deliver speed, precision,\nand your perfect feel. Customize your command zone. Conquer battlegrounds.",
      image: heroArt(`${IMG}/keyboards/hero-keyboard.png`, "Redragon mechanical keyboard"),
    },
    listing: { banner: `${IMG}/keyboards/banner.png` },
    filters: [
      { title: "Keyboards Type", options: ["Magnetic Switch", "Mechanical", "Membrane"] },
      { title: "Layout & Size", columns: 2, options: ["60%", "65%", "75%", "TKL (80%)", "96%", "Full-Size"] },
      connectivityFilter,
      { title: "Switch type", columns: 2, options: ["Red", "Blue", "Brown"] },
      { title: "Key Features", collapsed: true, options: ["Hot-swappable", "RGB Backlight", "Knob Control", "LCD Display"] },
    ],
  }),
  category({
    slug: "gamepads",
    label: "Gamepads",
    ghost: "GAMEPADS",
    tileArt: {
      src: `${IMG}/categories/gamepads.png`,
      alt: "Redragon wireless gamepad",
      width: 3000,
      height: 2081,
      box: { right: -250, top: -48, w: 674, h: 467 },
      shadow: tileShadow,
    },
    mobileTileArt: {
      src: "/images/home/gamepad-ig09.png",
      alt: "Redragon wireless gamepad",
      width: 3000,
      height: 2081,
      box: { left: 136, top: -31, w: 365, h: 253 },
    },
  }),
  category({
    slug: "combo",
    label: "Combo",
    ghost: "Combo",
    tileArt: {
      src: `${IMG}/categories/combo.png`,
      alt: "Redragon mouse and headset combo",
      width: 482,
      height: 320,
      box: { left: 293, top: -59, w: 462, h: 462 },
      shadow: tileShadow,
    },
  }),
  category({
    slug: "speakers",
    label: "Speakers",
    ghost: "Speakers",
    tileArt: {
      src: `${IMG}/categories/speakers.png`,
      alt: "Redragon RGB speakers",
      width: 1600,
      height: 1600,
      box: { left: 369, top: -19, w: 380, h: 380 },
      shadow: tileShadow,
    },
  }),
  category({
    slug: "content-creation",
    label: "Content Creation",
    ghost: "Content Creation",
    tileLabelTop: 118,
    tileArt: {
      src: `${IMG}/categories/content-creation.png`,
      alt: "Redragon streaming webcam",
      width: 1500,
      height: 1500,
      box: { left: 365, top: -64, w: 391, h: 467 },
      fit: "contain",
      shadow: tileShadow,
    },
  }),
  category({
    slug: "gamer-room",
    label: "Gamer Room",
    ghost: "Gamer Room",
    tileArt: {
      src: `${IMG}/categories/gamer-room.png`,
      alt: "Redragon racing cockpit gaming chair",
      width: 482,
      height: 320,
      box: { right: -80, top: -28, w: 557, h: 387 },
      flipX: true,
      shadow: tileShadow,
    },
  }),
  category({
    slug: "laptop-accessories",
    label: "Laptop Accessories",
    labelLines: ["Laptop", "Accessories"],
    ghost: "Laptop Accessories",
    tileLabelTop: 107,
    tileArt: {
      src: `${IMG}/categories/laptop-accessories.png`,
      alt: "Redragon laptop backpack",
      width: 482,
      height: 320,
      box: { left: 413, top: -31, w: 413, h: 413 },
      shadow: tileShadow,
    },
  }),
  category({
    slug: "mice-pads",
    label: "Mice pads",
    ghost: "Mice pads",
    tileArt: {
      src: `${IMG}/categories/mice-pads.png`,
      alt: "Redragon gaming mouse pad",
      width: 1500,
      height: 1500,
      box: { left: 327, top: -33, w: 380, h: 380 },
      shadow: tileShadow,
    },
  }),
  category({
    slug: "pc-components",
    label: "PC Components",
    ghost: "PC Components",
    tileLabelTop: 118,
    tileArt: {
      src: `${IMG}/categories/pc-components.png`,
      alt: "Redragon PC case",
      width: 3840,
      height: 2880,
      box: { left: 421, top: -59, w: 351, h: 419 },
      fit: "contain",
      shadow: tileShadow,
    },
  }),
  category({
    slug: "diy-accessories",
    label: "DIY Accessories",
    ghost: "DIY Accessories",
    tileArt: {
      src: `${IMG}/categories/diy-accessories.png`,
      alt: "Redragon RGB extension cable",
      width: 2000,
      height: 2000,
      box: { right: -44, top: -3, w: 485, h: 336 },
      flipX: true,
      shadow: tileShadow,
    },
  }),
];

export const getCategory = (slug: string) => gamingCategories.find((c) => c.slug === slug);

/* ------------------------------------------------------------------
   Products
   ------------------------------------------------------------------ */

/** Placement of a render inside a card; may swap in a card-specific (e.g. pre-rendered) image */
type ArtSpec = Omit<Art, "src" | "width" | "height" | "alt"> & Partial<Pick<Art, "src" | "width" | "height">>;

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
  /** Pre-labelled exploded render used on mobile (391×545) */
  mobileExploded?: string;
};

export type GamingProduct = {
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

const defaultDetails = (name: string) => [
  {
    title: "Specifications",
    body: `Full technical specifications for the ${name} – switch type, polling rate, connectivity and dimensions.`,
  },
  {
    title: "Materials & Sustainability",
    body: "Built from durable ABS and aluminium components with recyclable packaging.",
  },
  { title: "In the Box", body: `${name}, USB Type-C cable, keycap puller and user manual.` },
  {
    title: "Software and Support",
    body: "Download the Redragon driver to remap keys, record macros and customise lighting. Support is available from the Download page.",
  },
];

const m997Description =
  "The PRISM PRO M997-PRO-1K is designed for competitive gaming. Its lightweight, ergonomic shape ensures comfort and control. The honeycomb shell enhances reliability for every click.";

const P = `${IMG}/products`;
const RIO = `${P}/rio-k771bgp`;
const M997 = `${P}/prism-pro-m997`;

export const gamingProducts: GamingProduct[] = [
  /* ---------------- Keyboards ---------------- */
  {
    slug: "k681mg-rgb-pro",
    category: "keyboards",
    name: "K681MG-RGB-PRO",
    keywords: "Keywords",
    tagline: "WIRELESS 75%PARIS MECHANICAL KEYBOARD",
    image: { src: `${P}/k681mg-rgb-pro.png`, width: 482, height: 320 },
    largeArt: { box: { left: 27, top: 0, w: 416, h: 416 }, fit: "cover", shadow: "drop-product" },
    smallArt: { box: { left: 17, top: 122, w: 274, h: 182 }, fit: "cover" },
    tags: ["Mechanical", "75%", "Wireless", "Tri-Mode", "Red", "Hot-swappable"],
  },
  {
    slug: "k526wb-pro",
    category: "keyboards",
    name: "RM104 PRO VOLCANO K526WB-PRO",
    series: "RM104 PRO",
    keywords: "Keywords",
    tagline: "3 Modes 104 Keys Membrane Gaming Keyboard with display & knob",
    image: { src: `${P}/k526wb-pro.png`, width: 1600, height: 1600 },
    largeArt: {
      box: { left: 24, top: 142, w: 422, h: 132 },
      crop: { w: 100, h: 320, left: 0, top: -82.31 },
    },
    tags: ["Membrane", "Full-Size", "Tri-Mode", "Knob Control", "LCD Display", "RGB Backlight"],
  },
  {
    slug: "k768vi-pro",
    category: "keyboards",
    name: "EISA 100 PRO K768VI-PRO",
    series: "EISA Series",
    keywords: "Keywords",
    tagline: "Tri-mode 100 Keys GASKET Mounted Hot-swappable mechanical Keyboard with knob control & LCD display",
    image: { src: `${P}/k768vi-pro.png`, width: 1600, height: 1600 },
    smallArt: { box: { left: 17, top: 122, w: 274, h: 182 }, fit: "cover" },
    tags: ["Mechanical", "96%", "Tri-Mode", "Brown", "Hot-swappable", "Knob Control", "LCD Display"],
  },
  {
    slug: "k668wbo-wl",
    category: "keyboards",
    name: "TRUNDLE K668WBO-WL",
    series: "TRUNDLE Series",
    keywords: "Keywords",
    tagline: "Tri-Mode Wireless Hot-swappable Mechanical Keyboard",
    image: { src: `${P}/k668wbo-wl.png`, width: 1600, height: 1600 },
    smallArt: {
      box: { left: 17, top: 122, w: 274, h: 182 },
      crop: { w: 103.65, h: 156.04, left: -1.82, top: -28.02 },
    },
    tags: ["Mechanical", "Full-Size", "Wireless", "Tri-Mode", "Red", "Hot-swappable"],
  },
  {
    slug: "k769bam-m",
    category: "keyboards",
    name: "NUBULA K769BAM-M",
    series: "NUBULA Series",
    keywords: "Keywords",
    tagline: "Wired 8K report rate HE magnetic switch aluminum keyboard",
    image: { src: `${P}/k769bam-m.png`, width: 1600, height: 1600 },
    smallArt: {
      box: { left: 17, top: 154, w: 274, h: 89 },
      crop: { w: 100, h: 307.87, left: 0, top: -85.39 },
    },
    tags: ["Magnetic Switch", "65%", "Wired", "RGB Backlight"],
  },
  {
    slug: "rio-k771bgp",
    category: "keyboards",
    name: "RIO K771BGP",
    series: "RIO Series",
    keywords: "Keywords",
    tagline: "Wired gasket-mounted hot-swappable mechanical keyboard",
    description:
      "A feature-rich wired mechanical keyboard designed for a smooth and customizable typing experience. It combines a gasket-mounted structure, hot-swappable switches, customizable software, and dedicated multimedia keys.",
    image: { src: `${RIO}/gallery-2.png`, width: 482, height: 320 },
    tags: ["Mechanical", "Full-Size", "Wired", "Red", "Hot-swappable", "RGB Backlight"],
    // Row by row: [left, right] × 3
    gallery: [
      { src: `${RIO}/gallery-1.png`, width: 1920, height: 603, alt: "RIO K771BGP on a dark surface" },
      { src: `${RIO}/gallery-4.png`, width: 482, height: 320, alt: "RIO K771BGP angled view", bg: "#f6f6f6" },
      {
        src: `${RIO}/gallery-2.png`,
        width: 482,
        height: 320,
        alt: "RIO K771BGP front view",
        bg: "#f6f6f6",
        crop: { w: 146.29, h: 88.94, left: -23.14, top: 5.53 },
      },
      {
        src: `${RIO}/gallery-5.png`,
        width: 482,
        height: 320,
        alt: "RIO K771BGP perspective view",
        bg: "#f6f6f6",
        crop: { w: 139.45, h: 84.78, left: -19.73, top: 7.61 },
      },
      { src: `${RIO}/gallery-3.png`, width: 1600, height: 1600, alt: "BM-4131 2.4G wireless mouse feature banner" },
      { src: `${RIO}/gallery-6.png`, width: 1600, height: 1600, alt: "2.4GHz dongle connectivity banner" },
    ],
    modules: [{ label: "RIO K771BGP" }, { label: "RIO WIRELESS K771WBN-WL" }],
    colors: [{ name: "Graphite", hex: "#1a1a1a" }],
    details: defaultDetails("RIO K771BGP"),
    keyFeatures: {
      description:
        "Enjoy a simple, reliable design with essential features for comfortable everyday use. Built for convenience, durability, and smooth performance.",
      hero: {
        src: `${RIO}/feature-hero.png`,
        width: 2048,
        height: 2048,
        crop: { w: 100, h: 172.04, left: 0.02, top: -52.05 },
      },
      items: [
        {
          wide: true,
          image: { src: `${RIO}/feature-1.png`, width: 1600, height: 1600 },
          title: "Easy switch customization",
          text: "Hot-swappable support lets you replace compatible mechanical switches without soldering, making it easy to customize your typing feel.",
        },
        {
          image: { src: `${RIO}/feature-2.png`, width: 1600, height: 1600, bg: "#282828" },
          title: "Smooth feel with reduced noise",
          text: "The gasket-mounted design provides a softer typing experience while helping absorb vibration and reduce typing noise.",
        },
        { image: { src: `${RIO}/feature-3.png`, width: 1600, height: 1600 } },
      ],
    },
  },
  {
    slug: "k732mc-rgb-pro",
    category: "keyboards",
    name: "URANUS PRO 82 K732MC-RGB-PRO",
    series: "URANUS PRO 82",
    keywords: "Keyboard",
    tagline: "Wireless Bluetooth mouse with palm cushion for enhanced comfort",
    image: { src: `${IMG}/featured/k732.png`, width: 1600, height: 1600 },
    tags: ["Mechanical", "75%", "Tri-Mode", "Blue", "RGB Backlight"],
  },

  /* ---------------- Mice ---------------- */
  {
    slug: "prism-pro-m997",
    category: "mice",
    name: "PRISM PRO M997",
    series: "PRISM PRO",
    keywords: "Mouse",
    tagline: "Lightweight magnesium alloy wireless gaming mouse",
    description: m997Description,
    image: { src: "/images/home/m997-main.png", width: 1600, height: 1600 },
    tags: ["Wireless", "Tri-Mode", "2.4GHz", "Bluetooth"],
    // Mobile special page reuses the product overview (Figma "Spice detal" screen 1)
    gallery: [
      { src: `${M997}/mobile-gallery-1.png`, width: 688, height: 640, alt: "PRISM PRO M997 with its 2.4GHz dongle" },
      { src: "/images/home/m997-main.png", width: 1600, height: 1600, alt: "PRISM PRO M997", bg: "#f6f6f6" },
    ],
    colors: [
      { name: "Graphite", hex: "#676c6e" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    details: defaultDetails("PRISM PRO M997"),
    featured: {
      hero: {
        eyebrow: "Precision Meets Performance",
        title: "LIGHTER. FASTER. READY TO WIN.",
        description: m997Description,
        model: "M997",
        ghostLines: ["PRISM", "PRO M997"],
        image: { src: "/images/home/m997-main.png", alt: "Redragon PRISM PRO M997 gaming mouse" },
        thumbnails: [
          { src: "/images/home/m997-thumb-1.png", alt: "PRISM PRO M997 – side view" },
          { src: "/images/home/m997-thumb-2.png", alt: "PRISM PRO M997 – angled view" },
          { src: "/images/home/m997-thumb-3.png", alt: "PRISM PRO M997 – rear view" },
        ],
      },
      showcase: {
        title: ["Designed for Gamers", "Built for Performance"],
        description:
          "High-performance magnesium alloy construction combined with precision tracking and flexible connectivity.",
        mobileBanners: { top: `${M997}/banner-top.jpg`, bottom: `${M997}/banner-bottom.jpg` },
        cards: [
          {
            title: "MAGNESIUM ALLOY",
            text: "Lightweight. Strong. Premium.",
            mobileImage: `${M997}/card-mouse.png`,
            image: {
              src: "/images/home/m997-thumb-1.png",
              alt: "PRISM PRO M997 magnesium alloy shell",
              width: 1600,
              height: 1600,
              box: { left: -204, top: -17, w: 694, h: 694 },
            },
          },
          {
            title: "55g ±5g",
            text: "Ultra-light body for faster movement.",
            mobileImage: `${M997}/card-mouse.png`,
            image: {
              src: "/images/home/m997-thumb-2.png",
              alt: "PRISM PRO M997 side profile",
              width: 1600,
              height: 1600,
              box: { left: -13, top: 31, w: 442, h: 442 },
            },
          },
          {
            title: "3-MODE CONNECTIVITY",
            text: "2.4GHz Wireless / Bluetooth / USB Type-C",
            mobileImage: `${M997}/card-connectivity.png`,
            image: {
              src: "/images/home/m997-thumb-3.png",
              alt: "PRISM PRO M997 rear view",
              width: 1600,
              height: 1600,
              box: { left: 33, top: 68, w: 350, h: 350 },
            },
          },
        ],
      },
      exploded: true,
      mobileExploded: `${M997}/exploded-mobile.png`,
    },
  },
  {
    slug: "m686-vampire-elite",
    category: "mice",
    name: "M686 Vampire Elite",
    series: "VAMPIRE",
    keywords: "Mouse",
    tagline: "Type fast with a sleek wireless keyboard!",
    image: { src: `${IMG}/featured/m686.png`, width: 844, height: 560 },
    tags: ["Wireless", "2.4GHz"],
  },

  /* ---------------- Combo ---------------- */
  {
    slug: "k552-bb-3",
    category: "combo",
    name: "K552-BB-3",
    keywords: "Combo",
    tagline: "Type fast with a sleek wireless keyboard!",
    image: { src: `${IMG}/featured/k552.png`, width: 1600, height: 1600 },
    tags: ["Wired"],
  },
];

export const getProduct = (category: string, slug: string) =>
  gamingProducts.find((p) => p.category === category && p.slug === slug);

export const productsInCategory = (category: string) =>
  gamingProducts.filter((p) => p.category === category);

export const rangeOf = (x: { range?: ProductRange }) => RANGES[x.range ?? "gaming"];

export const categoryHref = (c: Pick<GamingCategory, "range" | "slug">) => `${rangeOf(c).base}/${c.slug}`;

export const productHref = (p: Pick<GamingProduct, "range" | "category" | "slug">) =>
  `${rangeOf(p).base}/${p.category}/${p.slug}`;

/* ------------------------------------------------------------------
   Gaming landing page
   ------------------------------------------------------------------ */

export const gamingHero = {
  title: ["Gaming", "Products"] as [string, string],
  description:
    "Explore Red Dragon gaming gear built for performance — from gaming headsets and keyboards to mice, microphones, and more. Find the right gear to level up your gaming setup.",
  /** The design shows 5 indicator dots but one backdrop – add slides here */
  images: Array.from({ length: 5 }, () => `${IMG}/hero-setup.png`),
};

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

const latestCenterBox = { left: 566, top: 176, w: 309, h: 514 };
const latestSideBox = (side: "left" | "right") => ({ left: side === "left" ? 335 : 874, top: 333, w: 231, h: 194 });

export const latestItems: LatestItem[] = [
  {
    name: "NUBULA  K769OFL-M",
    href: productHref({ category: "mice", slug: "prism-pro-m997" }),
    // Mouse only – the render also has the dongles to its right, cropped out by the box
    centerBounds: { l: 0.104, t: 0.106, r: 0.513, b: 0.908 },
    center: {
      src: `${IMG}/latest/mouse-m997.png`,
      alt: "Redragon lightweight gaming mouse",
      width: 1600,
      height: 1600,
      box: latestCenterBox,
      crop: { w: 192.57, h: 115.81, left: -7.71, top: -7.9 },
      shadow: "drop-latest",
    },
    side: {
      src: `${IMG}/latest/mouse-m997.png`,
      alt: "",
      width: 1600,
      height: 1600,
      box: latestSideBox("right"),
      fit: "contain",
    },
  },
  {
    name: "Gaming Headset",
    href: "/gaming/headsets",
    centerBounds: { l: 0.079, t: 0.034, r: 0.919, b: 0.941 },
    center: {
      src: `${IMG}/latest/headset.png`,
      alt: "Redragon white gaming headset",
      width: 1600,
      height: 1600,
      // Sized like the centre mouse: product ~420px tall, centred on the stage (720, 434)
      box: { left: 489, top: 208, w: 463, h: 463 },
      fit: "contain",
      shadow: "drop-latest",
    },
    side: {
      src: `${IMG}/latest/headset.png`,
      alt: "",
      width: 1600,
      height: 1600,
      box: latestSideBox("right"),
      crop: { w: 83.98, h: 100, left: 5.64, top: 0 },
    },
  },
  {
    name: "Wireless Gamepad",
    href: "/gaming/gamepads",
    centerBounds: { l: 0.204, t: 0.177, r: 0.774, b: 0.892 },
    center: {
      src: `${IMG}/latest/gamepad.png`,
      alt: "Redragon wireless gamepad",
      width: 1528,
      height: 848,
      // Sized like the centre mouse: product ~430px wide, centred on the stage (720, 434)
      box: { left: 351, top: 211, w: 754, h: 418 },
      fit: "contain",
      shadow: "drop-latest",
    },
    side: {
      src: `${IMG}/latest/gamepad.png`,
      alt: "",
      width: 1528,
      height: 848,
      box: latestSideBox("left"),
      crop: { w: 151.29, h: 100, left: -25.64, top: 0 },
    },
  },
];

export type FeaturedCard = {
  product: Pick<GamingProduct, "range" | "category" | "slug">;
  name: string;
  label: string;
  description: string;
  /** Layers inside the 416×432 card */
  art: Art[];
};

export const featuredCards: FeaturedCard[] = [
  {
    product: { category: "keyboards", slug: "k732mc-rgb-pro" },
    name: "URANUS PRO 82 K732MC-RGB-PRO",
    label: "keyboard",
    description: "Wireless Bluetooth mouse with palm cushion for enhanced comfort",
    art: [
      {
        src: `${IMG}/featured/k732.png`,
        alt: "URANUS PRO 82 K732MC-RGB-PRO keyboard",
        width: 1600,
        height: 1600,
        box: { left: 16, top: 68, w: 384, h: 296 },
        fit: "contain",
      },
    ],
  },
  {
    product: { category: "mice", slug: "m686-vampire-elite" },
    name: "M686 Vampire Elite",
    label: "Mouse",
    description: "Type fast with a sleek wireless keyboard!",
    art: [
      {
        src: `${IMG}/featured/m686-base.png`,
        width: 482,
        height: 320,
        box: { left: 0, top: 56, w: 416, h: 320 },
      },
      {
        src: `${IMG}/featured/m686.png`,
        alt: "M686 Vampire Elite gaming mouse",
        width: 844,
        height: 560,
        box: { left: 0, top: 56, w: 416, h: 320 },
        crop: { w: 242.31, h: 160.87, left: -71.15, top: -30.43 },
      },
    ],
  },
  {
    product: { category: "combo", slug: "k552-bb-3" },
    name: "K552-BB-3",
    label: "Combo",
    description: "Type fast with a sleek wireless keyboard!",
    art: [
      {
        src: `${IMG}/featured/k552.png`,
        alt: "K552-BB-3 keyboard, mouse, headset and pad combo",
        width: 1600,
        height: 1600,
        box: { left: 0, top: 56, w: 416, h: 320 },
      },
    ],
  },
];

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

const M = `${IMG}/featured/mobile`;
const cardBox = (left: number, top: number, size: number) => ({ left, top, w: size, h: size });
const SIM_CROP = { w: 150.6, h: 100, left: -25.31, top: 0 };

export const featuredGrid: MobileFeaturedCard[] = [
  {
    name: "URANUS PRO 82 K732MC-RGB-PRO",
    description: "3 Modes Connection Aluminum Alloy Body Mechanical Keyboard",
    href: productHref({ category: "keyboards", slug: "k732mc-rgb-pro" }),
    image: {
      src: `${IMG}/featured/k732.png`,
      alt: "URANUS PRO 82 K732MC-RGB-PRO keyboard",
      width: 1600,
      height: 1600,
      box: cardBox(10.69, 27.79, 149.63),
    },
  },
  {
    name: "M686 Vampire Elite",
    description: "Wireless Gaming Mouse",
    href: productHref({ category: "mice", slug: "m686-vampire-elite" }),
    image: {
      src: `${IMG}/featured/m686.png`,
      alt: "M686 Vampire Elite gaming mouse",
      width: 844,
      height: 560,
      box: cardBox(10.69, 27.79, 149.63),
      crop: { w: 278.66, h: 185, left: -89.33, top: -42.5 },
    },
  },
  {
    name: "TITAN H894",
    description: "WIRELESS GAMING HEADSET",
    href: "/gaming/headsets",
    image: {
      src: `${M}/titan-h894.png`,
      alt: "TITAN H894 wireless gaming headset",
      width: 482,
      height: 320,
      box: cardBox(10.69, 27.79, 149.63),
      crop: { w: 137.71, h: 91.43, left: -18.86, top: 4.29 },
    },
  },
  {
    name: "K552-BB-3",
    description: "Wired gaming 4 in 1 combo keyboard, mouse, headset, mouse pad",
    href: productHref({ category: "combo", slug: "k552-bb-3" }),
    image: {
      src: `${IMG}/featured/k552.png`,
      alt: "K552-BB-3 gaming combo",
      width: 1600,
      height: 1600,
      box: cardBox(10.69, 11.79, 149.63),
    },
  },
  {
    name: "ANVIL GS520",
    description: "RGB Computer Stereo Desktop Speakers",
    href: "/gaming/speakers",
    image: {
      src: `${M}/anvil-gs520.png`,
      alt: "ANVIL GS520 desktop speakers",
      width: 512,
      height: 512,
      box: cardBox(11, 21, 149.63),
    },
  },
  {
    name: "GW800",
    description: "Built-in Dual Microphone 360-Degree Rotation Webcam",
    href: "/gaming/content-creation",
    image: { src: `${M}/gw800.png`, alt: "GW800 webcam", width: 512, height: 512, box: cardBox(21, 29, 129) },
  },
  {
    name: "RST-09",
    description: "COCKPIT RACING SIMULATOR with Monitor Mount",
    href: "/gaming/gamer-room",
    image: {
      src: "/images/nav/gaming-gamer-room.png",
      alt: "RST-09 racing simulator cockpit",
      width: 482,
      height: 320,
      box: cardBox(19, 27, 134),
      crop: SIM_CROP,
    },
  },
  {
    name: "GB-127",
    description: "Gaming backpack",
    href: "/gaming/laptop-accessories",
    image: {
      src: `${M}/gb-127.png`,
      alt: "GB-127 gaming backpack",
      width: 482,
      height: 320,
      box: cardBox(18, 31, 135),
      crop: SIM_CROP,
    },
  },
  {
    name: "CA-632B",
    description: "Gaming Case",
    href: "/gaming/pc-components",
    image: {
      src: `${M}/ca-632b.png`,
      alt: "CA-632B gaming case",
      width: 482,
      height: 320,
      box: cardBox(11, 28, 149.63),
      crop: { w: 114.05, h: 75.71, left: -7.02, top: 8.72 },
    },
  },
  {
    name: "SLEEVED EXTENSION CABLE",
    description: "COLORFUL MOD 4 IN 1 POWER SUPPLY SLEEVED EXTENSION CABLE COMBO",
    href: "/gaming/diy-accessories",
    image: {
      src: `${M}/sleeved-cable.png`,
      alt: "Sleeved power supply extension cables",
      width: 512,
      height: 512,
      box: cardBox(21, 31, 129),
    },
  },
  {
    name: "PG1M",
    description: "Glass Gaming Mouse Pad",
    href: "/gaming/mice-pads",
    image: {
      src: `${M}/pg1m.png`,
      alt: "PG1M glass gaming mouse pad",
      width: 512,
      height: 512,
      box: cardBox(19, 32, 134),
    },
  },
  {
    name: "BM-2659",
    description: "Wireless LCD display controller",
    href: "/gaming/gamepads",
    image: {
      src: `${M}/bm-2659.png`,
      alt: "Wireless controller with LCD display",
      width: 512,
      height: 288,
      box: cardBox(14, 27, 143),
      crop: { w: 136.69, h: 76.89, left: -24.34, top: 9.18 },
    },
  },
];
