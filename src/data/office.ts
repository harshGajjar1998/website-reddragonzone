import type { Art } from "@/components/gaming/ArtImage";
import type { LatestStage } from "@/components/gaming/LatestGearSection";
import type { FeaturedCard, FilterGroup, GamingCategory, GamingProduct, LatestItem } from "@/data/gaming";

/* ==================================================================
   Office catalogue (Figma file "Untitled": Office landing page,
   Mice PAGE, Product page, SPECIAL PAGE). Same page templates as the
   gaming range – every /office page is rendered from this data.
   ================================================================== */

const IMG = "/images/office";
const P = `${IMG}/products`;

/* ------------------------------------------------------------------
   Categories
   ------------------------------------------------------------------ */

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

const defaultListingDescription =
  "Explore Red Dragon gaming gear built for performance — from gaming headsets and keyboards to mice, microphones, and more. Find the right gear to level up your gaming setup.";

const connectionFilter: FilterGroup = {
  title: "Connection",
  columns: 2,
  options: ["Wired", "Wireless", "Bluetooth", "2.4GHz", "Wired + Wireless"],
};

const spotlightDescription =
  "A practical and reliable product designed to deliver excellent everyday performance. Made with quality materials and a user-friendly design, it offers convenience, durability, and dependable functionality for daily use.";

/** Raw-render spotlight placement (594px square at 766,47 with the design's soft shadow) */
const spotlightArt = (src: string, alt: string, width: number, height: number): Art => ({
  src,
  alt,
  width,
  height,
  box: { left: 766, top: 47, w: 594, h: 594 },
  fit: "contain",
  shadow: "drop-office-spotlight",
  preload: true,
});

/** The design shows 5 slides ("01/05") but one product – add slides here */
const repeat = <T,>(slide: T, n = 5) => Array.from({ length: n }, () => slide);

function officeCategory(c: {
  slug: string;
  label: string;
  filters: FilterGroup[];
  banner?: string;
  spotlights: Spotlight[];
}): OfficeCategory {
  // Tile art lives in the office category grid; listing/hero data mirrors the gaming shape
  const tileArt = c.spotlights[0].art;
  return {
    range: "office",
    slug: c.slug,
    label: c.label,
    ghost: c.label,
    tileArt,
    hero: { breadcrumb: c.label.toUpperCase(), title: c.label, description: defaultListingDescription, image: tileArt },
    listing: {
      breadcrumb: `Office Products / Office ${c.label}`,
      title: `Office ${c.label}`,
      description: defaultListingDescription,
      banner: c.banner,
    },
    filters: c.filters,
    spotlights: c.spotlights,
  };
}

export const officeCategories: OfficeCategory[] = [
  officeCategory({
    slug: "mice",
    label: "Mice",
    banner: `${IMG}/mice/banner.png`,
    filters: [
      { title: "Sensor Type", options: ["Optical", "Laser"] },
      { title: "DPI", options: ["Up to 5,000 DPI", "5,001–10,000 DPI", "10,001–20,000 DPI"] },
      connectionFilter,
      { title: "Buttons", columns: 2, options: ["3–5 Buttons", "6–8 Buttons", "9–12 Buttons", "13+ Buttons"] },
      { title: "Key Features", collapsed: true, options: ["Ergonomic", "Silent Click", "Rechargeable", "Multi-Device"] },
      { title: "Color", collapsed: true, columns: 2, options: ["Black", "Graphite", "Grey", "White"] },
    ],
    spotlights: repeat({
      series: "BM Series",
      name: "BM-4131",
      tagline: "ULTRA LIGHT. ULTRA FAST. UNSTOPPABLE",
      description: spotlightDescription,
      href: "/office/mice/bm-4131",
      // Pre-rendered with its shadow (render bounds 475,22 · 910×666)
      art: {
        src: `${IMG}/mice/hero-bm-4131.png`,
        alt: "Redragon BM-4131 vertical wireless mouse",
        width: 1820,
        height: 1332,
        box: { left: 475, top: 22, w: 910, h: 666 },
        preload: true,
      },
    }),
  }),
  officeCategory({
    slug: "keyboards",
    label: "Keyboards",
    filters: [
      { title: "Keyboard Type", options: ["Membrane", "Mechanical", "Scissor"] },
      { title: "Layout & Size", columns: 2, options: ["60%", "75%", "TKL (80%)", "96%", "Full-Size"] },
      connectionFilter,
      { title: "Key Features", collapsed: true, options: ["Numpad", "Multimedia Keys", "Quiet Keys"] },
    ],
    spotlights: repeat({
      series: "BK Series",
      name: "BK-7111WG",
      tagline: "TYPE FAST. WORK QUIET. STAY FOCUSED",
      description: spotlightDescription,
      href: "/office/keyboards/bk-7111wg",
      art: spotlightArt(`${P}/bk-7111wg.png`, "Redragon BK-7111WG office keyboard", 4096, 2786),
    }),
  }),
  officeCategory({
    slug: "combo",
    label: "Combo",
    filters: [connectionFilter, { title: "Key Features", collapsed: true, options: ["Numpad", "Silent Click"] }],
    spotlights: repeat({
      series: "BK Series",
      name: "BK-7111WG",
      tagline: "ONE SET. EVERY DESK. ALL DAY",
      description: spotlightDescription,
      href: "/office/combo/bk-7111wg-combo",
      art: spotlightArt(`${P}/bk-7111wg-combo.png`, "Redragon BK-7111WG keyboard and mouse combo", 1600, 1600),
    }),
  }),
];

export const getOfficeCategory = (slug: string) => officeCategories.find((c) => c.slug === slug);

/* ------------------------------------------------------------------
   Products
   ------------------------------------------------------------------ */

const B = `${P}/bm-4131`;
const Q = `${P}/bm4195`;

const details = (name: string) => [
  {
    title: "Specifications",
    body: `Full technical specifications for the ${name} – sensor, DPI levels, connectivity, battery and dimensions.`,
  },
  {
    title: "Materials & Sustainability",
    body: "Durable ABS shell with a soft-touch finish and recyclable packaging.",
  },
  { title: "In the Box", body: `${name}, USB receiver and user manual.` },
  {
    title: "Software and Support",
    body: "Plug-and-play on Windows and macOS. Drivers and manuals are available from the Download page.",
  },
];

/** Card art pre-rendered with the design's shadows – positions are the render bounds inside the card */
const rendered = (src: string, width: number, height: number, left: number, top: number) => ({
  src,
  width,
  height,
  box: { left, top, w: width / 2, h: height / 2 },
});

export const officeProducts: GamingProduct[] = [
  /* ---------------- Mice ---------------- */
  {
    range: "office",
    slug: "bm-4186g",
    category: "mice",
    name: "BM-4186G",
    series: "BM Series",
    keywords: "Mouse",
    tagline: "Wireless Bluetooth mouse with palm cushion for enhanced comfort",
    image: { src: `${P}/bm-4186g.png`, width: 482, height: 320 },
    largeArt: rendered(`${P}/card-bm-4186g.png`, 972, 1090, -8, -6),
    tags: ["Optical", "Up to 5,000 DPI", "Wireless", "2.4GHz", "3–5 Buttons", "Silent Click", "Graphite"],
  },
  {
    range: "office",
    slug: "bm-4131",
    category: "mice",
    name: "BM-4131",
    series: "BM Series",
    keywords: "Mouse",
    tagline: "Vertical wireless mouse for a natural, strain-free grip",
    description: spotlightDescription,
    image: { src: `${P}/bm-4131.png`, width: 1600, height: 1600 },
    largeArt: rendered(`${P}/card-bm-4131.png`, 574, 794, 80, 86),
    tags: ["Optical", "Up to 5,000 DPI", "Wireless", "2.4GHz", "6–8 Buttons", "Ergonomic", "Black"],
    gallery: [
      {
        src: `${B}/gallery-1.png`,
        width: 1920,
        height: 515,
        alt: "BM-4131 with its USB receiver",
        crop: { w: 407.11, h: 100, left: -167.24, top: 0 },
      },
      { src: `${B}/gallery-2.png`, width: 482, height: 320, alt: "BM-4131 rear three-quarter view", bg: "#e9e9e9" },
      { src: `${B}/gallery-3.png`, width: 482, height: 320, alt: "BM-4131 top view", bg: "#e9e9e9" },
      { src: `${B}/gallery-4.png`, width: 482, height: 320, alt: "BM-4131 side buttons", bg: "#e9e9e9" },
      { src: `${B}/gallery-5.png`, width: 1600, height: 1600, alt: "BM-4131 2.4G wireless feature banner" },
      { src: `${B}/gallery-6.png`, width: 1600, height: 1600, alt: "BM-4131 2.4GHz dongle banner" },
    ],
    modules: [{ label: "BM-4131" }, { label: "BM-4235" }],
    colors: [{ name: "Graphite", hex: "#262626" }],
    details: details("BM-4131"),
    keyFeatures: {
      description:
        "Enjoy a simple, reliable design with essential features for comfortable everyday use. Built for convenience, durability, and smooth performance.",
      hero: { src: `${B}/feature-hero.png`, width: 1600, height: 1600 },
      items: [
        {
          wide: true,
          image: { src: `${B}/feature-1.png`, width: 2690, height: 1600 },
          title: "Precise control at your fingertips",
          text: "Switch between 800, 1200, 1600, 2400, and 4000 DPI to easily adjust cursor speed for different tasks.",
        },
        {
          image: { src: `${B}/feature-2.png`, width: 888, height: 1024 },
          title: "Natural comfort, less wrist strain",
          text: "The 58° vertical design supports a more natural hand position, helping keep your wrist comfortable during extended use.",
        },
        { image: { src: `${B}/feature-3.png`, width: 1600, height: 1600 } },
      ],
    },
  },
  {
    range: "office",
    slug: "bm-4209",
    category: "mice",
    name: "BM-4209",
    series: "BM Series",
    keywords: "Mouse",
    tagline: "Wired multi-button mouse with adjustable DPI",
    image: { src: `${P}/bm-4209.png`, width: 1600, height: 1600 },
    smallArt: rendered(`${P}/card-bm-4209.png`, 506, 710, 15, 88),
    tags: ["Optical", "5,001–10,000 DPI", "Wired", "9–12 Buttons", "Black"],
  },
  {
    range: "office",
    slug: "bm-4186g-wireless",
    category: "mice",
    name: "WIRELESS MOUSE BM-4186G",
    series: "BM Series",
    keywords: "Mouse",
    tagline: "Compact wireless mouse with silent clicks",
    image: { src: `${P}/bm-4186g-wireless.png`, width: 1600, height: 1600 },
    smallArt: rendered(`${P}/card-bm-4186g-wireless.png`, 506, 710, 28, 88),
    tags: ["Optical", "Up to 5,000 DPI", "Wireless", "2.4GHz", "3–5 Buttons", "Silent Click", "Grey"],
  },
  {
    range: "office",
    slug: "bm-2775",
    category: "mice",
    name: "BM-2775",
    series: "BM Series",
    keywords: "Mouse",
    tagline: "Wired everyday mouse with a comfortable contoured shell",
    image: { src: `${P}/bm-2775.png`, width: 482, height: 320 },
    smallArt: rendered(`${P}/card-bm-2775.png`, 552, 766, 16, 74),
    tags: ["Optical", "Up to 5,000 DPI", "Wired", "6–8 Buttons", "Black"],
  },
  {
    range: "office",
    slug: "bm4195",
    category: "mice",
    name: "BM4195",
    series: "BM Series",
    keywords: "Mouse",
    tagline: "Dual-mode wireless office mouse with 5-level DPI",
    description:
      "The BM4195 is a wireless office mouse that features 2.4GHz and Bluetooth connectivity, 5-level DPI adjustment, multi-device support, and an ergonomic right-handed design. It requires AA batteries for power, making it ideal for comfortable control during work, study, meetings, and everyday computer tasks.",
    image: { src: `${P}/bm4195.png`, width: 482, height: 320 },
    colors: [
      { name: "Graphite", hex: "#676c6e" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    details: details("BM4195"),
    tags: ["Optical", "Up to 5,000 DPI", "Wireless", "Bluetooth", "2.4GHz", "Multi-Device", "Graphite", "Black"],
    featured: {
      // Office featured pages use OfficeSpecHero / OfficeShowcase – see data below
      hero: {
        eyebrow: "",
        title: "",
        description: "",
        model: "BM4195",
        ghostLines: ["BM4195", ""],
        image: { src: `${Q}/hero-main.png`, alt: "Redragon BM4195 wireless mouse" },
        thumbnails: [
          { src: `${Q}/thumb-1.png`, alt: "BM4195 side view" },
          { src: `${Q}/thumb-2.png`, alt: "BM4195 top view" },
          { src: `${Q}/thumb-3.png`, alt: "BM4195 with receiver" },
        ],
      },
      showcase: {
        title: ["Designed for Everyday Work", "Built for Comfortable Control"],
        description:
          "The BM4195 offers flexible wireless connectivity, precise cursor control, and ergonomic comfort for office tasks, online meetings, studying, and everyday browsing in a sleek design.",
        banners: { top: `${Q}/banner-top.png`, bottom: `${Q}/banner-bottom.png` },
        cards: [
          {
            title: "MULTI-MODE CONNECTIVITY",
            text: "Connect wirelessly through 2.4GHz or Bluetooth and pair with up to three devices for convenient switching.",
            image: { src: `${Q}/card-1.png`, alt: "", width: 1431, height: 950, box: { left: -30, top: 32, w: 475, h: 475 } },
          },
          {
            title: "5-LEVEL DPI",
            text: "Choose between five DPI levels for precise and comfortable cursor control across different tasks.",
            image: { src: `${Q}/card-2.png`, alt: "", width: 1835, height: 1218, box: { left: -45, top: 53, w: 609, h: 609 } },
          },
          {
            title: "Over 12 Month Battery Life",
            text: "Note: Please be aware that the AA battery in not include",
            image: { src: `${Q}/card-3.png`, alt: "", width: 1024, height: 1024, box: { left: -25, top: -9, w: 466, h: 466 } },
          },
        ],
      },
    },
  },
  {
    range: "office",
    slug: "bm-2659",
    category: "mice",
    name: "BM-2659",
    series: "BM Series",
    keywords: "Mouse",
    tagline: "Wireless Bluetooth mouse with palm cushion for enhanced comfort",
    image: { src: `${P}/bm-2659.png`, width: 482, height: 320 },
    tags: ["Optical", "Up to 5,000 DPI", "Bluetooth", "Wireless", "3–5 Buttons", "Black"],
  },

  /* ---------------- Keyboards ---------------- */
  {
    range: "office",
    slug: "bk-7111wg",
    category: "keyboards",
    name: "BK-7111WG",
    series: "BK Series",
    keywords: "Keyboard",
    tagline: "Type fast with a sleek wireless keyboard!",
    image: { src: `${P}/bk-7111wg.png`, width: 4096, height: 2786 },
    tags: ["Membrane", "Full-Size", "Wireless", "2.4GHz", "Numpad"],
  },

  /* ---------------- Combo ---------------- */
  {
    range: "office",
    slug: "bk-7111wg-combo",
    category: "combo",
    name: "BK-7111WG",
    series: "BK Series",
    keywords: "Combo",
    tagline: "Type fast with a sleek wireless keyboard!",
    image: { src: `${P}/bk-7111wg-combo.png`, width: 1600, height: 1600 },
    tags: ["Wireless", "2.4GHz", "Numpad"],
  },
];

export const getOfficeProduct = (category: string, slug: string) =>
  officeProducts.find((p) => p.category === category && p.slug === slug);

export const officeProductsInCategory = (category: string) =>
  officeProducts.filter((p) => p.category === category);

/* ------------------------------------------------------------------
   Office landing page
   ------------------------------------------------------------------ */

/** "Office Category" bento – one tall tile + two short tiles */
export type OfficeTile = {
  slug: string;
  label: string;
  ghost: string;
  /** Pre-rendered art (render bounds inside the tile) */
  art: { src: string; width: number; height: number; left: number; top: number };
  /** Product art sits above (true) or below (false) the Browse link */
  artOnTop: boolean;
};

export const officeTiles: { tall: OfficeTile; short: [OfficeTile, OfficeTile] } = {
  tall: {
    slug: "mice",
    label: "Mice",
    ghost: "Mice",
    art: { src: `${IMG}/categories/mice.png`, width: 1146, height: 1024, left: 59, top: 0 },
    artOnTop: false,
  },
  short: [
    {
      slug: "keyboards",
      label: "Keyboards",
      ghost: "Keyboards",
      art: { src: `${IMG}/categories/keyboards.png`, width: 1133, height: 496, left: 66, top: 0 },
      artOnTop: true,
    },
    {
      slug: "combo",
      label: "Combo",
      ghost: "Combo",
      art: { src: `${IMG}/categories/combo.png`, width: 1200, height: 464, left: 32, top: 16 },
      artOnTop: false,
    },
  ],
};

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


export const officeLatestItems: LatestItem[] = [
  {
    name: "NUBULA  K769OFL-M ",
    href: "/office/mice/bm-4131",
    centerBounds: { l: 0.463, t: 0.143, r: 0.935, b: 0.724 },
    center: {
      src: `${L}/mouse-center.png`,
      alt: "Redragon BM-4131 vertical mouse",
      width: 1176,
      height: 1292,
      box: { left: 310, top: 154, w: 588, h: 646 },
    },
    side: { src: `${P}/bm-4131.png`, width: 1600, height: 1600, box: { left: 335, top: 333, w: 231, h: 194 }, fit: "contain" },
  },
  {
    name: "BK-7111WG",
    href: "/office/combo/bk-7111wg-combo",
    centerBounds: { l: 0.026, t: 0.319, r: 0.96, b: 0.701 },
    center: {
      src: `${P}/combo-k-alt.png`,
      alt: "Redragon keyboard and mouse combo",
      width: 1600,
      height: 1600,
      // Sized to match the centre mouse: product ~560px wide (same visual weight as the gaming centre items), centred on the stage (720, 434)
      box: { left: 424, top: 128, w: 600, h: 600 },
      fit: "contain",
      shadow: "drop-latest",
    },
    side: { src: `${P}/combo-k-alt.png`, width: 1600, height: 1600, box: { left: 874, top: 333, w: 231, h: 194 }, fit: "contain" },
    slots: {
      right: { src: `${L}/combo-side.png`, alt: "", width: 660, height: 410, box: { left: 830, top: 360, w: 330, h: 205 } },
    },
  },
  {
    name: "BK-7111WG",
    href: "/office/keyboards/bk-7111wg",
    centerBounds: { l: 0.075, t: 0.275, r: 0.921, b: 0.725 },
    center: {
      src: `${P}/bk-7111wg-alt.png`,
      alt: "Redragon BK-7111WG keyboard",
      width: 482,
      height: 320,
      // Sized to match the centre mouse: product ~600px wide (same visual weight as the gaming centre items), centred on the stage (720, 434)
      box: { left: 367, top: 198.5, w: 709, h: 471 },
      fit: "contain",
      shadow: "drop-latest",
    },
    side: { src: `${P}/bk-7111wg-alt.png`, width: 482, height: 320, box: { left: 335, top: 333, w: 231, h: 194 }, fit: "contain" },
    slots: {
      left: { src: `${L}/keyboard-side.png`, alt: "", width: 666, height: 384, box: { left: 213, top: 367, w: 333, h: 192 } },
    },
  },
];

export const officeFeaturedCards: FeaturedCard[] = [
  {
    product: { range: "office", category: "mice", slug: "bm-2659" },
    name: "BM-2659",
    label: "Mouse",
    description: "Wireless Bluetooth mouse with palm cushion for enhanced comfort",
    art: [{ src: `${IMG}/featured/bm-2659.png`, alt: "BM-2659 wireless mouse", width: 832, height: 640, box: { left: 0, top: 56, w: 416, h: 320 } }],
  },
  {
    product: { range: "office", category: "keyboards", slug: "bk-7111wg" },
    name: "BK-7111WG",
    label: "Keyboard",
    description: "Type fast with a sleek wireless keyboard!",
    art: [{ src: `${IMG}/featured/bk-7111wg.png`, alt: "BK-7111WG keyboard", width: 832, height: 640, box: { left: 0, top: 56, w: 416, h: 320 } }],
  },
  {
    product: { range: "office", category: "combo", slug: "bk-7111wg-combo" },
    name: "BK-7111WG",
    label: "Combo",
    description: "Type fast with a sleek wireless keyboard!",
    art: [
      {
        src: `${IMG}/featured/bk-7111wg-combo.png`,
        alt: "BK-7111WG keyboard and mouse combo",
        width: 832,
        height: 640,
        box: { left: 0, top: 56, w: 416, h: 320 },
      },
    ],
  },
];

export const officeNewsletter = {
  eyebrow: "Office Peripherals",
  title: "Premium Office Accessories",
  description:
    "Upgrade your workspace with premium office peripherals — wireless mice, ergonomic keyboards, and combo sets designed for all-day productivity and comfort.",
  images: [
    { src: `${IMG}/newsletter/1.png`, alt: "White wireless mouse on a minimal desk" },
    { src: `${IMG}/newsletter/2.png`, alt: "Compact keyboard on a wooden desk" },
    { src: `${IMG}/newsletter/3.png`, alt: "Office keyboard and mouse set-up" },
  ],
};
