"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { compareCatalogue, compareId, compareSpecs, findCompareProduct, productLabels } from "@/data/compare";
import type { GamingProduct } from "@/data/gaming";
import { COMPARE_MAX, addToCompare, removeFromCompare, useCompareState } from "@/lib/compare";
import { useModalLock } from "@/lib/useModalLock";

const CATEGORIES = [
  { slug: "keyboards", label: "Keyboards", singular: "keyboard" },
  { slug: "mice", label: "Mice", singular: "mouse" },
  { slug: "headsets", label: "Headsets", singular: "headset" },
  { slug: "all", label: "All products", singular: "product" },
];

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

function ResultRow({ product, full }: { product: GamingProduct; full: boolean }) {
  const { title, model } = productLabels(product);
  return (
    <li className="relative flex min-h-[122px] items-center gap-3 rounded-[9px] border border-[#e0e3e7] bg-white p-3 md:gap-[19px] md:pr-8">
      {/* API: dynamic data – product image, name, summary and model */}
      <Image
        src={product.image.src}
        alt=""
        width={product.image.width}
        height={product.image.height}
        sizes="130px"
        className="h-[80px] w-[96px] shrink-0 rounded-[6px] object-contain md:h-[99px] md:w-[130px]"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-lexend-deca text-[15px] leading-6 font-semibold text-ink md:text-[17px]">{title}</p>
        <p className="mt-1 truncate font-lexend-deca text-[13px] leading-[18px] text-[#626466] md:mt-2.5">
          {compareSpecs(product).summary}
        </p>
        <p className="mt-1 truncate font-lexend-deca text-[12px] leading-[17px] font-medium text-[#949494] md:mt-[13px]">
          {model}
        </p>
      </div>
      <button
        type="button"
        disabled={full}
        onClick={() => addToCompare(compareId(product))}
        className="flex h-10 w-[88px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-crimson pr-1 font-lexend text-[16px] leading-6 text-white shadow-[0_1px_3px_rgb(0_0_0/0.05)] transition-colors hover:bg-[#bc1018] disabled:cursor-not-allowed disabled:bg-graphite disabled:text-[#949494]"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 4.17v11.66M4.17 10h11.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Add
        <span className="sr-only"> {product.name}</span>
      </button>
    </li>
  );
}

/** Figma "06 / Add a product · Search modal overlay". */
export default function AddProductModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalLock(dialogRef);

  const { ids } = useCompareState();
  // API: dynamic data – selected products
  const selected = ids.map(findCompareProduct).filter((p) => p !== undefined);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(() => {
    const first = selected[0]?.category;
    return CATEGORIES.some((c) => c.slug === first) ? first! : "all";
  });

  const active = CATEGORIES.find((c) => c.slug === category)!;
  const remaining = COMPARE_MAX - selected.length;
  const term = normalize(query);
  // API: dynamic data – product search and recommendations
  const results = compareCatalogue.filter(
    (p) =>
      !ids.includes(compareId(p)) &&
      (category === "all" || p.category === category) &&
      (!term || normalize(`${p.name} ${p.slug}`).includes(term)),
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 md:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby="add-product-title"
        className="h-full w-full max-w-[960px] overflow-y-auto overscroll-contain bg-white pb-8 outline-none [scrollbar-width:none] md:h-auto md:max-h-full md:rounded-[16px] md:border md:border-[#e1e4e8] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative bg-[#17191f] px-4 py-5 pr-[76px] md:h-[107px] md:rounded-[16px] md:px-[38px] md:py-6">
          <h2 id="add-product-title" className="font-lexend-deca text-[22px] leading-[30px] font-semibold text-white md:text-[26px] md:leading-9">
            Add a product to compare
          </h2>
          <p className="mt-1 font-lexend-deca text-[13px] leading-5 text-[#c8cad0] md:mt-[5px] md:text-[14px]">
            Find a matching model, choose a category, or browse recommendations.
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 flex size-11 cursor-pointer items-center justify-center rounded-[8px] bg-[#32343a] md:top-[23px] md:right-[31px] md:size-[52px]"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
              <path d="M24 8 8 24M8 8l16 16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-4 md:px-[38px]">
          <div className="mt-4 flex h-[54px] items-center justify-between rounded-[8px] bg-[#fff5f5] px-4 font-lexend-deca text-[#a21822] md:mt-[23px] md:pr-[26px]">
            <p className="text-[14px] leading-[21px] font-semibold md:text-[15px]">
              {selected.length} of {COMPARE_MAX} products selected
            </p>
            <p className="text-[14px] leading-5 font-medium whitespace-nowrap md:w-[130px]">
              {remaining === 0 ? "No slots left" : `${remaining} slot${remaining > 1 ? "s" : ""} left`}
            </p>
          </div>

          <label className="mt-4 flex h-14 items-center gap-3 rounded-[8px] border border-[#d5d9df] bg-[#f8f9fa] px-4 md:mt-[26px] md:h-[67px] md:gap-[35px] md:pl-[18px]">
            <span className="sr-only">Search products</span>
            <Image src="/icons/pages/search.svg" alt="" width={18} height={18} className="shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search a ${active.singular}, name or model…`}
              className="w-full bg-transparent font-lexend-deca text-[16px] leading-[22px] text-ink outline-none placeholder:text-[#a0a3ab]"
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] md:mt-[21px] md:grid md:grid-cols-[repeat(4,208px)] md:gap-[13px] md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => {
              const on = c.slug === category;
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(c.slug)}
                  className={`h-11 shrink-0 cursor-pointer rounded-[6px] border px-[22px] text-left font-lexend-deca text-[14px] leading-5 whitespace-nowrap ${
                    on ? "border-crimson bg-[#fff0f1] font-semibold text-[#ce1523]" : "border-transparent bg-[#f7f7f8] font-medium text-[#626466]"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <h3 className="mt-6 font-lexend-deca text-[19px] leading-[29px] font-semibold text-ink md:mt-[25px] md:text-[21px]">
            Suggested {category === "all" ? "products" : active.label.toLowerCase()}
          </h3>
          <p className="mt-1 font-lexend-deca text-[13px] leading-[18px] text-[#626466]">
            {category === "all" ? "Browse every product in the range." : `Based on the ${active.singular} category you selected.`}
          </p>

          <div className="mt-5 flex flex-col-reverse gap-4 md:mt-[30px] md:flex-row md:items-start">
            <div className="min-w-0 flex-1 md:w-[605px] md:flex-none">
              {results.length > 0 ? (
                <ul className="flex flex-col gap-1.5">
                  {results.map((product) => (
                    <ResultRow key={compareId(product)} product={product} full={remaining === 0} />
                  ))}
                </ul>
              ) : (
                <p className="py-10 text-center font-lexend-deca text-[16px] text-[#626466]">No products found.</p>
              )}
            </div>

            <aside className="shrink-0 rounded-[9px] border border-[#e2e4e8] bg-[#f6f7f9] p-4 md:sticky md:top-4 md:min-h-[366px] md:w-[266px] md:pt-[18px]">
              <p className="px-0.5 font-lexend-deca text-[14px] leading-5 font-semibold text-ink">CURRENTLY SELECTED</p>
              <p className="mt-[13px] px-0.5 font-lexend-deca text-[13px] leading-[19px] font-medium text-crimson">
                {selected.length} / {COMPARE_MAX} products
              </p>
              <ul className="mt-[21px] flex flex-col gap-3">
                {selected.map((product) => (
                  <li
                    key={compareId(product)}
                    className="flex h-[65px] items-center justify-between gap-2 rounded-[6px] border border-[#d8dadd] bg-white pr-4 pl-3"
                  >
                    {/* API: dynamic data – product name */}
                    <span className="min-w-0 truncate font-lexend-deca text-[13px] leading-[19px] font-medium text-ink">
                      {product.name}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${product.name}`}
                      onClick={() => removeFromCompare(compareId(product))}
                      className="shrink-0 cursor-pointer"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M18 6 6 18M6 6l12 12" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              {remaining > 0 && (
                <>
                  <p className="mt-[19px] flex h-[63px] items-center rounded-[6px] border border-dashed border-[#b9bfc7] bg-[#f9fafb] px-3 font-lexend-deca text-[12px] leading-[17px] font-medium whitespace-pre text-[#626466]">
                    +{"  "}
                    {remaining === 1 ? "One place" : `${remaining} places`} remaining
                  </p>
                  <p className="mt-[19px] px-0.5 font-lexend-deca text-[11px] leading-4 text-[#626466]">
                    {remaining === 1 ? "Select Add to fill the final slot." : "Select Add to fill a slot."}
                  </p>
                </>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
