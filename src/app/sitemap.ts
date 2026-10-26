import type { MetadataRoute } from "next";
import { getContent } from "@/lib/cms";

// Built once with the static export
export const dynamic = "force-static";

/** /sitemap.xml – every public page, built with the site (the CMS publish rebuilds it). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl, gaming, office, blog } = await getContent();
  const paths = [
    "/",
    "/gaming/",
    "/office/",
    "/support/",
    "/where-to-buy/",
    "/about-us/",
    "/contact-us/",
    "/blog/",
    ...gaming.categories.map((c) => `/gaming/${c.slug}/`),
    ...office.categories.map((c) => `/office/${c.slug}/`),
    ...[...gaming.products, ...office.products].map((p) => `/${p.range ?? "gaming"}/${p.category}/${p.slug}/`),
    ...blog.posts.map((p) => `/blog/${p.slug}/`),
  ];
  return [...new Set(paths)].map((path) => ({ url: `${siteUrl}${path}` }));
}
