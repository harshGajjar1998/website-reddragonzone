import type { MetadataRoute } from "next";
import { getContent } from "@/lib/cms";

// Built once with the static export
export const dynamic = "force-static";

/** /sitemap.xml – every public page, built with the site (the CMS publish rebuilds it). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl, seo, gaming, office, blog, press, textPages } = await getContent();
  // Compare and the Support search page are tools, not content: left out
  const paths = [
    "/",
    "/gaming/",
    "/office/",
    "/support/",
    "/where-to-buy/",
    "/about-us/",
    "/contact-us/",
    "/blog/",
    "/press-and-awards/",
    ...gaming.categories.map((c) => `/gaming/${c.slug}/`),
    ...office.categories.map((c) => `/office/${c.slug}/`),
    ...[...gaming.products, ...office.products].map((p) => `/${p.range ?? "gaming"}/${p.category}/${p.slug}/`),
    ...blog.posts.map((p) => `/blog/${p.slug}/`),
    ...press.articles.map((a) => `/press-and-awards/${a.slug}/`),
    ...textPages.map((p) => `/${p.slug}/`),
  ];
  // lastModified: when the CMS last saved that page's entry (products, categories, posts)
  return [...new Set(paths)].map((path) => {
    const updated = seo.pages[path]?.updated;
    return { url: `${siteUrl}${path}`, ...(updated ? { lastModified: updated } : {}) };
  });
}
