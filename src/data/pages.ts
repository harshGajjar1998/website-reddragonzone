/* ==================================================================
   About, Contact, Where to buy and Support page content
   ================================================================== */

import { gamingProducts, getCategory, type GamingProduct } from "@/data/gaming";
import { getOfficeCategory, officeProducts } from "@/data/office";

const A = "/images/pages/about";
const S = "/images/pages/support";

/* ---------------- About ---------------- */

export type AboutSection = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: { src: string; width: number; height: number; alt: string; h: number };
  mediaLeft?: boolean;
  tinted?: boolean;
};

// API: dynamic data – About Us page sections
export const aboutSections: AboutSection[] = [
  {
    eyebrow: "WHO WE ARE",
    title: "The Dragon Behind the Brand",
    paragraphs: [
      "Welcome to Redragon, a leading manufacturer of high-quality, cost-effective gaming peripherals and accessories. Redragon is a global gaming peripherals brand owned and operated by Eastern Times Technology Co., Ltd, the official brand owner and global IP holder.",
      "Since our inception in 2013, we have been committed to delivering premium headsets, keyboards, mice, combo, and mousepads, providing exceptional value to gamers everywhere. We bridge the gap between high-end hardware performance and consumer accessibility.",
    ],
    image: { src: `${A}/story.jpg`, width: 1152, height: 928, alt: "Redragon mechanical keyboard with red backlight", h: 450 },
  },
  {
    eyebrow: "OUR PHILOSOPHY",
    title: "Quality Meets Affordability",
    paragraphs: [
      "Redragon stands at the forefront of the gaming industry, committed to manufacturing mid to high-end gaming products that epitomize the ideal blend of quality and affordability. Our philosophy centers around offering state-of-the-art gaming peripherals which meet the demanding specifications of the modern gamer, yet are priced within reach.",
      "By focusing on the perfect harmony of cost and performance, we strive to make superior gaming experiences accessible to everyone. No compromises, no excessive markups. Just pure engineered advantage.",
    ],
    image: { src: `${A}/philosophy.jpg`, width: 1152, height: 928, alt: "RGB keycaps close-up", h: 450 },
    mediaLeft: true,
    tinted: true,
  },
  {
    eyebrow: "OUR INSPIRATION",
    title: "The Spirit of the Dragon",
    paragraphs: [
      "The dragon in our brand symbolizes strength, wisdom, and ambition, qualities that resonate deeply with our vision at Redragon. In many cultures, dragons are seen as powerful and majestic creatures, and by adopting this image, we embody these attributes in our brand and products.",
      "The choice of a dragon, particularly in the vibrant hue of red, reflects our dedication to creating gaming peripherals that are not just powerful and innovative but also infused with the spirit of adventure and daring. It is an emblem representing our commitment to elevating gaming experiences, offering products that are as formidable and awe-inspiring as the mythical dragon itself.",
    ],
    image: { src: `${A}/dragon.jpg`, width: 1200, height: 896, alt: "Red dragon esports emblem", h: 420 },
  },
];

// API: dynamic data – About Us values
export const aboutValues = [
  {
    title: "Quality Products",
    text: "Every single switch, encoder, and honeycomb shell undergoes extreme stress-testing to survive pro-level combat scenarios.",
  },
  {
    title: "Competitive Price",
    text: "By maintaining vertical control over our supply lines, we deliver elite gaming performance without the premium  tax.",
  },
  {
    title: "Customer Focus",
    text: "We keep a close connection with community forums, tuning firmware parameters and shapes directly from gamer feedback.",
  },
];

/* ---------------- Contact ---------------- */

// API: dynamic data – contact form enquiry types
export const enquiryTypes = [
  "Product support",
  "Warranty & returns",
  "Where to buy",
  "Partnerships",
  "Press & media",
  "Other",
] as const;

export type EnquiryType = (typeof enquiryTypes)[number];

const enquirySlug = (enquiry: string) => enquiry.toLowerCase().replace(/[^a-z]+/g, "-");

/** Contact page link that pre-selects the enquiry. Header and footer links stay plain so nothing is selected. */
export const contactHref = (enquiry: EnquiryType) => `/contact-us/?enquiry=${enquirySlug(enquiry)}`;

/** Reads the ?enquiry= value back; anything unknown selects nothing. */
export const enquiryFromSlug = (slug: string | null) => enquiryTypes.find((enquiry) => enquirySlug(enquiry) === slug);

// API: dynamic data – FAQs. `topic` drives the Support page filter; these values are placeholders until the real FAQ content lands.
export const faqs = [
  {
    topic: "compatibility",
    q: "What sets Red Dragon Zone apart from other eCommerce platforms for  accessories?",
    a: [
      "Red Dragon Zone is built for gaming accessories only, with curated catalogues, community features and tools made for gear sellers.",
    ],
  },
  {
    topic: "setup",
    q: "Can I use my own domain for my accessories business with Red Dragon Zone?",
    a: [
      "Yes! You can link your domain to Red Dragon Zone, which offers a free plan.",
      "Red Dragon Zone provides each seller a unique rdz.zone domain upon signing up.",
    ],
  },
  {
    topic: "setup",
    q: "Can I sell accessories on Red Dragon Zone without an online store?",
    a: ["Yes. You can list products straight from your Red Dragon Zone dashboard and share them through social channels."],
  },
  {
    topic: "warranty",
    q: "Is there a startup fee for using Red Dragon Zone for my accessories?",
    a: ["No. Creating an account and listing your first products is free."],
  },
  {
    topic: "compatibility",
    q: "In which countries can I operate my accessories business with Red Dragon Zone?",
    a: ["Red Dragon Zone is available worldwide wherever our payment partners operate."],
  },
  {
    topic: "warranty",
    q: "Are there transaction fees or commissions with Red Dragon Zone?",
    a: ["A small transaction fee applies to each completed order; there are no monthly commissions."],
  },
  {
    topic: "firmware",
    q: "Can I customize my Red Dragon Zone store for accessories?",
    a: ["Yes. Themes, colours, banners and product layouts can all be customised from the store editor."],
  },
];

/* ---------------- Where to buy ---------------- */

/** Online shop / marketplace (Figma "Where to buy" → Online Shopping) */
export type OnlineStore = {
  name: string;
  /** Badge text ("Official store" cards get the grey highlight) */
  type: "Official store" | "Online";
  url: string;
  logo: { src: string; width: number; height: number };
};

/** Physical retailer (Figma "Where to buy" → Offline Shopping / "Nearby store") */
export type OfflineStore = {
  name: string;
  type: "Retail Store" | "Authorized Retailer";
  /** Two address lines, as on the card */
  address: [string, string];
  lat: number;
  lng: number;
  image: string;
  /** API: dynamic data – distance from the shopper. Replaced by a live value once "Find stores near me" has the user's location. */
  distanceKm?: number;
};

export type CountryStores = { online: OnlineStore[]; offline: OfflineStore[] };

const redragonLogo = { src: "/images/pages/where-to-buy/redragon-logo.png", width: 1845, height: 1260 };
const amazonLogo = { src: "/images/pages/where-to-buy/amazon-logo.png", width: 934, height: 350 };
const storePhoto = "/images/pages/where-to-buy/store-gamers-hub.png";

// API: dynamic data – Where to Buy store list, keyed by country
export const storesByCountry: Record<string, CountryStores> = {
  India: {
    online: [
      { name: "Red Dragon Flagship", type: "Official store", url: "https://redragon.in", logo: redragonLogo },
      { name: "Amazon India", type: "Online", url: "https://www.amazon.in/s?k=redragon", logo: amazonLogo },
    ],
    offline: [
      {
        name: "Gamer's Hub",
        type: "Retail Store",
        address: ["DLF Mall of India, Sector 18", "Noida, Uttar Pradesh 201301"],
        lat: 28.5672,
        lng: 77.3211,
        image: storePhoto,
        distanceKm: 2.8,
      },
      {
        name: "Tech World",
        type: "Authorized Retailer",
        address: ["Pacific Mall, Tagore Garden", "New Delhi, Delhi 110027"],
        lat: 28.643,
        lng: 77.106,
        image: storePhoto,
        distanceKm: 4.1,
      },
      {
        name: "Digital Zone",
        type: "Retail Store",
        address: ["Select Citywalk Mall, Saket", "New Delhi, Delhi 110017"],
        lat: 28.5286,
        lng: 77.219,
        image: storePhoto,
        distanceKm: 7.6,
      },
    ],
  },
  "United States": {
    online: [
      { name: "Redragon Shop", type: "Official store", url: "https://redragonshop.com", logo: redragonLogo },
      { name: "Amazon US", type: "Online", url: "https://www.amazon.com/s?k=redragon", logo: amazonLogo },
    ],
    offline: [],
  },
  "United Kingdom": {
    online: [{ name: "Amazon UK", type: "Online", url: "https://www.amazon.co.uk/s?k=redragon", logo: amazonLogo }],
    offline: [],
  },
  Germany: {
    online: [{ name: "Amazon DE", type: "Online", url: "https://www.amazon.de/s?k=redragon", logo: amazonLogo }],
    offline: [],
  },
  Indonesia: {
    online: [{ name: "Redragon Indonesia", type: "Official store", url: "https://redragon.co.id", logo: redragonLogo }],
    offline: [],
  },
  Brazil: {
    online: [{ name: "Redragon Brasil", type: "Official store", url: "https://www.redragon.com.br", logo: redragonLogo }],
    offline: [],
  },
};

/** Stores selling a product in a country. */
// API: dynamic data – replace with the per-product store endpoint; the sample data lists every store for every product
export const storesForProduct = (productSlug: string | null, country: string): CountryStores | undefined =>
  storesByCountry[country];

/** Where to Buy page filtered to one product */
export const whereToBuyHref = (product: { slug: string; name: string }) =>
  `/where-to-buy/?product=${encodeURIComponent(product.slug)}&name=${encodeURIComponent(product.name)}`;

// API: dynamic data – countries shown in the selector (ones without stores show "No stores found")
export const storeCountries = [
  "Australia",
  "Brazil",
  "Canada",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Malaysia",
  "Mexico",
  "Netherlands",
  "Philippines",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "Spain",
  "Thailand",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
];

/* ---------------- Support ---------------- */

/** Category tiles (Figma "Desktop - 8" on the Support page). Art is pre-rendered with shadow + 85% opacity. */
export type SupportTile = {
  slug: string;
  label: string;
  /** Two-line label (Content Creation) */
  lines?: [string, string];
  ghost: string;
  width: 464 | 712 | 704;
  art: { src: string; width: number; height: number; left: number; top: number };
  /** Pattern fill is offset off-tile in the design for these (tile reads white) */
  plain?: boolean;
  /** Text inset 88 (left column) or 40 */
  inset: 88 | 40;
};

// API: dynamic data – support centre topics
export const supportTiles: SupportTile[][] = [
  [
    { slug: "mice", label: "Mice", ghost: "MICE", width: 464, inset: 88, art: { src: `${S}/mice.png`, width: 812, height: 500, left: 58, top: 0 } },
    { slug: "keyboards", label: "Keyboards", ghost: "KEYBOARDS", width: 464, inset: 40, plain: true, art: { src: `${S}/keyboards.png`, width: 928, height: 482, left: 0, top: 9 } },
    { slug: "combo", label: "Combo", ghost: "Combo", width: 464, inset: 40, art: { src: `${S}/combo.png`, width: 928, height: 500, left: 0, top: 0 } },
  ],
  [
    { slug: "headsets", label: "Headsets", ghost: "Headsets", width: 464, inset: 88, art: { src: `${S}/headsets.png`, width: 744, height: 500, left: 92, top: 0 } },
    { slug: "speakers", label: "Speakers", ghost: "SPEAKERS", width: 464, inset: 40, plain: true, art: { src: `${S}/speakers.png`, width: 678, height: 500, left: 122, top: 0 } },
    { slug: "content-creation", label: "Content Creation", lines: ["Content", "Creation"], ghost: "Content  Creation", width: 464, inset: 40, art: { src: `${S}/content-creation.png`, width: 774, height: 500, left: 77, top: 0 } },
  ],
  [
    { slug: "pc-components", label: "PC Components", ghost: "PC Components", width: 712, inset: 88, art: { src: `${S}/pc-components.png`, width: 826, height: 500, left: 299, top: 0 } },
    { slug: "gamepads", label: "Gamepads", ghost: "Gamepads", width: 704, inset: 40, art: { src: `${S}/gamepads.png`, width: 822, height: 500, left: 293, top: 0 } },
  ],
];

export type Download = {
  /** Product the card opens in the Firmware & Software Finder (see supportProducts) */
  slug: string;
  name: string;
  category: string;
  keywords: string;
  image: {
    src: string;
    width: number;
    height: number;
    crop?: { w: number; h: number; left: number; top: number };
    box: { top: number; h: number };
    /** Show the whole render instead of filling the box */
    contain?: boolean;
  };
};

const GP = "/images/gaming/products";

const k768 = { src: `${GP}/k768vi-pro.png`, width: 1600, height: 1600, box: { top: 122, h: 182 } };
const k668 = {
  src: `${GP}/k668wbo-wl.png`,
  width: 1600,
  height: 1600,
  box: { top: 122, h: 182 },
  crop: { w: 103.65, h: 156.04, left: -1.82, top: -28.02 },
};
const k769 = {
  src: `${GP}/k769bam-m.png`,
  width: 1600,
  height: 1600,
  box: { top: 154, h: 89 },
  crop: { w: 100, h: 307.87, left: 0, top: -85.39 },
};

// API: dynamic data – support downloads (drivers, manuals)
/** Downloads list – the design repeats these four keyboards; add real entries here */
export const downloads: Download[] = [
  { slug: "k768vi-pro", name: "EISA 100 PRO  K768VI-PRO", category: "keyboards", keywords: "Keywords", image: k768 },
  { slug: "k668wbo-wl", name: "TRUNDLE K668WBO-WL", category: "keyboards", keywords: "Keywords", image: k668 },
  { slug: "k769bam-m", name: "NUBULA  K769BAM-M", category: "keyboards", keywords: "Keywords", image: k769 },
  { slug: "k769bam-m", name: "NUBULA  K769BAM-M", category: "keyboards", keywords: "Keywords", image: k769 },
  { slug: "k768vi-pro", name: "EISA 100 PRO  K768VI-PRO", category: "keyboards", keywords: "Keywords", image: k768 },
  { slug: "k668wbo-wl", name: "TRUNDLE K668WBO-WL", category: "keyboards", keywords: "Keywords", image: k668 },
  { slug: "k769bam-m", name: "NUBULA  K769BAM-M", category: "keyboards", keywords: "Keywords", image: k769 },
  { slug: "k769bam-m", name: "NUBULA  K769BAM-M", category: "keyboards", keywords: "Keywords", image: k769 },
  { slug: "k768vi-pro", name: "EISA 100 PRO  K768VI-PRO", category: "keyboards", keywords: "Keywords", image: k768 },
  { slug: "k668wbo-wl", name: "TRUNDLE K668WBO-WL", category: "keyboards", keywords: "Keywords", image: k668 },
];

/* ---------------- Firmware & Software Finder ---------------- */

export type DownloadOs = "windows" | "mac";
export type DownloadType = "driver" | "firmware" | "software" | "manual";

export type DownloadRelease = {
  version: string;
  date: string;
  os: DownloadOs[];
  /** "What's changed" note */
  notes: string;
  /** File URL for the Download button */
  href: string;
  /** Shown in the product page "Manuals & Software" panel */
  file?: { size: string; format: string };
  /** Figma placeholder: shows the "sample" labels. Leave unset for real releases. */
  sample?: boolean;
};

export type DownloadGroup = {
  type: DownloadType;
  title: string;
  description: string;
  /** Newest first: the first release for the chosen OS is "latest", the rest are "Previous versions" */
  releases: DownloadRelease[];
};

export type SupportProduct = {
  slug: string;
  name: string;
  model: string;
  category: string;
  image: Download["image"];
  /** Empty = the "No downloads available" state */
  downloads: DownloadGroup[];
};

const sample = (
  version: string,
  date: string,
  os: DownloadOs[],
  notes: string,
  file?: DownloadRelease["file"],
): DownloadRelease => ({
  version: `Sample ${version}`,
  date,
  os,
  notes,
  href: "#",
  file,
  sample: true,
});

const OLDER_NOTE = "Earlier example of key-mapping settings.";
const LATEST = "01 Feb 20XX";
const OLDER = "01 Jan 20XX";
const EXE = { size: "12.5 MB", format: "EXE" };
const PDF = { size: "4.8 MB", format: "PDF" };

// API: dynamic data – sample releases from the Figma design, replace with real files
const sampleDownloads: DownloadGroup[] = [
  {
    type: "driver",
    title: "Driver",
    description: "Device connection and recognition",
    releases: [
      sample("v1.0.0", LATEST, ["windows"], "Example update to device recognition and connection stability."),
      sample("v1.0.0", LATEST, ["mac"], "Example update to device recognition and connection stability."),
      sample("v0.9.0", OLDER, ["windows"], OLDER_NOTE),
      sample("v0.9.0", OLDER, ["mac"], OLDER_NOTE),
    ],
  },
  {
    type: "firmware",
    title: "Firmware",
    description: "On-device performance updates",
    releases: [
      sample("v2.0.0", LATEST, ["windows"], "Example update to key response and onboard profile behavior."),
      sample("v1.9.0", OLDER, ["windows"], OLDER_NOTE),
    ],
  },
  {
    type: "software",
    title: "Software",
    description: "Customize your keyboard settings",
    releases: [
      sample("v3.0.0", LATEST, ["windows"], "Example update to lighting controls and custom key mappings.", EXE),
      sample("v3.0.0", LATEST, ["mac"], "Example update to lighting controls and custom key mappings.", EXE),
      sample("v2.9.0", OLDER, ["windows"], OLDER_NOTE),
      sample("v2.9.0", OLDER, ["mac"], OLDER_NOTE),
    ],
  },
  {
    type: "manual",
    title: "Manual",
    description: "Setup and product documentation",
    releases: [
      sample("v1.0.0", LATEST, ["windows", "mac"], "Example revision to setup instructions and shortcut reference.", PDF),
      sample("v0.9.0", OLDER, ["windows", "mac"], OLDER_NOTE),
    ],
  },
];

// API: dynamic data – Finder products. K769BAM-M has no downloads so the empty state can be previewed.
const curatedProducts: SupportProduct[] = [
  { slug: "k768vi-pro", name: "EISA 100 PRO", model: "K768VI-PRO", category: "Keyboards", image: k768, downloads: sampleDownloads },
  { slug: "k668wbo-wl", name: "TRUNDLE", model: "K668WBO-WL", category: "Keyboards", image: k668, downloads: sampleDownloads },
  { slug: "k769bam-m", name: "NUBULA", model: "K769BAM-M", category: "Keyboards", image: k769, downloads: [] },
];

const fromCatalogue = (product: GamingProduct, category = ""): SupportProduct => ({
  slug: product.slug,
  name: product.name,
  model: product.slug.toUpperCase(),
  category,
  image: { ...product.image, box: { top: 0, h: 182 }, contain: true },
  downloads: sampleDownloads,
});

// API: dynamic data – every catalogue product has a Finder entry, so product pages can link straight to it
export const supportProducts: SupportProduct[] = [
  ...curatedProducts,
  ...gamingProducts
    .filter((p) => !curatedProducts.some((c) => c.slug === p.slug))
    .map((p) => fromCatalogue(p, getCategory(p.category)?.label)),
  ...officeProducts.map((p) => fromCatalogue(p, getOfficeCategory(p.category)?.label)),
];

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Matches a search term or card slug to one product. */
// API: dynamic data – replace with the product search endpoint
export function findSupportProduct(query: string): SupportProduct | undefined {
  const term = normalize(query);
  if (!term) return undefined;
  return (
    supportProducts.find((p) => normalize(p.slug) === term) ??
    supportProducts.find((p) => normalize(`${p.slug} ${p.name} ${p.model}`).includes(term))
  );
}

/** Finder URL for a search term or slug; `section` jumps to a download group. */
export const supportSearchHref = (query: string, section?: DownloadType) =>
  `/support/search/?q=${encodeURIComponent(query)}${section ? `#${section}` : ""}`;
