"use client";

import Image from "next/image";
import { useState } from "react";
import ProductPanel, { type PanelId } from "@/components/product/ProductPanel";
import type { GamingProduct } from "@/data/gaming";

const POINTERS: { id: PanelId; label: string }[] = [
  // Specifications, Materials & Sustainability and In the Box, as sections of one panel
  { id: "details", label: "Product Details" },
  { id: "manuals", label: "Manuals & Software" },
  { id: "buy", label: "WHERE TO BUY" },
];

/** The product page links (Figma "Frame 109–113", first three merged into "Product Details"); each opens its side panel. */
export default function ProductPointers({
  product,
  dark,
  className = "",
}: {
  product: GamingProduct;
  /** Light text for the dark featured hero */
  dark?: boolean;
  className?: string;
}) {
  const [panel, setPanel] = useState<PanelId | null>(null);

  return (
    <>
      <div className={`relative flex flex-col items-start ${className}`}>
        {POINTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-haspopup="dialog"
            onClick={() => setPanel(id)}
            className="flex cursor-pointer items-center gap-3"
          >
            <span className={`font-lexend text-[16px] leading-[1.2] font-medium whitespace-nowrap ${dark ? "text-white" : "text-ink"}`}>
              {label}
            </span>
            <Image
              src="/icons/gaming/accordion-chevron.svg"
              alt=""
              width={16}
              height={16}
              className={dark ? "invert" : ""}
            />
          </button>
        ))}
      </div>
      {panel && <ProductPanel panel={panel} product={product} onClose={() => setPanel(null)} />}
    </>
  );
}
