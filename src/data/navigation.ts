/* ==================================================================
   Site chrome types: announcement bar, main navigation + mega menus,
   search, footer. Content comes from the CMS (Navigation, Announcement
   bar, Settings, Content → Search); see src/lib/cms.
   ================================================================== */

import type { Community } from "./home";

export type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

/* ------------------------------------------------------------------
   Mega menus (Figma frames "Gaming", "Office", "Support").
   All coordinates are relative to the tile's top-left corner.
   ------------------------------------------------------------------ */
export type MegaMenuTile = {
  label: string;
  href: string;
  /** Explicit line break between words, as in the design */
  lines?: [string, string];
  /** Label: horizontal centre (or left edge when `labelAlign` is "left") + top */
  labelX: number;
  labelY: number;
  labelAlign?: "center" | "left";
  /** Fixed label box width (wrapping labels) */
  labelWidth?: number;
  images: {
    src: string;
    x: number;
    y: number;
    w: number;
    h: number;
    fit?: "cover" | "contain";
    rounded?: boolean;
  }[];
};

export type MegaMenu = {
  /** Height of the dark panel below the header */
  height: number;
  /** Top of the "By category" label inside the panel */
  headingTop: number;
  /** Top of the tile grid inside the panel */
  gridTop: number;
  tileWidth: number | number[];
  tileHeight: number;
  columns: number;
  tiles: MegaMenuTile[];
};

export type SearchProduct = {
  name: string;
  category: string;
  line: "Game" | "Office";
  href: string;
  image: string;
  /** Rendered image height inside the 186px-wide slot */
  imageHeight: number;
};

export type HelloBarContent = {
  tag: string;
  message: string;
  cta: { label: string; href: string };
};

export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export type SocialLink = { label: string; href: string; icon: string };

/** Icons and labels for the social networks the CMS stores (Settings → Social links) */
export const SOCIAL_NETWORKS: Record<string, { label: string; icon: string }> = {
  twitter: { label: "Twitter", icon: "/icons/social-twitter.svg" },
  youtube: { label: "YouTube", icon: "/icons/social-youtube.svg" },
  instagram: { label: "Instagram", icon: "/icons/social-instagram.svg" },
  x: { label: "X", icon: "/icons/social-circle-x.svg" },
};

/** Everything around the page content, shared by every page (see ChromeProvider) */
export type ChromeContent = {
  /** Null when switched off in the CMS or outside its dates */
  helloBar: HelloBarContent | null;
  mainNav: NavItem[];
  megaMenus: Record<string, MegaMenu>;
  search: { suggestions: string[]; pages: { label: string; href: string }[]; products: SearchProduct[] };
  footerColumns: FooterColumn[];
  footerBlurb: string;
  socialLinks: SocialLink[];
  community: Community | null;
};
