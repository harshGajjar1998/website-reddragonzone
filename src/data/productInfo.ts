/* ------------------------------------------------------------------
   Content of the product page side panels (Figma "TECHNICAL SPECIFICATIONS" variants)
   ------------------------------------------------------------------ */
import type { GamingProduct, ProductSpecs } from "@/data/gaming";

// API: dynamic data – sample mouse specs from the Figma design, replace with each product's real specs
const sampleMouseSpecs: ProductSpecs = {
  dimensions: ["Height: 39 mm", "Width: 60 mm", "Depth: 117 mm", "Weight: 55 g"],
  technical: [
    {
      title: "Sensor technology",
      items: [
        "Sensor technology: PixArt PAW3395 Premium Gaming Sensor",
        "Max resolution: Up to 26,000 DPI",
        "Acceleration: 50G",
      ],
    },
    {
      title: "Buttons",
      items: ["Number of buttons: 8", "Programmable buttons: 8", "Customizable keybinds and macro support"],
    },
    { title: "Polling Rate", items: ["Polling rate: 125Hz / 250Hz / 500Hz / 1000Hz", "Maximum polling rate: 1000Hz"] },
    {
      title: "Customization app",
      items: [
        "Supported by Redragon software",
        "Customize button functions, keybinds and macros",
        "Adjust polling rate and DPI settings",
      ],
    },
  ],
};

/** Specifications panel content. Products without real specs list their catalogue tags. */
// API: dynamic data – product specifications
export function productSpecs(product: GamingProduct): ProductSpecs {
  if (product.specs) return product.specs;
  if (product.category === "mice") return sampleMouseSpecs;
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
