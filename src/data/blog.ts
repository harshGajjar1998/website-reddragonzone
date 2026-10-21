/* ==================================================================
   Blog (Figma "Blog Home Page", "Main Auto layout" detail page)
   ================================================================== */

const B = "/images/pages/blog";

// API: dynamic data – blog categories
export const blogCategories = [
  "Gaming Keyboards",
  "Gaming Mice",
  "Product Updates",
  "Community",
  "Tech Insights",
  "RGB Lighting",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  readTime: string;
  date: string;
  image: { src: string; width: number; height: number; bg?: string };
  author: { name: string; position: string; avatar: string };
};

const author = { name: "Name Last-name", position: "Position @ Company", avatar: `${B}/author.png` };

// API: dynamic data – blog posts
/** First post is the featured card on page 1 */
export const blogPosts: BlogPost[] = [
  {
    slug: "unlock-your-ultimate-gaming-setup",
    title: "Unlock your ultimate gaming setup",
    excerpt:
      "Wondering what makes Redragon Zone the go-to for gamers? Dive in to discover how our cutting-edge accessories enhance your gameplay and elevate your experience.",
    category: "Gaming Keyboards",
    readTime: "4 min read",
    date: "XX MONTH XXX",
    image: { src: `${B}/featured.png`, width: 1538, height: 1000 },
    author,
  },
  {
    slug: "beginners-guide-to-choosing-a-gaming-mouse",
    title: "A beginner’s guide to choosing the perfect gaming mouse",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    category: "Gaming Mice",
    readTime: "4 min read",
    date: "XX MONTH XXX",
    image: { src: `${B}/mice-guide.png`, width: 1024, height: 1024 },
    author,
  },
  {
    slug: "keep-your-redragon-gear-performing",
    title: "How to keep your Redragon gear performing at its best",
    excerpt: "Keep your gaming accessories in top shape with our easy maintenance tips and tricks.",
    category: "Community",
    readTime: "3 min read",
    date: "XX MONTH XXX",
    image: { src: `${B}/gear-care.png`, width: 1024, height: 434 },
    author,
  },
  {
    slug: "artemis-k719-pro-anime-keyboard",
    title: "Inspired by the ARTEMIS K719 PRO Anime Keyboard",
    excerpt: "Explore the latest RGB lighting trends and customize your Redragon Zone gear.",
    category: "RGB Lighting",
    readTime: "3 min read",
    date: "XX MONTH XXX",
    image: { src: `${B}/artemis-k719.png`, width: 640, height: 250 },
    author,
  },
  {
    slug: "what-sets-redragon-switches-apart",
    title: "What sets Redragon Zone’s mechanical switches apart?",
    excerpt: "Discover the tech behind our durable, responsive gaming switches.",
    category: "Tech Insights",
    readTime: "5 min read",
    date: "XX MONTH XXX",
    image: { src: `${B}/switches.png`, width: 1024, height: 1024 },
    author,
  },
  {
    slug: "play-without-limits-h891-nyx-pro",
    title: "Play Without Limits",
    excerpt:
      "Redragon presents the H891 NYX PRO Wireless Gaming Headset, the latest in its high-performance gaming gear.",
    category: "Gaming Keyboards",
    readTime: "4 min read",
    date: "XX MONTH XXX",
    image: { src: `${B}/h891-headset.png`, width: 1280, height: 1280, bg: "#fff4ff" },
    author,
  },
  {
    slug: "comic-frontier-22-indonesia",
    title: "to Comic Frontier 22 Indonesia",
    excerpt: "Learn ergonomic tips to prevent strain and improve your gaming comfort.",
    category: "Gaming Mice",
    readTime: "4 min read",
    date: "XX MONTH XXX",
    image: { src: `${B}/comic-frontier.png`, width: 850, height: 637 },
    author,
  },
];

// API: dynamic data – single blog post look-up
export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);

// API: dynamic data – blog article body
/** Article body from the design (placeholder copy until the CMS is connected) */
export const articleBody = {
  lead: "Lorem ipsum dolor sit amet. Et voluptatem reiciendis ex ipsam sapiente et porro sunt qui fugiat voluptas et corporis fugit est sint Quis ut maiores omnis. Sit minima sunt et corrupti quia non voluptates tempore cum quisquam quod? Qui molestiae repellendus in reprehenderit aliquam est ipsa animi qui error placeat et ipsa unde aut aperiam animi.",
  paragraphs: [
    "Lorem ipsum dolor sit amet. Et voluptatem reiciendis ex ipsam sapiente et porro sunt qui fugiat voluptas et corporis fugit est sint Quis ut maiores omnis. Sit minima sunt et corrupti quia non voluptates tempore cum quisquam quod? Qui molestiae repellendus in reprehenderit aliquam est ipsa animi qui error placeat et ipsa unde aut aperiam animi.",
    "Et quisquam optio ea sint accusamus et deserunt autem eum deserunt quia est quibusdam dolores ea laboriosam repellat. Qui enim quaerat qui reiciendis enim id commodi quos aut nulla nostrum et perferendis galisum aut reprehenderit consequuntur ut veritatis deleniti. Id aspernatur iure qui deleniti dicta eos cupiditate aspernatur et dolor incidunt qui nisi dolorem et autem autem et quia distinctio. In tempore rerum aut corrupti impedit et voluptates consequatur.",
  ],
  quote: { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Name Last-name" },
  closing:
    "Qui consequatur omnis non quod dignissimos et nesciunt harum qui facere exercitationem id deserunt natus aut minus earum. Ut magnam consequuntur aut praesentium cumque ea quia magnam qui esse modi eos harum saepe qui perferendis velit et repellat dolore. Id quas eveniet ut autem quam sit voluptas exercitationem id nostrum odit ea autem facere sed ipsa nihil. Est consequuntur quae ea voluptatem voluptates aut consequatur galisum.",
};
