import type { MetadataRoute } from "next";
import { isCmsPreview } from "@/lib/cms/api";
import { getContent } from "@/lib/cms";

// Built once with the static export
export const dynamic = "force-static";

/** /robots.txt – the CMS draft-preview server must never be indexed. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  if (isCmsPreview()) return { rules: { userAgent: "*", disallow: "/" } };
  const { siteUrl } = await getContent();
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
