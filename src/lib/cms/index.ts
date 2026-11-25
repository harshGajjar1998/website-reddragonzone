import "server-only";
import { cache } from "react";
import type { Art } from "@/components/gaming/ArtImage";
import type { BlogPost } from "@/data/blog";
import type {
  Catalogue,
  FeaturedCard,
  FilterGroup,
  GamingCategory,
  GamingContent,
  GamingProduct,
  LatestItem,
  MobileFeaturedCard,
} from "@/data/gaming";
import type { Community, HomeBlock, HomeContent, Img } from "@/data/home";
import { SOCIAL_NETWORKS, type ChromeContent, type MegaMenu, type SearchProduct } from "@/data/navigation";
import type { OfficeCategory, OfficeContent, OfficeTile } from "@/data/office";
import { amazonLogo, redragonLogo, type CountryStores, type Download, type DownloadGroup, type DownloadOs, type PagesContent, type SupportTile } from "@/data/pages";
import type { PressContent } from "@/data/press";
import { fetchBundle, isCmsPreview, type CmsBundle, type CmsCategory, type CmsFeaturedCard, type CmsLatest, type CmsProduct, type CmsSeo } from "./api";
import { layout, placed } from "./layout";

/* ==================================================================
   CMS → page data. Turns the CMS bundle into the shapes the components
   render, joining each image with its placement from the design
   (src/data/design-layout.json, see ./layout.ts).
   ================================================================== */

export type SiteContent = {
  /** Absolute site address without a trailing slash, for the sitemap, canonical links and structured data */
  siteUrl: string;
  seo: {
    title: string;
    description: string;
    favicon: string;
    /** Default link-preview picture (CMS Settings) */
    shareImage?: string;
    /** False on staging domains and the draft preview: pages get noindex and robots.txt blocks crawlers */
    index: boolean;
    /** Per page, keyed by its path with a trailing slash ("/gaming/mice/") */
    pages: Record<string, PageSeo>;
  };
  chrome: ChromeContent;
  /** Compare and the Finder: served as /catalogue.json */
  catalogue: Catalogue;
  home: HomeContent;
  gaming: GamingContent;
  office: OfficeContent;
  pages: PagesContent;
  blog: { copy: { eyebrow: string; title: string; description: string }; categories: string[]; posts: BlogPost[] };
  press: PressContent;
  textPages: TextPage[];
};

/** CMS text page (Privacy Policy, Careers, …) at /<slug>/ */
export type TextPage = { slug: string; title: string; intro: string; updated?: string; sections: { heading: string; paragraphs: string[] }[] };

/** Search-engine and link-preview text for one page. Empty CMS fields are left out, so pages fall back to their own text. */
export type PageSeo = { title?: string; description?: string; image?: string; updated?: string };

/** The whole site, fetched once per build and shared by every page. */
export const getContent = cache(async (): Promise<SiteContent> => adapt(await fetchBundle()));

/* ---------------- lookups used by the dynamic routes ---------------- */

export const findCategory = <C extends GamingCategory>(list: C[], slug: string) => list.find((c) => c.slug === slug);
export const findProduct = (list: GamingProduct[], category: string, slug: string) =>
  list.find((p) => p.category === category && p.slug === slug);
export const productsIn = (list: GamingProduct[], category: string) => list.filter((p) => p.category === category);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** `option` as a whole word or phrase in `text` ("Wired" matches "USB Wired Mouse", not "Wireless"; "TKL (80%)" also matches "TKL") */
const names = (text: string, option: string) =>
  [option, option.replace(/\s*\(.*\)$/, "")].some((o) => o && new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(o)}(?![\\p{L}\\p{N}])`, "iu").test(text));

/**
 * A category page's filters and products. Products imported from the old site carry its sub-category
 * tags ("CPU Coolers", "RGB Mice") rather than the CMS filter options, so a product also matches an
 * option its name, tagline, tags or specs name. Tags no filter covers become a "Type" group, and
 * options no product matches are left out.
 */
export function listingFor<C extends GamingCategory>(category: C, list: GamingProduct[]): { category: C; products: GamingProduct[] } {
  const inCategory = productsIn(list, category.slug);
  const options = category.filters.flatMap((g) => g.options);
  const types = [...new Set(inCategory.flatMap((p) => p.tags ?? []))].filter((t) => !options.some((o) => names(t, o)));
  const groups = [...(types.length ? [{ title: "Type", options: types }] : []), ...category.filters];

  const products = inCategory.map((p) => {
    const text = [p.name, p.tagline, ...(p.tags ?? []), ...(p.specs?.technical.flatMap((g) => g.items) ?? [])].join("\n");
    const matched = options.filter((o) => p.tags?.includes(o) || names(text, o));
    return { ...p, filterTags: [...new Set([...(p.tags ?? []), ...matched])] };
  });
  const filters = groups
    .map((g) => ({ ...g, options: g.options.filter((o) => products.some((p) => p.filterTags.includes(o))) }))
    .filter((g) => g.options.length);
  return { category: { ...category, filters }, products };
}

// ---------------------------------------------------------------------

const opt = <T>(v: T | "" | undefined | null): T | undefined => (v === "" || v == null ? undefined : v);
const nonEmpty = <T>(a: T[]): T[] | undefined => (a.length ? a : undefined);
const pair = (a: string[]): [string, string] => [a[0] ?? "", a[1] ?? ""];

function adapt(b: CmsBundle): SiteContent {
  const dims = (src: string): { width: number; height: number } => {
    const d = b.media[src];
    return d ? { width: d[0], height: d[1] } : { width: 1600, height: 1600 };
  };
  const files = firmwareByProduct(b);
  const products = b.products.map((p) => product(p, dims, files[p.slug]));
  const home = homeContent(b);
  const gaming = gamingContent(b, products, dims);
  const office = officeContent(b, products, dims);
  const catalogue = slimCatalogue(products, [...gaming.categories, ...office.categories]);
  const siteUrl = (b.site.url || process.env.SITE_URL || "https://www.redragonzone.com").replace(/\/$/, "");

  return {
    siteUrl,
    seo: {
      title: b.site.settings.title,
      description: b.site.settings.description,
      favicon: b.site.settings.favicon_url,
      ...(b.site.settings.share_image_url ? { shareImage: b.site.settings.share_image_url } : {}),
      index: indexable(siteUrl),
      pages: seoPages(b),
    },
    // The draft preview renders per request, so it gets the catalogue inline (always current); the static site fetches the file
    chrome: { ...chrome(b, home.community), ...(isCmsPreview() ? { catalogue } : {}) },
    catalogue,
    home,
    gaming,
    office,
    pages: pagesContent(b, dims),
    press: pressContent(b, dims),
    textPages: (b.collections.text_pages ?? []).map((p) => ({
      slug: p.slug,
      title: p.title,
      intro: p.intro ?? "",
      ...(p.updated ? { updated: longDate(p.updated) } : {}),
      sections: (p.sections ?? []).map((s) => ({ heading: s.heading ?? "", paragraphs: (s.paragraphs ?? []).filter(Boolean) })),
    })),
    blog: {
      copy: { eyebrow: b.singletons.blog_settings.eyebrow, title: b.singletons.blog_settings.title, description: b.singletons.blog_settings.description },
      categories: b.singletons.blog_settings.categories,
      posts: b.collections.blog_posts.map((p) => ({
        cmsId: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        readTime: p.read_time,
        date: p.date,
        image: { src: p.image, ...(layout("blog", p.image) ?? dims(p.image)), ...(p.image_bg ? { bg: p.image_bg } : {}) },
        author: { name: p.author_name, position: p.author_position, avatar: p.author_avatar },
        body: { lead: p.lead, paragraphs: p.paragraphs, quote: { text: p.quote, author: p.quote_author }, closing: p.closing },
      })),
    },
  };
}

type Dims = (src: string) => { width: number; height: number };

function slimCatalogue(products: GamingProduct[], categories: GamingCategory[]): Catalogue {
  return {
    products: products.map((p) => ({
      range: p.range, slug: p.slug, category: p.category, name: p.name, model: p.model, series: p.series, keywords: p.keywords,
      tagline: p.tagline, image: p.image, smallArt: p.smallArt, tags: p.tags, compare: p.compare, downloads: p.downloads,
    })),
    categories: categories.map((c) => ({ range: c.range, slug: c.slug, label: c.label })),
  };
}

/* ---------------- catalogue ---------------- */

function category(c: CmsCategory, dims: Dims): GamingCategory {
  const filters: FilterGroup[] = c.filters.map((f) => ({
    title: f.title,
    options: f.options,
    ...(f.columns === "2" ? { columns: 2 as const } : {}),
    ...(f.collapsed ? { collapsed: true } : {}),
  }));
  const tileLabelTop = layout("category.tileLabelTop", c.slug);
  return {
    cmsId: c.id,
    range: c.range,
    slug: c.slug,
    label: c.label,
    ...(c.label_lines.length === 2 ? { labelLines: pair(c.label_lines) } : {}),
    ghost: c.ghost,
    tileArt: placed("category.tile", c.tile_image, c.tile_alt, dims),
    ...(tileLabelTop ? { tileLabelTop } : {}),
    ...(c.mobile_tile_image ? { mobileTileArt: placed("category.mobileTile", c.mobile_tile_image, c.tile_alt, dims) } : {}),
    hero: {
      breadcrumb: c.hero_breadcrumb,
      title: c.hero_title,
      description: c.hero_description,
      image: placed("category.hero", c.hero_image, c.hero_alt, dims),
    },
    listing: {
      breadcrumb: c.listing_breadcrumb,
      title: c.listing_title,
      description: c.listing_description,
      ...(c.listing_banner ? { banner: c.listing_banner } : {}),
    },
    filters,
  };
}

function product(p: CmsProduct, dims: Dims, downloads?: DownloadGroup[]): GamingProduct {
  const main = p.images[0] ?? "";
  const smallArt = layout("product.small", main);
  const largeArt = layout("product.large", main);
  const hasFeatures = p.features_description || p.features.length;
  return {
    cmsId: p.id,
    range: p.range,
    slug: p.slug,
    category: p.category,
    name: p.name,
    model: opt(p.model_number),
    series: opt(p.series),
    keywords: p.keywords,
    tagline: p.tagline,
    description: opt(p.description),
    image: { src: main, ...(layout("product.image", main) ?? dims(main)), ...(p.image_alts?.[0] ? { alt: p.image_alts[0] } : {}) },
    ...(smallArt ? { smallArt } : {}),
    ...(largeArt ? { largeArt } : {}),
    tags: nonEmpty(p.tags),
    gallery: nonEmpty(
      p.gallery.map((g) => ({
        src: g.image,
        ...(layout("product.gallery", g.image) ?? dims(g.image)),
        alt: g.alt,
        ...(g.bg ? { bg: g.bg } : {}),
      })),
    ),
    modules: nonEmpty(p.modules.map((m) => ({ label: m.label, ...(m.url ? { href: m.url } : {}) }))),
    colors: nonEmpty(
      p.colors.map(({ name, hex, image, image_alt }) => ({
        name,
        hex,
        // Same slot as the gallery: picking the colour shows this photo in the first cell
        ...(image ? { image: { src: image, ...(layout("product.gallery", image) ?? dims(image)), alt: image_alt || `${p.name} ${name}` } } : {}),
      })),
    ),
    details: nonEmpty(p.details),
    ...(p.spec_dimensions?.length || p.spec_groups?.length
      ? { specs: { dimensions: p.spec_dimensions ?? [], technical: (p.spec_groups ?? []).map((g) => ({ title: g.title, items: g.items })) } }
      : {}),
    ...compareValues(p),
    ...(downloads ? { downloads } : {}),
    keyFeatures: hasFeatures
      ? {
          description: p.features_description,
          hero: { src: p.features_image, ...(layout("product.featuresHero", p.features_image) ?? dims(p.features_image)) },
          items: p.features.map((f) => ({
            ...(f.wide ? { wide: true } : {}),
            image: { src: f.image, ...(layout("product.feature", f.image) ?? dims(f.image)), ...(f.bg ? { bg: f.bg } : {}) },
            ...(f.title ? { title: f.title } : {}),
            ...(f.text ? { text: f.text } : {}),
          })),
        }
      : undefined,
    featured: p.showcase
      ? {
          hero: {
            eyebrow: p.showcase_eyebrow,
            title: p.showcase_title,
            description: p.showcase_description,
            model: p.showcase_model,
            ghostLines: pair(p.showcase_ghost),
            image: { src: p.showcase_image, alt: p.showcase_image_alt },
            thumbnails: p.showcase_thumbnails.map((t) => ({ src: t.image, alt: t.alt })),
          },
          showcase: {
            title: pair(p.showcase_heading),
            description: p.showcase_text,
            ...(p.showcase_banner_top || p.showcase_banner_bottom
              ? { banners: { top: opt(p.showcase_banner_top), bottom: opt(p.showcase_banner_bottom) } }
              : {}),
            ...(p.showcase_mobile_banner_top || p.showcase_mobile_banner_bottom
              ? { mobileBanners: { top: opt(p.showcase_mobile_banner_top), bottom: opt(p.showcase_mobile_banner_bottom) } }
              : {}),
            cards: p.showcase_cards.map((c) => ({
              title: c.title,
              text: c.text,
              image: placed("showcase.card", c.image, c.alt, dims),
              ...(c.mobile_image ? { mobileImage: c.mobile_image } : {}),
            })),
          },
          exploded: p.exploded,
          explodedParts: p.exploded_parts,
          mobileExploded: opt(p.exploded_mobile),
        }
      : undefined,
  };
}

const COMPARE_KEYS = {
  summary: "compare_summary", type: "compare_type", connectivity: "compare_connectivity", layout: "compare_layout",
  hotSwap: "compare_hot_swap", switch: "compare_switch", polling: "compare_polling", build: "compare_build",
  rgb: "compare_rgb", software: "compare_software", warranty: "compare_warranty",
} as const satisfies Record<string, keyof CmsProduct>;

/** Compare-table values the CMS has for this product (empty ones are left to the derived values). */
function compareValues(p: CmsProduct): Pick<GamingProduct, "compare"> {
  const compare = Object.fromEntries(Object.entries(COMPARE_KEYS).flatMap(([key, field]) => (p[field] ? [[key, p[field]]] : [])));
  return Object.keys(compare).length ? { compare } : {};
}

/* ---------------- drivers & firmware ---------------- */

const DOWNLOAD_GROUPS: { type: DownloadGroup["type"]; cms: string; title: string; description: string }[] = [
  { type: "driver", cms: "Driver", title: "Driver", description: "Device connection and recognition" },
  { type: "firmware", cms: "Firmware", title: "Firmware", description: "On-device performance updates" },
  { type: "software", cms: "Software", title: "Software", description: "Customize your device settings" },
  { type: "manual", cms: "Manual", title: "Manual", description: "Setup and product documentation" },
];

const OS: Record<string, DownloadOs[]> = { Windows: ["windows"], Mac: ["mac"] };

/** "2026-02-01" → "01 Feb 2026", as the Finder shows dates */
const shortDate = (d: string) => {
  const t = Date.parse(`${d}T00:00:00Z`);
  return Number.isNaN(t) ? d : new Date(t).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
};

/** CMS "Drivers & firmware" files per product slug, grouped by type, newest first. */
function firmwareByProduct(b: CmsBundle): Record<string, DownloadGroup[]> {
  const bySlug: Record<string, CmsBundle["collections"]["firmware"]> = {};
  for (const f of b.collections.firmware ?? []) (bySlug[f.product] ??= []).push(f);

  const out: Record<string, DownloadGroup[]> = {};
  for (const [slug, files] of Object.entries(bySlug)) {
    const sorted = [...files].sort((x, y) => y.release_date.localeCompare(x.release_date));
    out[slug] = DOWNLOAD_GROUPS.flatMap((g) => {
      const releases = sorted
        .filter((f) => f.type === g.cms)
        .map((f) => {
          const ext = f.file.split("?")[0].split(".").pop() ?? "";
          return {
            version: f.version || f.title,
            date: shortDate(f.release_date),
            os: OS[f.os] ?? (["windows", "mac"] as DownloadOs[]),
            notes: f.release_notes,
            href: f.file,
            ...(f.size ? { file: { size: f.size, format: ext.length <= 4 ? ext.toUpperCase() : "" } } : {}),
          };
        });
      return releases.length ? [{ type: g.type, title: g.title, description: g.description, releases }] : [];
    });
  }
  return out;
}

function latest(items: CmsLatest[], dims: Dims): LatestItem[] {
  return items.map((it) => {
    const l = layout("latest", it.image);
    return {
      name: it.name,
      href: it.url,
      ...(l?.centerBounds ? { centerBounds: l.centerBounds } : {}),
      center: { src: it.image, alt: it.alt, ...(l?.center ?? { ...dims(it.image), box: { left: 566, top: 176, w: 309, h: 514 }, fit: "contain", shadow: "drop-latest" }) },
      side: l?.side ?? { src: it.image, alt: "", ...dims(it.image), box: { left: 874, top: 333, w: 231, h: 194 }, fit: "contain" },
      ...(l?.slots ? { slots: l.slots } : {}),
    };
  });
}

function featuredCards(cards: CmsFeaturedCard[], products: GamingProduct[], dims: Dims): FeaturedCard[] {
  return cards.flatMap((c) => {
    const p = products.find((x) => x.slug === c.product);
    if (!p) return []; // product unpublished or deleted
    const layers = layout("featuredCard", c.image)?.layers;
    const art: Art[] = layers
      ? layers.map(({ content, ...a }) => (content ? { ...a, src: c.image, alt: c.alt } : a))
      : [{ src: c.image, alt: c.alt, ...dims(c.image), box: { left: 0, top: 56, w: 416, h: 320 }, fit: "contain" }];
    return [{ product: { range: p.range, category: p.category, slug: p.slug }, name: c.name, label: c.label, description: c.description, art }];
  });
}

function gamingContent(b: CmsBundle, products: GamingProduct[], dims: Dims): GamingContent {
  const g = b.singletons.gaming_page;
  return {
    categories: b.categories.filter((c) => c.range === "gaming").map((c) => category(c, dims)),
    products: products.filter((p) => p.range === "gaming"),
    hero: { title: [g.title_line1, g.title_line2], description: g.description, image: g.image },
    latest: latest(g.latest, dims),
    featuredCards: featuredCards(g.featured_cards, products, dims),
    featuredGrid: g.featured_grid.map(
      (f): MobileFeaturedCard => ({
        name: f.name,
        description: f.description,
        href: f.url,
        image: placed("featuredGrid", f.image, f.alt, dims),
      }),
    ),
  };
}

function officeContent(b: CmsBundle, products: GamingProduct[], dims: Dims): OfficeContent {
  const o = b.singletons.office_page;
  const categories = b.categories
    .filter((c) => c.range === "office")
    .map(
      (c): OfficeCategory => ({
        ...category(c, dims),
        spotlights: c.spotlights.map((s) => ({
          series: s.series,
          name: s.name,
          tagline: s.tagline,
          description: s.description,
          href: s.url,
          art: placed("category.spotlight", s.image, s.alt, dims),
        })),
      }),
    );
  const tiles = o.tiles.map((t): OfficeTile => {
    const l = layout("officeTile", t.image);
    const { width, height } = dims(t.image);
    return {
      slug: t.category,
      label: t.label,
      ghost: t.ghost,
      art: { src: t.image, width: l?.width ?? width, height: l?.height ?? height, left: l?.left ?? 0, top: l?.top ?? 0 },
      artOnTop: l?.artOnTop ?? false,
      mobileArt: placed("officeMobileTile", t.mobile_image || t.image, "", dims),
    };
  });
  return {
    categories,
    products: products.filter((p) => p.range === "office"),
    description: o.description,
    tiles: { tall: tiles[0], short: [tiles[1], tiles[2]] },
    latest: latest(o.latest, dims),
    featuredCards: featuredCards(o.featured_cards, products, dims),
    newsletter: {
      eyebrow: o.newsletter_eyebrow,
      title: o.newsletter_title,
      description: o.newsletter_description,
      images: o.newsletter_images.map((i) => ({ src: i.image, alt: i.alt })),
    },
  };
}

/* ---------------- homepage ---------------- */

const s = (v: unknown) => (typeof v === "string" ? v : "");
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

function homeContent(b: CmsBundle): HomeContent {
  const page = b.pages.find((p) => p.slug === "home");
  const img = (src: unknown, alt: unknown): Img => ({ src: s(src), alt: s(alt) });
  type Card = { title: string; ghost: string; url: string; image: string; alt: string };
  const card = (c: Card) => ({ title: c.title, ghost: c.ghost, href: c.url, image: img(c.image, c.alt) });
  const community = (d: Record<string, unknown>): Community => ({
    eyebrow: s(d.eyebrow),
    title: s(d.title),
    body: s(d.body),
    button: s(d.button),
    images: [1, 2, 3].map((n) => img(d[`image${n}`], d[`alt${n}`])).filter((i) => i.src),
    mobileImages: [1, 2, 3].map((n) => img(d[`mobile_image${n}`] || d[`image${n}`], d[`alt${n}`])).filter((i) => i.src),
  });

  // Sections in editor order (hidden ones are already left out by the API); header/footer are site chrome.
  const blocks: HomeBlock[] = [];
  for (const { id, type, data: d } of page?.sections ?? []) {
    switch (type) {
      case "hero": {
        const slide = {
          id,
          eyebrow: s(d.eyebrow),
          title: s(d.title),
          description: s(d.body),
          cta: s(d.cta),
          href: s(d.cta_url),
          model: s(d.model),
          ghostLines: pair(arr<string>(d.ghost_lines)),
          image: img(d.image, d.alt),
          thumbnails: arr<{ image: string; alt: string }>(d.thumbnails).map((t) => img(t.image, t.alt)),
        };
        // Consecutive slides share one carousel
        const last = blocks[blocks.length - 1];
        if (last?.type === "hero") {
          last.ids.push(id);
          last.slides.push(slide);
        } else blocks.push({ type: "hero", ids: [id], slides: [slide] });
        break;
      }
      case "split":
        blocks.push({
          type: "split",
          ids: [id],
          split: {
            gaming: { title: s(d.gamingTitle), ghost: s(d.gamingGhost), description: s(d.gamingText), href: s(d.gamingUrl), image: img(d.gamingImage, d.gamingAlt) },
            office: { title: s(d.officeTitle), ghost: s(d.officeGhost), description: s(d.officeText), href: s(d.officeUrl), image: img(d.officeImage, d.officeAlt) },
          },
        });
        break;
      case "blueprint":
        blocks.push({ type: "blueprint", ids: [id], blueprint: { eyebrow: s(d.eyebrow), product: s(d.product), parts: arr<string>(d.parts) } });
        break;
      case "gears":
        blocks.push({
          type: "gears",
          ids: [id],
          gears: { eyebrow: s(d.eyebrow), title: s(d.title), gaming: arr<Card>(d.gaming_cards).map(card), office: arr<Card>(d.office_cards).map(card) },
        });
        break;
      case "featured":
        blocks.push({
          type: "featured",
          ids: [id],
          products: arr<{ series: string; model: string; description: string; url: string; image: string }>(d.items).map((p, i) => ({
            id: `${i}-${p.model}`,
            series: p.series,
            model: p.model,
            description: p.description,
            href: p.url,
            image: p.image,
          })),
        });
        break;
      case "community":
        blocks.push({ type: "community", ids: [id], community: community(d) });
        break;
      case "text":
        blocks.push({ type: "text", ids: [id], title: s(d.title), body: s(d.body) });
        break;
    }
  }

  const first = blocks.find((x) => x.type === "community");
  return { blocks, community: first?.type === "community" ? first.community : null };
}

/* ---------------- stores ---------------- */

/** Where to Buy stores by country (Where to Buy page and product pages). */
function storesByCountry(b: CmsBundle): Record<string, CountryStores> {
  const out: Record<string, CountryStores> = {};
  for (const st of b.collections.stores) {
    const country = (out[st.country] ??= { online: [], offline: [] });
    // Retail stores and authorized retailers with an address are shops to visit; the rest sell online.
    if ((st.type === "Retail store" || st.type === "Authorized retailer") && st.address_line1) {
      country.offline.push({
        name: st.name,
        type: st.type === "Authorized retailer" ? "Authorized Retailer" : "Retail Store",
        address: [st.address_line1, st.address_line2],
        lat: st.lat ?? 0,
        lng: st.lng ?? 0,
        image: st.photo || "/images/pages/where-to-buy/store-gamers-hub.png",
      });
      continue;
    }
    const official = st.type === "Official store";
    country.online.push({
      cmsId: st.id,
      name: st.name,
      type: official ? "Official store" : "Online",
      url: st.url,
      logo: st.logo ? { src: st.logo, width: 420, height: 288 } : official ? redragonLogo : /amazon/i.test(st.name) ? amazonLogo : undefined,
      ...(st.description ? { description: st.description } : {}),
      ...(st.categories?.length ? { categories: st.categories } : {}),
    });
  }
  return out;
}

/* ---------------- site chrome ---------------- */

function chrome(b: CmsBundle, community: HomeContent["community"]): Omit<ChromeContent, "catalogue"> {
  const { announcement: a, navigation, settings } = b.site;
  const search = b.singletons.search;
  const home = b.pages.find((p) => p.slug === "home");

  const megaMenus: Record<string, MegaMenu> = {};
  for (const item of navigation.header) {
    if (!item.children.length) continue;
    megaMenus[item.label] = {
      ...(layout("megaPanel", item.label) ?? { height: 292, headingTop: 24, gridTop: 84, tileWidth: 390, tileHeight: 152, columns: 3 }),
      tiles: item.children.map((c) => {
        const src = c.image ?? "";
        const l = layout("megaTile", src);
        const words = c.label.split(" ");
        return {
          label: c.label,
          href: c.url,
          ...(l?.twoLines && words.length > 1 ? { lines: [words[0], words.slice(1).join(" ")] as [string, string] } : {}),
          labelX: l?.labelX ?? 220,
          labelY: l?.labelY ?? 61,
          ...(l?.labelAlign ? { labelAlign: l.labelAlign } : {}),
          ...(l?.labelWidth ? { labelWidth: l.labelWidth } : {}),
          images: l?.images ?? (src ? [{ src, x: 16, y: 0, w: 140, h: 140, fit: "contain" as const }] : []),
        };
      }),
    };
  }

  return {
    helloBar: a ? { tag: a.tag ? `[ ${a.tag} ]` : "", message: a.text, cta: { label: a.cta_text, href: a.cta_url } } : null,
    mainNav: navigation.header.map((m) => ({ label: m.label, href: m.url, ...(m.children.length ? { hasDropdown: true } : {}) })),
    megaMenus,
    storesByCountry: storesByCountry(b),
    search: {
      suggestions: search.suggestions,
      pages: search.pages.map((p) => ({ label: p.label, href: p.url })),
      products: search.products.map(
        (p): SearchProduct => ({
          name: p.name,
          category: p.category,
          line: p.line === "Office" ? "Office" : "Game",
          href: p.url,
          image: p.image,
          imageHeight: layout("searchProduct", p.image)?.imageHeight ?? 128,
        }),
      ),
    },
    footerColumns: navigation.footer.map((c) => ({ title: c.title, links: c.links.map((l) => ({ label: l.label, href: l.url })) })),
    footerBlurb: settings.footer_text || s(home?.sections.find((x) => x.type === "footer")?.data.blurb),
    contact: { phone: (settings.contact_phone ?? "").trim(), email: (settings.contact_email ?? "").trim() },
    copyright: (settings.copyright || "© {year} REDRAGON").replace(/\{year\}/g, String(new Date().getFullYear())),
    socialLinks: Object.entries(settings.social).flatMap(([key, href]) =>
      href && SOCIAL_NETWORKS[key] ? [{ ...SOCIAL_NETWORKS[key], href }] : [],
    ),
    community,
    logos: {
      main: settings.logo_url || "/brand/redragon-logo.png",
      gaming: settings.gaming_logo_url || "/brand/redragon-logo-gaming.png",
      office: settings.office_logo_url || "/brand/redragon-logo-office.png",
      footer: settings.footer_logo_url || "/brand/redragon-logo-dragon.png",
    },
  };
}

/* ---------------- other pages ---------------- */

function pagesContent(b: CmsBundle, dims: Dims): PagesContent {
  const c = b.collections;


  // Rows follow the design's pattern (3, 3, 2); extra topics continue in rows of three.
  const pattern = layout("supportRows", "pattern") ?? [3, 3, 2];
  const tiles = c.support_topics.map((t, i): SupportTile => {
    const l = layout("supportTile", t.image);
    return {
      cmsId: t.id,
      slug: t.slug,
      label: t.label,
      ...(t.label_lines.length === 2 ? { lines: pair(t.label_lines) } : {}),
      ghost: t.ghost,
      width: l?.width ?? 464,
      inset: l?.inset ?? (i % 3 === 0 ? 88 : 40),
      ...(l?.plain ? { plain: true } : {}),
      art: { src: t.image, ...(l?.art ?? { ...dims(t.image), left: 60, top: 0 }) },
    };
  });
  const supportTiles: SupportTile[][] = [];
  for (let at = 0, r = 0; at < tiles.length; r++) {
    const n = pattern[r] ?? 3;
    supportTiles.push(tiles.slice(at, at + n));
    at += n;
  }

  const { about_page: ab, contact_page: ct, where_to_buy_page: wb } = b.singletons;
  return {
    copy: {
      about: {
        heroEyebrow: ab.hero_eyebrow, heroTitle: ab.hero_title, heroSubtitle: ab.hero_subtitle, heroText: ab.hero_text,
        heroButton: ab.hero_button, heroButtonUrl: ab.hero_button_url, heroImage: ab.hero_image,
        exploreEyebrow: ab.explore_eyebrow, exploreTitle: ab.explore_title, valuesEyebrow: ab.values_eyebrow, valuesTitle: ab.values_title,
      },
      contact: { title: ct.title, subtitle: ct.subtitle, heroImage: ct.hero_image, faqTitle: ct.faq_title, faqSubtitle: ct.faq_subtitle },
      whereToBuy: { title: wb.title, heroImage: wb.hero_image, heading: wb.heading, subtitle: wb.subtitle },
    },
    aboutSections: c.about_sections.map((a) => {
      const l = layout("about", a.image);
      return {
        cmsId: a.id,
        eyebrow: a.eyebrow,
        title: a.title,
        paragraphs: a.paragraphs,
        image: { src: a.image, ...(l ? { width: l.width, height: l.height } : dims(a.image)), alt: a.alt, h: l?.h ?? 450 },
        ...(a.media_left ? { mediaLeft: true } : {}),
        ...(a.tinted ? { tinted: true } : {}),
      };
    }),
    aboutValues: c.about_values.map((v) => ({ cmsId: v.id, title: v.title, text: v.text })),
    enquiryTypes: b.singletons.contact_page.enquiry_types,
    // The CMS category is the Support page topic (Firmware, Setup, Compatibility, Warranty)
    faqs: c.faqs.map((f) => ({ cmsId: f.id, q: f.question, a: f.answer, ...(f.category ? { topic: f.category.trim().toLowerCase() } : {}) })),
    storesByCountry: storesByCountry(b),
    supportTiles,
    downloads: c.downloads.map(
      (d): Download => ({
        cmsId: d.id,
        // The model code ends the name ("EISA 100 PRO K768VI-PRO") and is the Finder slug
        slug: d.name.trim().split(/\s+/).pop()?.toLowerCase() ?? "",
        name: d.name,
        category: d.category,
        keywords: d.keywords,
        image: { src: d.image, ...(layout("download", d.image) ?? { ...dims(d.image), box: { top: 122, h: 182 } }) },
        software: d.software_url,
        manual: d.manual_url,
      }),
    ),
  };
}

/* ---------------- press ---------------- */

/** "2026-10-19" → "October 19, 2026" */
const longDate = (d: string) => {
  const t = Date.parse(`${d}T00:00:00Z`);
  return Number.isNaN(t) ? d : new Date(t).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
};

function pressContent(b: CmsBundle, dims: Dims): PressContent {
  const p = b.singletons.press_page;
  const articles = [...(b.collections.press ?? [])].sort((x, y) => y.date.localeCompare(x.date));
  return {
    copy: {
      heroEyebrow: p.hero_eyebrow,
      heroTitle: p.hero_title,
      heroText: p.hero_text,
      heroImage: p.hero_image || "/images/pages/press/hero.png",
      coverageTitle: p.coverage_title,
      coverageText: p.coverage_text,
      awardsTitle: p.awards_title,
      awardsText: p.awards_text,
      contactTitle: p.contact_title,
      contactText: p.contact_text,
    },
    articles: articles.map((a) => ({
      cmsId: a.id,
      slug: a.slug,
      kicker: a.kicker,
      title: a.title,
      excerpt: a.excerpt,
      date: longDate(a.date),
      year: Number(a.date.slice(0, 4)) || new Date().getFullYear(),
      readTime: a.read_time,
      image: { src: a.image, ...dims(a.image) },
      author: { name: a.author_name, position: a.author_position, avatar: a.author_avatar },
      body: { lead: a.lead, paragraphs: a.paragraphs, quote: { text: a.quote, author: a.quote_author }, closing: a.closing },
    })),
    awards: (b.collections.awards ?? []).map((a) => ({ cmsId: a.id, title: a.title, publication: a.publication, date: a.date, description: a.description })),
  };
}

/* ---------------- SEO ---------------- */

/** CMS singletons that are a page of their own, by path (same paths as the CMS schema). */
const SEO_SINGLETONS: Record<string, string> = {
  "/gaming/": "gaming_page",
  "/office/": "office_page",
  "/support/": "support_page",
  "/where-to-buy/": "where_to_buy_page",
  "/about-us/": "about_page",
  "/contact-us/": "contact_page",
  "/blog/": "blog_settings",
  "/press-and-awards/": "press_page",
};

function seoPages(b: CmsBundle): Record<string, PageSeo> {
  const one = (o: unknown): PageSeo => {
    const s = (o ?? {}) as CmsSeo;
    return {
      ...(s.seo_title ? { title: s.seo_title } : {}),
      ...(s.seo_description ? { description: s.seo_description } : {}),
      ...(s.share_image ? { image: s.share_image } : {}),
      ...(s.updated_at ? { updated: s.updated_at } : {}),
    };
  };
  const out: Record<string, PageSeo> = {};
  const home = b.pages.find((p) => p.path === "/");
  // The homepage's SEO fields live on the page itself (CMS Pages → page settings)
  if (home) out["/"] = one({ seo_title: home.seo_title, seo_description: home.seo_description });
  const singletons = b.singletons as unknown as Record<string, unknown>;
  for (const [path, key] of Object.entries(SEO_SINGLETONS)) out[path] = one(singletons[key]);
  for (const c of b.categories) out[`/${c.range}/${c.slug}/`] = one(c);
  for (const p of b.products) out[`/${p.range}/${p.category}/${p.slug}/`] = one(p);
  for (const p of b.collections.blog_posts) out[`/blog/${p.slug}/`] = one(p);
  for (const p of b.collections.press) out[`/press-and-awards/${p.slug}/`] = one(p);
  for (const p of b.collections.text_pages ?? []) out[`/${p.slug}/`] = one(p);
  return out;
}

/**
 * Search engines may index the site only on the production domain. SITE_INDEX=1 / 0 overrides
 * (e.g. a China domain); the CMS draft preview is never indexed.
 */
function indexable(siteUrl: string): boolean {
  if (isCmsPreview()) return false;
  const flag = process.env.SITE_INDEX;
  if (flag === "1" || flag === "0") return flag === "1";
  return /(^|\.)redragonzone\.com$/i.test(new URL(siteUrl).hostname);
}
