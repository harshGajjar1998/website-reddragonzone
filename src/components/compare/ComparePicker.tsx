"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { compareId, productLabels } from "@/data/compare";
import type { Catalogue, GamingProduct } from "@/data/gaming";
import { COMPARE_MAX, clearCompare, removeFromCompare, setCompareAt } from "@/lib/compare";

/* ------------------------------------------------------------------
   Compare page, steps 01–02 (Figma "SCREEN 01 · CONCEPT C", 3314:1770):
   pick a category, then up to three models from searchable dropdowns.
   ------------------------------------------------------------------ */

export type CompareCategory = { slug: string; label: string; noun: string; image: Tile };
type Tile = { src: string; width: number; height: number; className: string };

/** The three categories on the page (CMS category slugs, both ranges). Images and placement from Figma. */
export const COMPARE_CATEGORIES: CompareCategory[] = [
  {
    slug: "keyboards",
    label: "Keyboards",
    noun: "keyboard",
    image: { src: "/images/compare/category-keyboards.png", width: 482, height: 320, className: "object-contain opacity-85 lg:top-[-25px] lg:left-[184px] lg:h-[185px] lg:w-[190px]" },
  },
  {
    slug: "mice",
    label: "Mice",
    noun: "mouse",
    image: { src: "/images/home/mouse-m919.png", width: 1600, height: 1600, className: "object-cover lg:top-2 lg:left-[217px] lg:size-[156px]" },
  },
  {
    slug: "headsets",
    label: "Headsets",
    noun: "headset",
    image: { src: "/images/home/headset-h894.png", width: 1600, height: 1600, className: "object-cover opacity-85 lg:top-2 lg:left-[217px] lg:size-[156px]" },
  },
];

const step = "font-lexend-deca text-[13px] leading-none font-bold whitespace-pre text-ink";
const pad = (n: number) => String(n).padStart(2, "0");

/** Figma "RD COMPARISON / compact category tile": faded outline word, title, product photo; red border when picked. */
function CategoryTile({ category, active, onPick }: { category: CompareCategory; active: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onPick}
      className={`relative h-[120px] cursor-pointer overflow-hidden rounded-[6px] bg-[#f8f7f4] text-left lg:h-[172px] lg:w-[368px] ${
        active ? "border-2 border-[#e60012]" : "border border-[#c9c7c3] hover:border-ink/50"
      }`}
    >
      <span
        aria-hidden
        className="absolute top-[30px] -left-[11px] font-gotham text-[44px] leading-none font-black tracking-[0.03em] whitespace-nowrap text-[#bababa]/60 uppercase lg:top-[48px] lg:text-[64px] lg:leading-[77px]"
      >
        {category.label}
      </span>
      <span className="absolute top-[50px] left-4 font-lexend-deca text-[16px] leading-none font-bold text-ink uppercase lg:top-[74px] lg:left-6 lg:text-[19px]">
        {category.label}
      </span>
      <Image
        src={category.image.src}
        alt=""
        width={category.image.width}
        height={category.image.height}
        sizes="190px"
        className={`drop-thumb absolute top-[-6px] right-2 size-[130px] max-w-none lg:right-auto ${category.image.className}`}
      />
    </button>
  );
}

/** Figma "RD / Searchable model dropdown field" with its open state ("Open searchable dropdown"). */
function ModelField({
  index,
  selected,
  options,
  noun,
  disabled,
  open,
  onOpen,
  onClose,
}: {
  index: number;
  selected?: GamingProduct;
  options: GamingProduct[];
  noun: string;
  disabled: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const listId = useId();
  const optional = index === COMPARE_MAX - 1;

  // Clicking outside closes the list
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, onClose]);

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = options.filter((p) => {
    const text = `${p.name} ${p.slug} ${p.model ?? ""}`.toLowerCase();
    return words.every((w) => text.includes(w));
  });

  const choose = (product: GamingProduct) => {
    setCompareAt(index, compareId(product));
    setQuery("");
    onClose();
  };

  const value = selected ? productLabels(selected).title : disabled ? `Choose model ${pad(index)} first` : "Select a model";

  return (
    <div
      ref={box}
      className="relative lg:w-[288px]"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? onClose() : onOpen())}
        className="flex h-[72px] w-full cursor-pointer items-center justify-between rounded-[5px] border border-[#c9c9c9] bg-white pr-[21px] pl-[18px] text-left disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="min-w-0">
          <span className="block font-lexend-deca text-[11px] leading-none font-medium text-[#666]">
            MODEL {pad(index + 1)}
            {optional && "  /  OPTIONAL"}
          </span>
          <span className={`mt-[14px] block truncate font-lexend-deca text-[14px] leading-none font-medium ${selected ? "text-ink" : "text-[#999]"}`}>
            {value}
          </span>
        </span>
        <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M4 7.5 10 13l6-5.5" fill="none" stroke="#292929" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[77px] right-0 left-0 z-20 rounded-[5px] border border-[#c9c9c9] bg-white px-[14px] pt-[15px] pb-3 shadow-[0_12px_32px_rgb(0_0_0/0.08)]">
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${noun} model...`}
            aria-label={`Search ${noun} model`}
            className="h-6 w-full bg-transparent font-lexend-deca text-[12px] leading-none text-ink outline-none placeholder:text-[#999]"
          />
          <div aria-hidden className="mt-[5px] h-px bg-[#ddd]" />
          <ul id={listId} aria-label={`${noun} models`} className="max-h-[232px] overflow-y-auto overscroll-contain">
            {matches.map((p) => {
              const { title, model } = productLabels(p);
              return (
                <li key={compareId(p)} className="border-b border-[#ddd]">
                  <button
                    type="button"
                    onClick={() => choose(p)}
                    className="w-full cursor-pointer py-[13px] pl-px text-left font-lexend-deca text-[12px] leading-none font-medium whitespace-pre text-ink hover:text-[#e60012] focus-visible:text-[#e60012]"
                  >
                    {title === model ? model : `${title}   ·   ${model}`}
                  </button>
                </li>
              );
            })}
            {matches.length === 0 && (
              <li className="py-[13px] font-lexend-deca text-[12px] leading-none text-[#666]">No {noun} matches “{query}”.</li>
            )}
          </ul>
          {optional && !selected && (
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full cursor-pointer pl-px text-left font-lexend-deca text-[12px] leading-6 font-medium whitespace-pre text-[#e60012] hover:underline"
            >
              SKIP  ·  COMPARE TWO
            </button>
          )}
          {selected && (
            <button
              type="button"
              onClick={() => {
                removeFromCompare(compareId(selected));
                onClose();
              }}
              className="mt-3 w-full cursor-pointer pl-px text-left font-lexend-deca text-[12px] leading-6 font-medium text-[#666] hover:text-[#e60012]"
            >
              Clear this model
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Steps 01 (category) and 02 (models). `openField` lets the table's "Add a product" card open a field. */
export default function ComparePicker({
  catalogue,
  products,
  category,
  onCategory,
  openField,
  setOpenField,
}: {
  catalogue: Catalogue;
  products: GamingProduct[];
  category: CompareCategory;
  onCategory: (slug: string) => void;
  openField: number | null;
  setOpenField: (index: number | null) => void;
}) {
  const chosen = new Set(products.map(compareId));
  // API: dynamic data – every product in the picked category (gaming and office)
  const options = (catalogue.products as GamingProduct[])
    .filter((p) => p.category === category.slug && !chosen.has(compareId(p)))
    .sort((a, b) => a.name.localeCompare(b.name));

  const pick = (slug: string) => {
    if (slug === category.slug) return;
    // Models from another category can't share the table
    if (products.length) clearCompare();
    setOpenField(null);
    onCategory(slug);
  };

  return (
    <div>
      <p className={step}>01{"   "}CHOOSE A CATEGORY</p>
      <div role="radiogroup" aria-label="Category" className="mt-4 grid grid-cols-1 gap-3 lg:mt-[19px] lg:flex lg:gap-12">
        {COMPARE_CATEGORIES.map((c) => (
          <CategoryTile key={c.slug} category={c} active={c.slug === category.slug} onPick={() => pick(c.slug)} />
        ))}
      </div>

      <div aria-hidden className="mt-8 h-px bg-[#ddd]" />

      <p className={`mt-8 ${step}`}>02{"   "}SELECT YOUR {category.label.toUpperCase()}</p>
      <div className="mt-5 flex flex-col gap-3 lg:mt-[27px] lg:flex-row lg:items-center lg:gap-[25px]">
        <p className="font-lexend-deca text-[13px] leading-none font-bold text-[#666] lg:w-[222px]">MODEL SELECTORS</p>
        {Array.from({ length: COMPARE_MAX }, (_, i) => (
          <ModelField
            key={i}
            index={i}
            selected={products[i]}
            options={options}
            noun={category.noun}
            disabled={i > products.length}
            open={openField === i}
            onOpen={() => setOpenField(i)}
            onClose={() => setOpenField(null)}
          />
        ))}
      </div>
    </div>
  );
}
