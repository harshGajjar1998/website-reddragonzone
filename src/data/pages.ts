/* ==================================================================
   About, Contact, Where to buy and Support page content types.
   Content comes from the CMS (Content → About Us, FAQs, Stores,
   Support topics, Downloads, Contact page); see src/lib/cms.
   ================================================================== */

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

export type Faq = { cmsId?: number; q: string; a: string[] };

export type Store = { cmsId?: number; name: string; type: "Official store" | "Online retailer" | "Retail store"; url: string };

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
  name: string;
  category: string;
  keywords: string;
  image: { src: string; width: number; height: number; crop?: { w: number; h: number; left: number; top: number }; box: { top: number; h: number } };
  software: string;
  manual: string;
};

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
  storesByCountry: Record<string, Store[]>;
  /** Rows of tiles, top to bottom */
  supportTiles: SupportTile[][];
  downloads: Download[];
};
