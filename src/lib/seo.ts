import "server-only";
import type { Metadata } from "next";
import { getContent } from "@/lib/cms";

type Fallback = {
  /** Full title, e.g. "Gaming Products | Redragon" */
  title: string;
  description?: string;
  /** The page's own main picture (product render, article photo) when the CMS has no share picture */
  image?: string;
  type?: "website" | "article";
};

/**
 * Metadata for one page: the CMS "Search engines & sharing" fields first, then the page's own text,
 * then the site defaults. Adds the canonical URL and Open Graph / X link previews.
 * `path` is the page's canonical path with a trailing slash, as in the sitemap.
 */
export async function pageMetadata(path: string, fallback: Fallback): Promise<Metadata> {
  const { seo } = await getContent();
  const page = seo.pages[path] ?? {};
  const title = page.title ?? fallback.title;
  const description = page.description ?? fallback.description ?? seo.description;
  const image = page.image ?? fallback.image ?? seo.shareImage;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Redragon",
      type: fallback.type ?? "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** Product page title: "<Model> <Name> | Redragon", without repeating a model already in the name. */
export function productTitle(product: { name: string; model?: string }): string {
  const model = product.model?.trim();
  const name = model && !product.name.toUpperCase().includes(model.toUpperCase()) ? `${model} ${product.name}` : product.name;
  return `${name} | Redragon`;
}
