/* ------------------------------------------------------------------
   Product comparison content (Figma "Compare Keyboards")
   ------------------------------------------------------------------ */
import { categoryOf, productHref, type Catalogue, type GamingProduct } from "@/data/gaming";

// API: dynamic data – every product that can be compared (CMS products, from useChrome().catalogue)

export const compareId = (product: GamingProduct) => productHref(product);

export const findCompareProduct = (catalogue: Catalogue, id: string) => catalogue.products.find((p) => compareId(p) === id);

export { categoryOf };

/** Name and model shown separately, e.g. "EISA 100 PRO" and "K768VI-PRO". */
export function productLabels(product: GamingProduct) {
  const model = product.slug.toUpperCase();
  const title = product.name.replace(model, "").trim();
  return { title: title || product.name, model };
}

const NOT_SPECIFIED = "Not specified";
const CHECK_PAGE = "Check product page";

export type SpecKey =
  | "type"
  | "connectivity"
  | "layout"
  | "hotSwap"
  | "switch"
  | "polling"
  | "build"
  | "rgb"
  | "software"
  | "warranty";

type ProductSpecs = Record<SpecKey, string> & { summary: string };

const SECTIONS: { title: string; rows: { key: SpecKey; label: string }[] }[] = [
  {
    title: "OVERVIEW",
    rows: [
      { key: "type", label: "Product type" },
      { key: "connectivity", label: "Connectivity" },
      { key: "layout", label: "Layout / key count" },
      { key: "hotSwap", label: "Hot-swappable" },
      { key: "switch", label: "Switch technology" },
    ],
  },
  {
    title: "PERFORMANCE & DETAILS",
    rows: [
      { key: "polling", label: "Polling rate" },
      { key: "build", label: "Mounting / build" },
      { key: "rgb", label: "RGB lighting" },
      { key: "software", label: "Software support" },
      { key: "warranty", label: "Warranty" },
    ],
  },
];

const details = { rgb: CHECK_PAGE, software: CHECK_PAGE, warranty: CHECK_PAGE };

const firstTag = (tags: string[], pattern: RegExp) => tags.find((tag) => pattern.test(tag));

/** The product's compare values from the CMS ("Compare table" in the product editor); empty rows fall back to what its catalogue tags can tell us. */
export function compareSpecs(catalogue: Catalogue, product: GamingProduct): ProductSpecs {
  return { ...derivedSpecs(catalogue, product), ...product.compare };
}

function derivedSpecs(catalogue: Catalogue, product: GamingProduct): ProductSpecs {
  const tags = product.tags ?? [];
  const switchType = firstTag(tags, /mechanical|membrane|magnetic/i);
  const connectivity =
    firstTag(tags, /tri-mode/i) ?? firstTag(tags, /wireless/i) ?? firstTag(tags, /bluetooth|2\.4ghz/i) ?? firstTag(tags, /wired/i);
  const label = categoryOf(catalogue, product)?.label ?? "Product";
  const singular = label.replace(/mice$/i, "mouse").replace(/s$/, "").toLowerCase();
  return {
    summary: tags.length ? tags.slice(0, 2).join(" · ") : product.tagline,
    type: switchType ? `${switchType.replace(" Switch", "")} ${singular}` : label.replace(/mice$/i, "Mouse").replace(/s$/, ""),
    connectivity: connectivity ?? NOT_SPECIFIED,
    layout: firstTag(tags, /%|full-size/i) ?? NOT_SPECIFIED,
    hotSwap: tags.includes("Hot-swappable") ? "Yes" : NOT_SPECIFIED,
    switch: switchType ?? NOT_SPECIFIED,
    polling: NOT_SPECIFIED,
    build: NOT_SPECIFIED,
    ...details,
  };
}

/** Table sections with one value per product; `differs` marks rows worth highlighting. */
export function compareSections(catalogue: Catalogue, products: GamingProduct[]) {
  const specs = products.map((p) => compareSpecs(catalogue, p));
  return SECTIONS.map((section) => ({
    title: section.title,
    rows: section.rows.map(({ key, label }) => {
      const values = specs.map((spec) => spec[key]);
      // Missing data isn't a difference: only compare the values we actually know
      const known = values.filter((value) => value !== NOT_SPECIFIED && value !== CHECK_PAGE);
      return { label, values, differs: new Set(known).size > 1 };
    }),
  }));
}
