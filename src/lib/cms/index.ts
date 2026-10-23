import "server-only";
import { cache } from "react";
import type { Art } from "@/components/gaming/ArtImage";
import type { BlogPost } from "@/data/blog";
import type {
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
import type { Download, PagesContent, Store, SupportTile } from "@/data/pages";
import { fetchBundle, type CmsBundle, type CmsCategory, type CmsFeaturedCard, type CmsLatest, type CmsProduct } from "./api";
import { layout, placed } from "./layout";

/* ==================================================================
   CMS → page data. Turns the CMS bundle into the shapes the components
   render, joining each image with its placement from the design
   (src/data/design-layout.json, see ./layout.ts).
   ================================================================== */

export type SiteContent = {
  seo: { title: string; description: string };
  chrome: ChromeContent;
  home: HomeContent;
  gaming: GamingContent;
  office: OfficeContent;
  pages: PagesContent;
  blog: { copy: { eyebrow: string; title: string; description: string }; categories: string[]; posts: BlogPost[] };
};

/** The whole site, fetched once per build and shared by every page. */
export const getContent = cache(async (): Promise<SiteContent> => adapt(await fetchBundle()));

/* ---------------- lookups used by the dynamic routes ---------------- */

export const findCategory = <C extends GamingCategory>(list: C[], slug: string) => list.find((c) => c.slug === slug);
export const findProduct = (list: GamingProduct[], category: string, slug: string) =>
  list.find((p) => p.category === category && p.slug === slug);
export const productsIn = (list: GamingProduct[], category: string) => list.filter((p) => p.category === category);

// ---------------------------------------------------------------------

const opt = <T>(v: T | "" | undefined | null): T | undefined => (v === "" || v == null ? undefined : v);
const nonEmpty = <T>(a: T[]): T[] | undefined => (a.length ? a : undefined);
const pair = (a: string[]): [string, string] => [a[0] ?? "", a[1] ?? ""];

function adapt(b: CmsBundle): SiteContent {
  const dims = (src: string): { width: number; height: number } => {
    const d = b.media[src];
    return d ? { width: d[0], height: d[1] } : { width: 1600, height: 1600 };
  };
  const products = b.products.map((p) => product(p, dims));
  const home = homeContent(b);

  return {
    seo: { title: b.site.settings.title, description: b.site.settings.description },
    chrome: chrome(b, home.community),
    home,
    gaming: gamingContent(b, products, dims),
    office: officeContent(b, products, dims),
    pages: pagesContent(b, dims),
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

function product(p: CmsProduct, dims: Dims): GamingProduct {
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
    series: opt(p.series),
    keywords: p.keywords,
    tagline: p.tagline,
    description: opt(p.description),
    image: { src: main, ...(layout("product.image", main) ?? dims(main)) },
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
    colors: nonEmpty(p.colors),
    details: nonEmpty(p.details),
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

/* ---------------- site chrome ---------------- */

function chrome(b: CmsBundle, community: HomeContent["community"]): ChromeContent {
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
    socialLinks: Object.entries(settings.social).flatMap(([key, href]) =>
      href && SOCIAL_NETWORKS[key] ? [{ ...SOCIAL_NETWORKS[key], href }] : [],
    ),
    community,
  };
}

/* ---------------- other pages ---------------- */

function pagesContent(b: CmsBundle, dims: Dims): PagesContent {
  const c = b.collections;

  const storesByCountry: Record<string, Store[]> = {};
  for (const st of c.stores) (storesByCountry[st.country] ??= []).push({ cmsId: st.id, name: st.name, type: st.type, url: st.url });

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
    faqs: c.faqs.map((f) => ({ cmsId: f.id, q: f.question, a: f.answer })),
    storesByCountry,
    supportTiles,
    downloads: c.downloads.map(
      (d): Download => ({
        cmsId: d.id,
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
