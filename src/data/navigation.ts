export type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "Gaming", href: "/gaming", hasDropdown: true },
  { label: "Office", href: "/office", hasDropdown: true },
  { label: "Support", href: "/support", hasDropdown: true },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

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

const GAMING_TILE_H = 146.667;

export const megaMenus: Record<string, MegaMenu> = {
  Gaming: {
    height: 592,
    headingTop: 19,
    gridTop: 64,
    tileWidth: 288,
    tileHeight: GAMING_TILE_H,
    columns: 4,
    tiles: [
      {
        label: "Mice",
        href: "/gaming/mice",
        labelX: 239.5,
        labelY: 61,
        images: [{ src: "/images/home/mouse-m919.png", x: 16, y: -2, w: 152, h: 152 }],
      },
      {
        label: "Keyboards",
        href: "/gaming/keyboards",
        labelX: 211,
        labelY: 61,
        images: [
          { src: "/images/home/keyboard-k754.png", x: 0, y: -4, w: 154, h: 154, rounded: true },
        ],
      },
      {
        label: "Headsets",
        href: "/gaming/headsets",
        labelX: 217,
        labelY: 61,
        images: [{ src: "/images/home/headset-h894.png", x: 15, y: 6, w: 135, h: 135 }],
      },
      {
        label: "Combo",
        href: "/gaming/combo",
        labelX: 227.5,
        labelY: 61,
        images: [{ src: "/images/nav/gaming-combo.png", x: -51, y: -17, w: 272, h: 180 }],
      },
      {
        label: "Speakers",
        href: "/gaming/speakers",
        labelX: 218.5,
        labelY: 61.33,
        images: [{ src: "/images/nav/gaming-speakers.png", x: 14, y: -2.67, w: 152, h: 152 }],
      },
      {
        label: "Content Creation",
        lines: ["Content", "Creation"],
        href: "/gaming/content-creation",
        labelX: 221.5,
        labelY: 49,
        images: [{ src: "/images/nav/gaming-content-creation.png", x: 19, y: -3, w: 152, h: 152 }],
      },
      {
        label: "Gamer Room",
        lines: ["Gamer", "Room"],
        href: "/gaming/gamer-room",
        labelX: 226.5,
        labelY: 49.33,
        images: [{ src: "/images/nav/gaming-gamer-room.png", x: 24, y: 4.33, w: 138, h: 138 }],
      },
      {
        label: "Laptop Accessories",
        lines: ["Laptop", "Accessories"],
        href: "/gaming/laptop-accessories",
        labelX: 206.5,
        labelY: 49,
        images: [{ src: "/images/nav/gaming-laptop-accessories.png", x: 12, y: 9, w: 128, h: 128 }],
      },
      {
        label: "Mice pads",
        href: "/gaming/mice-pads",
        labelX: 213.5,
        labelY: 60.67,
        // The design stacks two copies of the same render 5px apart
        images: [
          { src: "/images/nav/gaming-mice-pads.png", x: 7, y: -2.33, w: 152, h: 152 },
          { src: "/images/nav/gaming-mice-pads.png", x: 12, y: -2.33, w: 152, h: 152 },
        ],
      },
      {
        label: "PC Components",
        lines: ["PC", "Components"],
        href: "/gaming/pc-components",
        labelX: 201.5,
        labelY: 48.67,
        images: [{ src: "/images/nav/gaming-pc-components.png", x: 8, y: 5.67, w: 136, h: 136 }],
      },
      {
        label: "DIY Accessories",
        lines: ["DIY", "Accessories"],
        href: "/gaming/diy-accessories",
        labelX: 206.5,
        labelY: 48.67,
        images: [{ src: "/images/nav/gaming-diy-accessories.png", x: 4, y: 5.67, w: 136, h: 136 }],
      },
      {
        label: "Gamepads",
        href: "/gaming/gamepads",
        labelX: 210,
        labelY: 61,
        images: [{ src: "/images/nav/gaming-gamepads.png", x: 6, y: 0, w: 148, h: 148 }],
      },
    ],
  },
  Office: {
    height: 292,
    headingTop: 24,
    gridTop: 84,
    tileWidth: [389, 390, 389],
    tileHeight: 152,
    columns: 3,
    tiles: [
      {
        label: "Mice",
        href: "/office/mice",
        labelX: 326.5,
        labelY: 64,
        images: [{ src: "/images/nav/office-mice.png", x: 0, y: -56, w: 260, h: 260 }],
      },
      {
        label: "Keyboards",
        href: "/office/keyboards",
        labelX: 299,
        labelY: 64,
        images: [
          {
            src: "/images/nav/office-keyboards.png",
            x: -4,
            y: -39,
            w: 240,
            h: 240,
            fit: "contain",
            rounded: true,
          },
        ],
      },
      {
        label: "Combo",
        href: "/office/combo",
        labelX: 328.5,
        labelY: 64,
        images: [{ src: "/images/nav/office-combo.png", x: 3, y: -5, w: 272, h: 180 }],
      },
    ],
  },
  Support: {
    height: 292,
    headingTop: 24,
    gridTop: 84,
    tileWidth: 390,
    tileHeight: 152,
    columns: 2,
    tiles: [
      {
        label: "Manuals & Software's",
        href: "/support/download",
        labelX: 265,
        labelY: 50,
        labelAlign: "left",
        labelWidth: 100,
        images: [{ src: "/images/nav/support-manuals.png", x: 23, y: 11, w: 186, h: 130 }],
      },
      {
        label: "Where to Buy",
        href: "/where-to-buy",
        labelX: 239,
        labelY: 64,
        labelAlign: "left",
        images: [{ src: "/images/nav/support-where-to-buy.png", x: 14, y: 7, w: 192, h: 139 }],
      },
    ],
  },
};

/* ------------------------------------------------------------------
   Search overlay (Figma frame "Search")
   ------------------------------------------------------------------ */
export const searchSuggestions = ["keyboard", "wireless keyboard", "mechanical keyboard", "Tactile Keyboards"];

export const searchPages = [
  { label: "Keyboard Tester Online", href: "/keyboard-tester" },
  { label: "Differences Among Redragon Keyboards", href: "/news/redragon-keyboards-compared" },
];

export type SearchProduct = {
  name: string;
  category: string;
  line: "Game" | "Office";
  href: string;
  image: string;
  /** Rendered image height inside the 186px-wide slot */
  imageHeight: number;
};

export const searchProducts: SearchProduct[] = [
  {
    name: "RIO K771BGP",
    category: "Keyboard",
    line: "Game",
    href: "/products/rio-k771bgp",
    image: "/images/nav/search-rio-k771bgp.png",
    imageHeight: 128,
  },
  {
    name: "EISA 100 PRO K768VI-PRO",
    category: "Keyboard",
    line: "Game",
    href: "/products/eisa-100-pro-k768vi-pro",
    image: "/images/nav/search-eisa-k768vi-pro.png",
    imageHeight: 128,
  },
  {
    name: "K681MG-RGB-PRO",
    category: "Keyboard",
    line: "Game",
    href: "/products/k681mg-rgb-pro",
    image: "/images/nav/search-k681mg-rgb-pro.png",
    imageHeight: 59,
  },
  {
    name: "BK-7111WG",
    category: "Keyboard",
    line: "Office",
    href: "/products/bk-7111wg",
    image: "/images/nav/search-bk-7111wg.png",
    imageHeight: 59,
  },
  {
    name: "K681MG-RGB-PRO",
    category: "Keyboard",
    line: "Game",
    href: "/products/k681mg-rgb-pro",
    image: "/images/nav/search-k681mg-rgb-pro.png",
    imageHeight: 59,
  },
  {
    name: "BK-7111WG",
    category: "Keyboard",
    line: "Office",
    href: "/products/bk-7111wg",
    image: "/images/nav/search-bk-7111wg.png",
    imageHeight: 59,
  },
];

export const helloBar = {
  tag: "[ HARDWARE LAUNCH ]",
  message: "THE NEW K617 PRO COMPACT 60% KEYBOARD IS NOW LIVE.",
  cta: { label: "SECURE YOUR UNIT", href: "https://redragonshop.com" },
};

export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Where to buy",
    links: [
      { label: "Official Online Stores", href: "/where-to-buy/official-stores" },
      { label: "Online Retailers", href: "/where-to-buy/online-retailers" },
      { label: "Find a Store", href: "/where-to-buy/find-a-store" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Need Help?", href: "/support" },
      { label: "Download", href: "/support/download" },
    ],
  },
  {
    title: "About us",
    links: [
      { label: "Our Company", href: "/about-us" },
      { label: "Latest News", href: "/news" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Media Kit", href: "/media-kit" },
    ],
  },
  {
    title: "Partners",
    links: [
      { label: "Influencer Program", href: "/partners/influencer" },
      { label: "Affiliate Program", href: "/partners/affiliate" },
      { label: "Ambassador Program", href: "/partners/ambassador" },
      { label: "Esports Program", href: "/partners/esports" },
      { label: "Agent Program", href: "/partners/agent" },
    ],
  },
];

export const socialLinks = [
  { label: "Twitter", href: "https://twitter.com/", icon: "/icons/social-twitter.svg" },
  { label: "YouTube", href: "https://youtube.com/", icon: "/icons/social-youtube.svg" },
  { label: "Instagram", href: "https://instagram.com/", icon: "/icons/social-instagram.svg" },
  { label: "X", href: "https://x.com/", icon: "/icons/social-circle-x.svg" },
];
