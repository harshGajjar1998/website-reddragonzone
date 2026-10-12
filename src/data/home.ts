export type FeaturedProduct = {
  id: string;
  series: string;
  model: string;
  description: string;
  href: string;
  /** Hero render shown when the product is the active slide (623×432 slot) */
  image?: string;
  /** Vertical render shown in the narrow "previous" cell */
  peekImage?: string;
};

/**
 * "New Gears" carousel. The design shows "01 / 05" – only these products are
 * defined in Figma so far; add the remaining ones here and the counter follows.
 */
export const featuredProducts: FeaturedProduct[] = [
  {
    id: "bs-7543",
    series: "BS",
    model: "7543",
    description:
      "Every curve, every button, every detail is designed to keep you in the game with your keyboard and mouse.",
    href: "/products/bs-7543",
    image: "/images/home/combo-bs7543.png",
  },
  {
    id: "king-ultra-m999",
    series: "KING ULTRA",
    model: "M999",
    description: "Every click, every scroll, every detail is designed to keep you in control.",
    href: "/products/king-ultra-m999",
  },
  {
    id: "k769",
    series: "",
    model: "K769",
    description: "",
    href: "/products/k769",
    peekImage: "/images/home/keyboard-k769.png",
  },
];

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  /** Vertical outlined model name beside the product */
  model: string;
  /** Two-line faint outlined wordmark at the bottom-left */
  ghostLines: [string, string];
  image: { src: string; alt: string };
  thumbnails: { src: string; alt: string }[];
};

const prismProM997: Omit<HeroSlide, "id"> = {
  eyebrow: "Precision Meets Performance",
  title: "LIGHTER. FASTER. READY TO WIN.",
  description:
    "The PRISM PRO M997-PRO-1K is designed for competitive gaming. Its lightweight, ergonomic shape ensures comfort and control. The honeycomb shell enhances reliability for every click.",
  href: "/products/prism-pro-m997",
  model: "M997",
  ghostLines: ["PRISM", "PRO M997"],
  image: { src: "/images/home/m997-main.png", alt: "Redragon PRISM PRO M997 gaming mouse" },
  thumbnails: [
    { src: "/images/home/m997-thumb-1.png", alt: "PRISM PRO M997 – side view" },
    { src: "/images/home/m997-thumb-2.png", alt: "PRISM PRO M997 – angled view" },
    { src: "/images/home/m997-thumb-3.png", alt: "PRISM PRO M997 – rear view" },
  ],
};

/**
 * Hero carousel. The design shows 5 indicator dots but only the PRISM PRO M997
 * slide is designed, so it fills every slot for now – replace entries as the
 * other slides are delivered (the dots follow the array length).
 */
export const heroSlides: HeroSlide[] = Array.from({ length: 5 }, (_, i) => ({
  id: `prism-pro-m997-${i + 1}`,
  ...prismProM997,
}));

export const communityImages = [
  { src: "/images/home/community-1.png", alt: "Esports player competing on stage" },
  { src: "/images/home/community-2.png", alt: "RGB mechanical keyboard close-up" },
  { src: "/images/home/community-3.png", alt: "Redragon gear blueprint illustration" },
];
