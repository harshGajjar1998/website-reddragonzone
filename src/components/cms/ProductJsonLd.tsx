import JsonLd from "@/components/JsonLd";
import type { GamingProduct } from "@/data/gaming";
import { absUrl, breadcrumbs } from "@/lib/structured-data";

/** Schema.org Product + breadcrumb trail (Home → Gaming/Office → category → product) for search engines. */
export default function ProductJsonLd({
  product,
  siteUrl,
  categoryName,
}: {
  product: GamingProduct;
  siteUrl: string;
  categoryName: string;
}) {
  const range = product.range ?? "gaming";
  const path = `/${range}/${product.category}/${product.slug}/`;
  const images = [
    product.image.src,
    ...(product.gallery ?? []).map((g) => g.src),
  ]
    .filter(Boolean)
    .map((src) => absUrl(siteUrl, src));
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.model ? { sku: product.model, mpn: product.model } : {}),
    brand: { "@type": "Brand", name: "Redragon" },
    category: categoryName,
    description: product.description || product.tagline || undefined,
    image: [...new Set(images)],
    url: `${siteUrl}${path}`,
  };
  const trail = breadcrumbs(siteUrl, [
    { name: range === "office" ? "Office" : "Gaming", path: `/${range}/` },
    { name: categoryName, path: `/${range}/${product.category}/` },
    { name: product.name, path },
  ]);
  return <JsonLd data={[data, trail]} />;
}
