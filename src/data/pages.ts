/* ==================================================================
   About, Contact, Where to buy and Support page content
   ================================================================== */

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
];

// API: dynamic data – FAQs
export const faqs = [
  {
    q: "What sets Red Dragon Zone apart from other eCommerce platforms for  accessories?",
    a: [
      "Red Dragon Zone is built for gaming accessories only, with curated catalogues, community features and tools made for gear sellers.",
    ],
  },
  {
    q: "Can I use my own domain for my accessories business with Red Dragon Zone?",
    a: [
      "Yes! You can link your domain to Red Dragon Zone, which offers a free plan.",
      "Red Dragon Zone provides each seller a unique rdz.zone domain upon signing up.",
    ],
  },
  {
    q: "Can I sell accessories on Red Dragon Zone without an online store?",
    a: ["Yes. You can list products straight from your Red Dragon Zone dashboard and share them through social channels."],
  },
  {
    q: "Is there a startup fee for using Red Dragon Zone for my accessories?",
    a: ["No. Creating an account and listing your first products is free."],
  },
  {
    q: "In which countries can I operate my accessories business with Red Dragon Zone?",
    a: ["Red Dragon Zone is available worldwide wherever our payment partners operate."],
  },
  {
    q: "Are there transaction fees or commissions with Red Dragon Zone?",
    a: ["A small transaction fee applies to each completed order; there are no monthly commissions."],
  },
  {
    q: "Can I customize my Red Dragon Zone store for accessories?",
    a: ["Yes. Themes, colours, banners and product layouts can all be customised from the store editor."],
  },
];

/* ---------------- Where to buy ---------------- */

export type Store = { name: string; type: "Official store" | "Online retailer" | "Retail store"; url: string };

// API: dynamic data – Where to Buy store list
export const storesByCountry: Record<string, Store[]> = {
  India: [
    { name: "Redragon India Official Store", type: "Official store", url: "https://redragon.in" },
    { name: "Amazon India", type: "Online retailer", url: "https://www.amazon.in/s?k=redragon" },
    { name: "Flipkart", type: "Online retailer", url: "https://www.flipkart.com/search?q=redragon" },
  ],
  "United States": [
    { name: "Redragon Shop", type: "Official store", url: "https://redragonshop.com" },
    { name: "Amazon US", type: "Online retailer", url: "https://www.amazon.com/s?k=redragon" },
  ],
  "United Kingdom": [{ name: "Amazon UK", type: "Online retailer", url: "https://www.amazon.co.uk/s?k=redragon" }],
  Germany: [{ name: "Amazon DE", type: "Online retailer", url: "https://www.amazon.de/s?k=redragon" }],
  Indonesia: [{ name: "Redragon Indonesia", type: "Official store", url: "https://redragon.co.id" }],
  Brazil: [{ name: "Redragon Brasil", type: "Official store", url: "https://www.redragon.com.br" }],
};

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
  name: string;
  category: string;
  keywords: string;
  image: { src: string; width: number; height: number; crop?: { w: number; h: number; left: number; top: number }; box: { top: number; h: number } };
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

// API: dynamic data – support downloads (drivers, manuals)
/** Downloads list – the design repeats these four keyboards; add real entries here */
export const downloads: Download[] = [
  { name: "EISA 100 PRO  K768VI-PRO", category: "keyboards", keywords: "Keywords", image: k768, software: "#", manual: "#" },
  { name: "TRUNDLE K668WBO-WL", category: "keyboards", keywords: "Keywords", image: k668, software: "#", manual: "#" },
  { name: "NUBULA  K769BAM-M", category: "keyboards", keywords: "Keywords", image: k769, software: "#", manual: "#" },
  { name: "NUBULA  K769BAM-M", category: "keyboards", keywords: "Keywords", image: k769, software: "#", manual: "#" },
  { name: "EISA 100 PRO  K768VI-PRO", category: "keyboards", keywords: "Keywords", image: k768, software: "#", manual: "#" },
  { name: "TRUNDLE K668WBO-WL", category: "keyboards", keywords: "Keywords", image: k668, software: "#", manual: "#" },
  { name: "NUBULA  K769BAM-M", category: "keyboards", keywords: "Keywords", image: k769, software: "#", manual: "#" },
  { name: "NUBULA  K769BAM-M", category: "keyboards", keywords: "Keywords", image: k769, software: "#", manual: "#" },
  { name: "EISA 100 PRO  K768VI-PRO", category: "keyboards", keywords: "Keywords", image: k768, software: "#", manual: "#" },
  { name: "TRUNDLE K668WBO-WL", category: "keyboards", keywords: "Keywords", image: k668, software: "#", manual: "#" },
];
