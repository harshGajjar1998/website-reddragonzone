import "server-only";
import { unstable_rethrow } from "next/navigation";

/* ==================================================================
   Raw shapes of the CMS public API (reddragon-cms: GET /api/public/bundle).
   Field lists mirror backend/app/Content/Schema.php; every key is always
   present (the CMS normalises saved data to its schema).
   ================================================================== */

type Str = string;
export type CmsImage = { image: Str; alt: Str };

export type CmsCategory = {
  id: number;
  slug: Str;
  range: "gaming" | "office";
  label: Str;
  label_lines: Str[];
  ghost: Str;
  tile_image: Str;
  tile_alt: Str;
  mobile_tile_image: Str;
  hero_breadcrumb: Str;
  hero_title: Str;
  hero_description: Str;
  hero_image: Str;
  hero_alt: Str;
  listing_breadcrumb: Str;
  listing_title: Str;
  listing_description: Str;
  listing_banner: Str;
  filters: { title: Str; options: Str[]; columns: Str; collapsed: boolean }[];
  spotlights: { series: Str; name: Str; tagline: Str; description: Str; url: Str; image: Str; alt: Str }[];
};

export type CmsProduct = {
  id: number;
  slug: Str;
  path: Str;
  name: Str;
  section: "Gaming" | "Office";
  range: "gaming" | "office";
  category: Str;
  images: Str[];
  tagline: Str;
  description: Str;
  specs: { k: Str; v: Str }[];
  model_number: Str;
  price_tier: Str;
  flagship: boolean;
  in_box: Str[];
  series: Str;
  keywords: Str;
  tags: Str[];
  gallery: (CmsImage & { bg: Str })[];
  modules: { label: Str; url: Str }[];
  colors: { name: Str; hex: Str }[];
  details: { title: Str; body: Str }[];
  features_description: Str;
  features_image: Str;
  features: { image: Str; title: Str; text: Str; bg: Str; wide: boolean }[];
  showcase: boolean;
  showcase_eyebrow: Str;
  showcase_title: Str;
  showcase_description: Str;
  showcase_model: Str;
  showcase_ghost: Str[];
  showcase_image: Str;
  showcase_image_alt: Str;
  showcase_thumbnails: CmsImage[];
  showcase_heading: Str[];
  showcase_text: Str;
  showcase_banner_top: Str;
  showcase_banner_bottom: Str;
  showcase_mobile_banner_top: Str;
  showcase_mobile_banner_bottom: Str;
  showcase_cards: (CmsImage & { title: Str; text: Str; mobile_image: Str })[];
  exploded: boolean;
  exploded_parts: Str[];
  exploded_mobile: Str;
};

export type CmsMenuItem = { id: Str; label: Str; url: Str; image?: Str; children: CmsMenuItem[] };

export type CmsSection = { id: Str; type: Str; data: Record<string, unknown> };

export type CmsLatest = { name: Str; url: Str; image: Str; alt: Str };
export type CmsFeaturedCard = { product: Str; name: Str; label: Str; description: Str; image: Str; alt: Str };

export type CmsBundle = {
  site: {
    /** The public website's address (CMS_SITE_URL) */
    url?: Str;
    settings: {
      title: Str;
      description: Str;
      logo_url: Str;
      footer_logo_url: Str;
      favicon_url: Str;
      footer_text: Str;
      social: Record<string, Str>;
    };
    announcement: { tag: Str; text: Str; cta_text: Str; cta_url: Str } | null;
    navigation: { header: CmsMenuItem[]; footer: { id: Str; title: Str; links: { label: Str; url: Str }[] }[] };
  };
  pages: { slug: Str; path: Str; title: Str; seo_title: Str; seo_description: Str; sections: CmsSection[] }[];
  categories: CmsCategory[];
  products: CmsProduct[];
  collections: {
    blog_posts: {
      id: number; slug: Str; title: Str; excerpt: Str; category: Str; read_time: Str; date: Str; image: Str; image_bg: Str;
      author_name: Str; author_position: Str; author_avatar: Str;
      lead: Str; paragraphs: Str[]; quote: Str; quote_author: Str; closing: Str;
    }[];
    faqs: { id: number; question: Str; answer: Str[] }[];
    stores: { id: number; country: Str; name: Str; type: "Official store" | "Online retailer" | "Retail store"; url: Str }[];
    downloads: { id: number; name: Str; category: Str; keywords: Str; image: Str; software_url: Str; manual_url: Str }[];
    support_topics: { id: number; slug: Str; label: Str; label_lines: Str[]; ghost: Str; image: Str }[];
    about_sections: { id: number; eyebrow: Str; title: Str; paragraphs: Str[]; image: Str; alt: Str; media_left: boolean; tinted: boolean }[];
    about_values: { id: number; title: Str; text: Str }[];
  };
  singletons: {
    gaming_page: {
      title_line1: Str; title_line2: Str; description: Str; image: Str;
      latest: CmsLatest[]; featured_cards: CmsFeaturedCard[];
      featured_grid: { name: Str; description: Str; url: Str; image: Str; alt: Str }[];
    };
    office_page: {
      description: Str;
      tiles: { category: Str; label: Str; ghost: Str; image: Str; mobile_image: Str }[];
      latest: CmsLatest[]; featured_cards: CmsFeaturedCard[];
      newsletter_eyebrow: Str; newsletter_title: Str; newsletter_description: Str; newsletter_images: CmsImage[];
    };
    about_page: {
      hero_eyebrow: Str; hero_title: Str; hero_subtitle: Str; hero_text: Str; hero_button: Str; hero_button_url: Str; hero_image: Str;
      explore_eyebrow: Str; explore_title: Str; values_eyebrow: Str; values_title: Str;
    };
    contact_page: { title: Str; subtitle: Str; hero_image: Str; enquiry_types: Str[]; faq_title: Str; faq_subtitle: Str };
    where_to_buy_page: { title: Str; hero_image: Str; heading: Str; subtitle: Str };
    blog_settings: { eyebrow: Str; title: Str; description: Str; categories: Str[] };
    search: {
      suggestions: Str[];
      pages: { label: Str; url: Str }[];
      products: { name: Str; category: Str; line: Str; url: Str; image: Str }[];
    };
  };
  /** Intrinsic [width, height] of every image the CMS knows */
  media: Record<string, [number, number]>;
};

/**
 * The whole published site in one request. Called at build time (static export);
 * Next's fetch cache shares one response across every page the build renders, and the
 * build stamp (next.config.ts) keeps a later build from reusing it.
 */
/**
 * Draft preview: the server started by `npm run preview:cms`, or built with `npm run build` (CMS_PREVIEW=1), renders unpublished
 * content for the CMS visual editor, authenticated with the key it shares with the CMS.
 */
export const isCmsPreview = () => process.env.CMS_PREVIEW === "1";

export async function fetchBundle(): Promise<CmsBundle> {
  const base = process.env.CMS_API_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("CMS_API_URL is not set. Point it at the Redragon CMS API, e.g. CMS_API_URL=http://127.0.0.1:8010 (see .env.example).");
  }
  const preview = isCmsPreview();
  if (preview && !process.env.CMS_PREVIEW_KEY) {
    throw new Error("CMS_PREVIEW_KEY is not set – it must match CMS_PREVIEW_KEY in the CMS backend .env (see .env.example).");
  }
  const url = `${base}/api/public/bundle?build=${process.env.CMS_BUILD_STAMP ?? "dev"}${preview ? "&draft=1" : ""}`;
  let res: Response;
  try {
    res = await fetch(url, {
      // `next dev` and the preview server: fetch on every request so CMS edits show on refresh. Builds: once, shared by every page.
      ...(process.env.NODE_ENV === "development" || preview ? { cache: "no-store" as const } : { cache: "force-cache" as const, next: { tags: ["cms"] } }),
      headers: { Accept: "application/json", ...(preview ? { "X-Preview-Key": process.env.CMS_PREVIEW_KEY! } : {}) },
    });
  } catch (e) {
    unstable_rethrow(e); // preview server: Next's "render this route per request" signal, not a network error
    throw new Error(`Could not reach the CMS at ${url}: ${(e as Error).message}`);
  }
  if (!res.ok) throw new Error(`The CMS answered ${res.status} for ${url}`);
  return ((await res.json()) as { data: CmsBundle }).data;
}
