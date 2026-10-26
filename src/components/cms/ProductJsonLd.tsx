import type { GamingProduct } from "@/data/gaming";

/**
 * Schema.org Product data for search engines (see node_modules/next/dist/docs/01-app/02-guides/json-ld.md).
 * `<` is escaped so CMS text can't close the script tag.
 */
export default function ProductJsonLd({ product, siteUrl }: { product: GamingProduct; siteUrl: string }) {
  const abs = (src: string) => (/^https?:\/\//.test(src) ? src : `${siteUrl}${src}`);
  const images = [product.image.src, ...(product.gallery ?? []).map((g) => g.src)].filter(Boolean).map(abs);
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.model ? { sku: product.model, mpn: product.model } : {}),
    brand: { "@type": "Brand", name: "Redragon" },
    category: product.category,
    description: product.description || product.tagline || undefined,
    image: [...new Set(images)],
    url: `${siteUrl}/${product.range ?? "gaming"}/${product.category}/${product.slug}/`,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
