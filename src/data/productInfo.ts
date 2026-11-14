/* ------------------------------------------------------------------
   Content of the product page side panels (Figma "TECHNICAL SPECIFICATIONS" variants)
   ------------------------------------------------------------------ */
import type { GamingProduct, ProductSpecs } from "@/data/gaming";

/** Specifications panel content from the CMS ("Technical specifications panel"). Products without it list their catalogue tags. */
export function productSpecs(product: GamingProduct): ProductSpecs {
  if (product.specs) return product.specs;
  return {
    dimensions: [],
    technical: [{ title: "Key features", items: product.tags?.length ? product.tags : [product.tagline] }],
  };
}

const detail = (product: GamingProduct, title: string) => product.details?.find((d) => d.title === title)?.body;

/** Materials & Sustainability panel text. */
// API: dynamic data – product materials
export const productMaterials = (product: GamingProduct) =>
  detail(product, "Materials & Sustainability") ??
  "Built from durable materials with recyclable packaging.";

/** In the Box panel text. */
// API: dynamic data – box contents
export const productBoxContents = (product: GamingProduct) =>
  detail(product, "In the Box") ?? `${product.name} and user manual.`;
