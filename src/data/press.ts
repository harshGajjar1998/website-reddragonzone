/* ==================================================================
   Press & Awards (Figma "Press")
   ================================================================== */

const P = "/images/pages/press";

export type PressArticle = {
  slug: string;
  /** Small line above the headline */
  kicker: string;
  title: string;
  excerpt: string;
  date: string;
  year: number;
  readTime: string;
  image: { src: string; width: number; height: number };
  author: { name: string; position: string; avatar: string };
};

const author = { name: "Name Last-name", position: "Position @ Company", avatar: "/images/pages/blog/author.png" };
const photo = (n: number) => ({ src: `${P}/article-${n}.png`, width: 552, height: 376 });
const article = (a: Omit<PressArticle, "readTime" | "author">): PressArticle => ({ ...a, readTime: "4 min read", author });

/** Stand-in for the years Figma lists but has no article for */
const sample = (year: number, image: number) =>
  article({
    slug: `sample-press-coverage-${year}`,
    kicker: "Sample article",
    title: `Sample press coverage from ${year}`,
    excerpt: "Placeholder article so this year can be previewed. Replace it with real coverage when the CMS is connected.",
    date: `March 14, ${year}`,
    year,
    image: photo(image),
  });

// API: dynamic data – press articles, newest first. The first four are from Figma; the sample() rows are placeholders.
export const pressArticles: PressArticle[] = [
  article({
    slug: "gamingcon-bharat-2026-mumbai",
    kicker: "REDRAGON Wraps Up",
    title: "GamingCon Bharat 2026 in Mumbai",
    excerpt:
      "Throughout the event, REDRAGON welcomed visitors to Booth 508, Hall No. 3, where gaming enthusiasts had the opportunity to explore the brand's gaming peripherals and engage with the REDRAGON team.",
    date: "October 19, 2026",
    year: 2026,
    image: photo(1),
  }),
  article({
    slug: "global-sources-hong-kong-2026",
    kicker: "REDRAGON Wraps Up",
    title: "Global Sources Hong Kong 2026",
    excerpt:
      "Under the theme “Smart Value Hardware,” Redragon invited attendees to take a closer look at the products on display and experience them firsthand. Visitors spoke with the team about product details, shared their preferences, and discussed what they look for in gaming gear.",
    date: "October 11, 2026",
    year: 2026,
    image: photo(2),
  }),
  article({
    slug: "meet-redragon-global-sources-hong-kong",
    kicker: "Join us at Booth 6S24",
    title: "Meet Redragon at Global Sources Consumer Electronics in Hong Kong",
    excerpt:
      "From keyboards and mice to headsets and gaming accessories, Redragon develops products for different play styles and setups. Our focus is on bringing together practical features, distinctive design, and accessible performance—giving more players the tools to build a setup that feels their own.",
    date: "October 11, 2026",
    year: 2026,
    image: photo(3),
  }),
  article({
    slug: "comic-frontier-22-indonesia",
    kicker: "Comic Frontier 22 Indonesia",
    title: "Redragon Brings Anime & Gaming Culture",
    excerpt:
      "Through a premium booth experience, anime-inspired branding, community-driven activities, and creator collaborations, Redragon strengthened its connection with Indonesia’s growing gaming and anime communities.",
    date: "October 11, 2026",
    year: 2026,
    image: photo(4),
  }),
  sample(2025, 1),
  sample(2024, 2),
  sample(2023, 3),
  sample(2022, 4),
  sample(2021, 1),
  sample(2020, 2),
  sample(2019, 3),
];

// API: dynamic data – single press article look-up
export const getPressArticle = (slug: string) => pressArticles.find((a) => a.slug === slug);

export const pressHref = (slug: string) => `/press-and-awards/${slug}`;

export type PressAward = { title: string; publication: string; date: string; description: string };

// API: dynamic data – awards and recognitions
export const pressAwards: PressAward[] = [
  {
    title: "Best Budget Gaming Keyboard",
    publication: "GameSpot",
    date: "MAR 2024",
    description: "An outstanding combination of features, performance and value.",
  },
  {
    title: "Editors’ Choice",
    publication: "TechPowerUp",
    date: "AUG 2023",
    description: "Recognized for quality and reliable gaming performance.",
  },
  {
    title: "Great Value Award",
    publication: "HardwareZone",
    date: "JAN 2023",
    description: "Noted for an accessible price and dependable features.",
  },
  {
    title: "Recommended for Gamers",
    publication: "PC Gamer",
    date: "OCT 2022",
    description: "A versatile range of practical gaming accessories.",
  },
];
