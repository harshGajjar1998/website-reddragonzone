export type FeaturedProduct = {
  id: string;
  series: string;
  model: string;
  description: string;
  href: string;
  /** Square product render shown in the 623×432 slot (cropped to fill it) */
  image: string;
};

// API: dynamic data – "New Gears" featured products carousel
/**
 * "New Gears" carousel. Uses renders already in the gaming catalogue;
 * the counter and dots follow the array length.
 */
export const featuredProducts: FeaturedProduct[] = [
  {
    id: "bs-7543",
    series: "BS",
    model: "7543",
    description:
      "Every curve, every button, every detail is designed to keep you in the game with your keyboard and mouse.",
    href: "/gaming/combo",
    image: "/images/home/combo-bs7543.png",
  },
  {
    id: "k768vi-pro",
    series: "EISA 100 PRO",
    model: "K768VI",
    description: "Gasket-mounted, hot-swappable and tri-mode, with a knob and LCD display at your fingertips.",
    href: "/gaming/keyboards/k768vi-pro",
    image: "/images/gaming/products/k768vi-pro.png",
  },
  {
    id: "k769bam-m",
    series: "NUBULA",
    model: "K769",
    description: "Magnetic HE switches, an 8K report rate and an aluminium frame for instant response.",
    href: "/gaming/keyboards/k769bam-m",
    image: "/images/gaming/products/k769bam-m.png",
  },
  {
    id: "k668wbo-wl",
    series: "TRUNDLE",
    model: "K668",
    description: "Wireless, tri-mode and hot-swappable – a full-size mechanical board that goes anywhere.",
    href: "/gaming/keyboards/k668wbo-wl",
    image: "/images/gaming/products/k668wbo-wl.png",
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

// API: dynamic data – home hero banner slides
/**
 * Hero carousel. The design shows 5 indicator dots but only the PRISM PRO M997 slide is
 * designed; the H894 slide reuses its layout with existing renders for variety. Add entries
 * as further slides are delivered (the dots follow the array length).
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "prism-pro-m997",
    eyebrow: "Precision Meets Performance",
    title: "LIGHTER. FASTER. READY TO WIN.",
    description:
      "The PRISM PRO M997-PRO-1K is designed for competitive gaming. Its lightweight, ergonomic shape ensures comfort and control. The honeycomb shell enhances reliability for every click.",
    href: "/gaming/mice/prism-pro-m997",
    model: "M997",
    ghostLines: ["PRISM", "PRO M997"],
    image: { src: "/images/home/m997-main.png", alt: "Redragon PRISM PRO M997 gaming mouse" },
    thumbnails: [
      { src: "/images/home/m997-thumb-1.png", alt: "PRISM PRO M997 – side view" },
      { src: "/images/home/m997-thumb-2.png", alt: "PRISM PRO M997 – angled view" },
      { src: "/images/home/m997-thumb-3.png", alt: "PRISM PRO M997 – rear view" },
    ],
  },
  {
    id: "titan-h894",
    eyebrow: "Sound That Gives You the Edge",
    title: "HEAR MORE. REACT FIRST.",
    description:
      "The TITAN H894 wireless gaming headset delivers precise positional audio for every footstep. Plush memory-foam cups and a padded headband keep you comfortable through the longest sessions.",
    href: "/gaming/headsets",
    model: "H894",
    ghostLines: ["TITAN", "H894"],
    image: { src: "/images/home/h894-main.png", alt: "Redragon TITAN H894 wireless gaming headset" },
    thumbnails: [
      { src: "/images/home/h894-thumb-1.png", alt: "TITAN H894 – angled view with microphone" },
      { src: "/images/home/h894-thumb-2.png", alt: "TITAN H894 – ear cup detail" },
      { src: "/images/home/h894-thumb-3.png", alt: "TITAN H894 – headband detail" },
    ],
  },
];

// API: dynamic data – esports community gallery images
export const communityImages = [
  { src: "/images/home/community-1.png", alt: "Esports player competing on stage" },
  { src: "/images/home/community-2.png", alt: "RGB mechanical keyboard close-up" },
  { src: "/images/home/community-3.png", alt: "Redragon gear blueprint illustration" },
];
