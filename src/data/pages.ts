/* ==================================================================
   About, Contact, Where to buy and Support page content types.
   Content comes from the CMS (Content → About Us, FAQs, Stores,
   Support topics, Downloads, Contact page); see src/lib/cms.
   Sample data below is only for what the CMS can't hold yet
   (offline stores, the Firmware & Software Finder).
   ================================================================== */

import { categoryOf, type Catalogue, type GamingProduct } from "@/data/gaming";

export type AboutSection = {
  /** CMS entry id (used by the CMS visual editor's preview) */
  cmsId?: number;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: { src: string; width: number; height: number; alt: string; h: number };
  mediaLeft?: boolean;
  tinted?: boolean;
};

export type AboutValue = { cmsId?: number; title: string; text: string };

/** `topic` drives the Support page FAQ filter */
export type Faq = { cmsId?: number; topic?: string; q: string; a: string[] };

/* ---------------- Contact ---------------- */

/** Enquiry types come from the CMS Contact page; links use these names to pre-select one. */
export type EnquiryType = string;

const enquirySlug = (enquiry: string) => enquiry.toLowerCase().replace(/[^a-z]+/g, "-");

/** Contact page link that pre-selects the enquiry. Header and footer links stay plain so nothing is selected. */
export const contactHref = (enquiry: EnquiryType) => `/contact-us/?enquiry=${enquirySlug(enquiry)}`;

/** Reads the ?enquiry= value back; anything not in the CMS list selects nothing. */
export const enquiryFromSlug = (slug: string | null, enquiryTypes: string[]) =>
  enquiryTypes.find((enquiry) => enquirySlug(enquiry) === slug);

/* ---------------- Where to buy ---------------- */

/** Online shop / marketplace (Figma "Where to buy" → Online Shopping) */
export type OnlineStore = {
  /** CMS entry id (used by the CMS visual editor's preview) */
  cmsId?: number;
  name: string;
  /** Badge text ("Official store" cards get the grey highlight) */
  type: "Official store" | "Online";
  url: string;
  /** Unset when there's no logo for the shop; the card shows its initials instead */
  logo?: { src: string; width: number; height: number };
  /** Short line about the shop (Where to Buy online card) */
  description?: string;
  /** Product categories it sells, e.g. ["Keyboards", "Mice"] */
  categories?: string[];
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

export const redragonLogo = { src: "/images/pages/where-to-buy/redragon-logo.png", width: 1845, height: 1260 };
export const amazonLogo = { src: "/images/pages/where-to-buy/amazon-logo.png", width: 934, height: 350 };

/** Stores selling a product in a country. */
// API: dynamic data – replace with the per-product store endpoint; for now every store sells every product
export const storesForProduct = (
  storesByCountry: Record<string, CountryStores>,
  productSlug: string | null,
  country: string,
): CountryStores | undefined => storesByCountry[country];

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

/** Category tiles (Figma "Desktop - 8" on the Support page). Art is pre-rendered with shadow + 85% opacity. */
export type SupportTile = {
  /** CMS entry id (used by the CMS visual editor's preview) */
  cmsId?: number;
  slug: string;
  label: string;
  /** Two-line label (Content Creation) */
  lines?: [string, string];
  ghost: string;
  width: number;
  art: { src: string; width: number; height: number; left: number; top: number };
  /** Pattern fill is offset off-tile in the design for these (tile reads white) */
  plain?: boolean;
  /** Text inset 88 (left column) or 40 */
  inset: 88 | 40;
};

export type Download = {
  /** CMS entry id (used by the CMS visual editor's preview) */
  cmsId?: number;
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
  software: string;
  manual: string;
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

/** Finder card placement from the design for these renders; other products use the default box. */
const finderArt: Record<string, SupportProduct["image"]> = { "k768vi-pro": k768, "k668wbo-wl": k668, "k769bam-m": k769 };

const fromCatalogue = (product: GamingProduct, category = ""): SupportProduct => ({
  slug: product.slug,
  name: product.name,
  model: product.slug.toUpperCase(),
  category,
  image: finderArt[product.slug] ?? { ...product.image, box: { top: 0, h: 182 }, contain: true },
  downloads: product.downloads ?? [],
});

/** Every catalogue product (CMS) has a Finder entry, so product pages can link straight to it. Files come from the CMS (Drivers & firmware). */
export const supportProducts = (catalogue: Catalogue): SupportProduct[] =>
  catalogue.products.map((p) => fromCatalogue(p, categoryOf(catalogue, p)?.label));

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Matches a search term or card slug to one product. */
// API: dynamic data – replace with the product search endpoint
export function findSupportProduct(catalogue: Catalogue, query: string): SupportProduct | undefined {
  const term = normalize(query);
  if (!term) return undefined;
  const all = supportProducts(catalogue);
  return (
    all.find((p) => normalize(p.slug) === term) ??
    all.find((p) => normalize(`${p.slug} ${p.name} ${p.model}`).includes(term))
  );
}

/** Finder URL for a search term or slug; `section` jumps to a download group. */
export const supportSearchHref = (query: string, section?: DownloadType) =>
  `/support/search/?q=${encodeURIComponent(query)}${section ? `#${section}` : ""}`;

/** Fixed copy of the About / Contact / Where to Buy pages (CMS single-record content) */
export type PageCopy = {
  about: {
    heroEyebrow: string; heroTitle: string; heroSubtitle: string; heroText: string; heroButton: string; heroButtonUrl: string; heroImage: string;
    exploreEyebrow: string; exploreTitle: string; valuesEyebrow: string; valuesTitle: string;
  };
  contact: { title: string; subtitle: string; heroImage: string; faqTitle: string; faqSubtitle: string };
  whereToBuy: { title: string; heroImage: string; heading: string; subtitle: string };
};

export type PagesContent = {
  copy: PageCopy;
  aboutSections: AboutSection[];
  aboutValues: AboutValue[];
  enquiryTypes: string[];
  faqs: Faq[];
  storesByCountry: Record<string, CountryStores>;
  /** Rows of tiles, top to bottom */
  supportTiles: SupportTile[][];
  downloads: Download[];
};
