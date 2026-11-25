"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CompareHero from "@/components/compare/CompareHero";
import ComparePicker, { COMPARE_CATEGORIES } from "@/components/compare/ComparePicker";
import { ButtonLink } from "@/components/ui/Button";
import { compareId, compareSections, compareSpecs, findCompareProduct, productLabels } from "@/data/compare";
import { productHref, type GamingProduct } from "@/data/gaming";
import { whereToBuyHref } from "@/data/pages";
import { COMPARE_MAX, removeFromCompare, useCompareReady, useCompareState } from "@/lib/compare";
import { useCatalogue } from "@/lib/catalogue";

const ORDINALS = ["FIRST", "SECOND", "THIRD"];
const COLUMNS = Array.from({ length: COMPARE_MAX }, (_, i) => i);
const pad = (n: number) => String(n).padStart(2, "0");

const attribute = "font-lexend-deca text-[14px] leading-[21px] font-semibold text-[#626466]";
const value = "font-lexend-deca text-[14px] leading-[21px] font-medium text-ink";
const sectionTitle = "font-lexend-deca text-[15px] leading-[21px] font-semibold text-ink";
const diffRow = "bg-[#fff5f5]";

type Sections = ReturnType<typeof compareSections>;

/** Figma "Product header": index, Remove, image, name, model and summary. */
function ProductHeader({ product, index }: { product: GamingProduct; index: number }) {
  const { catalogue } = useCatalogue();
  const { title, model } = productLabels(product);
  return (
    <div className="relative h-full rounded-[10px] border border-[#eaebed] bg-[#f9fafb] p-3 lg:h-[330px] lg:w-[288px] lg:p-0">
      <div className="flex items-center justify-between lg:contents">
        <p className="font-lexend-deca text-[12px] leading-[17px] font-semibold text-crimson lg:absolute lg:top-[17px] lg:left-[18px]">
          {pad(index + 1)} / {pad(COMPARE_MAX)}
        </p>
        <button
          type="button"
          aria-label={`Remove ${product.name}`}
          onClick={() => removeFromCompare(compareId(product))}
          className="flex cursor-pointer items-center gap-0.5 font-lexend-deca text-[12px] leading-[14px] font-medium text-[#626466] hover:text-crimson lg:absolute lg:top-[18px] lg:left-[206px]"
        >
          {/* Figma 3367:3019: 14 px cross */}
          <svg aria-hidden width="14" height="14" viewBox="0 0 14 14">
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Remove
        </button>
      </div>
      {/* API: dynamic data – product image, name, model and summary */}
      <div className="relative mt-2 h-[92px] lg:absolute lg:top-[52px] lg:left-[14px] lg:mt-0 lg:h-[170px] lg:w-[260px]">
        <Image src={product.image.src} alt={product.name} fill sizes="260px" className="rounded-[6px] object-contain" />
      </div>
      <p className="mt-2 font-lexend-deca text-[15px] leading-5 font-semibold text-ink lg:absolute lg:top-[231px] lg:left-[18px] lg:mt-0 lg:w-[250px] lg:truncate lg:text-[19px] lg:leading-[26px]">
        {title}
      </p>
      <p className="mt-1 font-lexend-deca text-[12px] leading-[18px] font-medium break-words text-[#626466] lg:absolute lg:top-[262px] lg:left-[18px] lg:mt-0 lg:text-[13px]">
        {model}
      </p>
      <p className="mt-1 font-lexend-deca text-[12px] leading-[18px] text-[#626466] lg:absolute lg:top-[288px] lg:left-[18px] lg:mt-0 lg:w-[250px] lg:truncate">
        {compareSpecs(catalogue, product).summary}
      </p>
    </div>
  );
}

/** Figma "Third product slot": dashed card that opens the Add a product modal. */
function AddSlot({ position, noun, onAdd }: { position: number; noun: string; onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex h-full min-h-[200px] w-full cursor-pointer flex-col justify-center rounded-[10px] border border-dashed border-[#c8cdd2] bg-[#f8f9fa] p-3 text-left lg:h-[330px] lg:w-[288px] lg:justify-start lg:px-[22px] lg:pt-[88px]"
    >
      <span aria-hidden className="font-lexend-deca text-[43px] leading-[60px] text-crimson">
        +
      </span>
      <span className="mt-0.5 font-lexend-deca text-[14px] leading-[22px] font-semibold text-ink lg:text-[16px]">
        ADD A {ORDINALS[position]} PRODUCT
      </span>
      <span className="mt-1 font-lexend-deca text-[12px] leading-[18px] text-[#626466] lg:mt-[21px] lg:text-[13px]">
        Choose another {noun} to expand this comparison.
      </span>
    </button>
  );
}

function VisitPage({ product }: { product: GamingProduct }) {
  return (
    <Link
      href={productHref(product)}
      className="inline-flex items-center gap-1 font-lexend-deca text-[12px] leading-5 font-semibold text-[#e11a2b] hover:underline"
    >
      Visit page
      <Image src="/images/pages/where-to-buy/icon-external.svg" alt="" width={20} height={20} />
      <span className="sr-only"> for {product.name}</span>
    </Link>
  );
}

function BuyButton({ product }: { product: GamingProduct }) {
  return (
    // API: dynamic data – Where to Buy link for this product
    <ButtonLink
      href={whereToBuyHref(product)}
      aria-label={`Where to Buy ${product.name}`}
      className="h-10 w-full font-lexend-deca text-[13px] leading-5 font-semibold tracking-[0.5px] lg:w-[200px] lg:text-[14px]"
    >
      Where to Buy
    </ButtonLink>
  );
}

const rowGrid = "grid h-[72px] grid-cols-[230px_312px_312px_264px] border-b border-[#e6e8eb] pt-[22px] pl-7";

/** Desktop table (Figma "Side-by-side comparison table", 1200px). */
function DesktopTable({
  products,
  sections,
  noun,
  onAdd,
}: {
  products: GamingProduct[];
  sections: Sections;
  noun: string;
  onAdd: (column: number) => void;
}) {
  return (
    <div className="relative mt-[38px] hidden rounded-[14px] border border-[#e3e5e8] bg-white pb-[49px] lg:block">
      <p className="absolute top-10 left-7 font-lexend-deca text-[13px] leading-[18px] font-semibold text-[#626466]">
        SPECIFICATIONS
      </p>
      <div className="flex gap-[25px] pt-[29px] pl-[246px]">
        {COLUMNS.map((column) =>
          products[column] ? (
            <ProductHeader key={compareId(products[column])} product={products[column]} index={column} />
          ) : (
            <AddSlot key={column} position={column} noun={noun} onAdd={() => onAdd(column)} />
          ),
        )}
      </div>
      <div aria-hidden className="mx-[25px] mt-4 h-px bg-[#e6e8eb]" />

      {sections.map((section, i) => (
        <section key={section.title}>
          <h2 className={`${sectionTitle} ml-7 pb-[23px] ${i === 0 ? "pt-[29px]" : "pt-[33px]"}`}>{section.title}</h2>
          {/* API: dynamic data – specification rows; rows that differ are highlighted */}
          {section.rows.map((row) => (
            <div key={row.label} className={`${rowGrid} ${row.differs ? diffRow : ""}`}>
              <p className={attribute}>{row.label}</p>
              {COLUMNS.map((column) => (
                <p key={column} className={`${value} w-[264px]`}>
                  {row.values[column] ?? "—"}
                </p>
              ))}
            </div>
          ))}
        </section>
      ))}

      <div className={rowGrid}>
        <p className={attribute}>Page links</p>
        {COLUMNS.map((column) => (
          <div key={column}>{products[column] ? <VisitPage product={products[column]} /> : <p className={value}>—</p>}</div>
        ))}
      </div>
      <div className={`${rowGrid} !pt-4`}>
        <p className={`${attribute} pt-1.5`}>Where to buy</p>
        {COLUMNS.map((column) => (
          <div key={column}>{products[column] ? <BuyButton product={products[column]} /> : <p className={`${value} pt-1.5`}>—</p>}</div>
        ))}
      </div>
    </div>
  );
}

/** Mobile: two products on screen, swipe for the third. Labels stay put while the columns scroll. */
function MobileTable({
  products,
  sections,
  noun,
  onAdd,
}: {
  products: GamingProduct[];
  sections: Sections;
  noun: string;
  onAdd: (column: number) => void;
}) {
  const cell = "snap-start border-b border-[#e6e8eb] px-3 pb-3";
  // The track is 150% wide, so the labels are sized back to the visible width
  const label = (text: string) => (
    <div className="col-span-3">
      <p className={`${attribute} sticky left-0 w-2/3 px-3 pt-3 pb-1 text-[13px]`}>{text}</p>
    </div>
  );

  return (
    <div className="mt-6 overflow-hidden rounded-[14px] border border-[#e3e5e8] bg-white lg:hidden">
      <div className="snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid w-[150%] grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column} className="snap-start p-1.5">
              {products[column] ? (
                <ProductHeader product={products[column]} index={column} />
              ) : (
                <AddSlot position={column} noun={noun} onAdd={() => onAdd(column)} />
              )}
            </div>
          ))}

          {sections.map((section) => (
            <div key={section.title} className="col-span-3 grid grid-cols-subgrid">
              <div className="col-span-3 border-t border-[#e6e8eb]">
                <h2 className={`${sectionTitle} sticky left-0 w-2/3 px-3 pt-4 pb-1 text-[14px]`}>{section.title}</h2>
              </div>
              {/* API: dynamic data – specification rows; rows that differ are highlighted */}
              {section.rows.map((row) => (
                <div key={row.label} className={`col-span-3 grid grid-cols-subgrid ${row.differs ? diffRow : ""}`}>
                  {label(row.label)}
                  {COLUMNS.map((column) => (
                    <p key={column} className={`${cell} ${value} text-[13px] leading-[18px]`}>
                      {row.values[column] ?? "—"}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {label("Page links")}
          {COLUMNS.map((column) => (
            <div key={column} className={cell}>
              {products[column] ? <VisitPage product={products[column]} /> : <p className={value}>—</p>}
            </div>
          ))}
          {label("Where to buy")}
          {COLUMNS.map((column) => (
            <div key={column} className="snap-start px-3 pb-4">
              {products[column] ? <BuyButton product={products[column]} /> : <p className={value}>—</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Compare page (Figma "SCREEN 01 · CONCEPT C", 3314:1757): "Perfect Match" hero, step 01 category,
 * step 02 up to three searchable model fields, then the side-by-side table on the same page.
 */
export default function CompareView() {
  const ready = useCompareReady();
  const { ids } = useCompareState();
  const [picked, setPicked] = useState<string | null>(null);
  const [openField, setOpenField] = useState<number | null>(null);

  // API: dynamic data – selected products
  const { catalogue, loaded } = useCatalogue();
  const products = ids.map((id) => findCompareProduct(catalogue, id)).filter((p) => p !== undefined);

  // The selected products' category wins (they may come from a category page's Compare boxes)
  const category =
    COMPARE_CATEGORIES.find((c) => c.slug === products[0]?.category) ??
    COMPARE_CATEGORIES.find((c) => c.slug === picked) ??
    COMPARE_CATEGORIES[0];
  const sections = compareSections(catalogue, products);
  const props = { products, sections, noun: category.noun, onAdd: (column: number) => setOpenField(Math.min(column, products.length)) };

  // Opening a field from the table scrolls the pickers into view
  const pickers = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (openField !== null) pickers.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [openField]);

  return (
    <>
      <CompareHero />
      <section className="bg-[#f8f8f8]">
        <div className="page-frame px-4 pt-10 pb-12 lg:px-[120px] lg:pt-[58px] lg:pb-16">
          <p className="font-lexend-deca text-[12px] leading-none font-bold whitespace-pre text-[#e60012]">
            PERFECT MATCH{"  /  "}COMPARE YOUR GEAR
          </p>
          <h2 className="mt-4 font-lexend-deca text-[32px] leading-none font-bold text-ink lg:mt-[22px] lg:text-[45px]">
            Compare your favorites.
          </h2>
          <p className="mt-4 font-lexend-deca text-[15px] leading-[1.4] text-[#666] lg:mt-[28px] lg:leading-none">
            Choose a category, search or select your models, then compare. The third product is optional.
          </p>

          <div ref={pickers} className="mt-8 lg:mt-[30px]">
            {ready && loaded ? (
              <ComparePicker
                catalogue={catalogue}
                products={products}
                category={category}
                onCategory={setPicked}
                openField={openField}
                setOpenField={setOpenField}
              />
            ) : (
              <div className="h-[420px]" />
            )}
          </div>

          {/* Room for the open model list, and a hint, before anything is picked */}
          {products.length === 0 && (
            <p className="mt-10 flex h-60 items-center justify-center rounded-[14px] border border-dashed border-[#c8cdd2] bg-white px-6 text-center font-lexend-deca text-[14px] leading-[1.5] text-[#626466]">
              Pick a model above to start. The specifications appear here, side by side.
            </p>
          )}
          {products.length > 0 && (
            <>
              <DesktopTable {...props} />
              <MobileTable {...props} />
              <p className="mt-3 text-center font-lexend-deca text-[12px] leading-[18px] text-[#626466] lg:hidden">
                Swipe the table to see all three columns
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
