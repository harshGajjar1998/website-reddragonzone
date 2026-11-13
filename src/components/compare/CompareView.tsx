"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddProductModal from "@/components/compare/AddProductModal";
import { ButtonLink } from "@/components/ui/Button";
import { useChrome } from "@/components/layout/ChromeProvider";
import { categoryOf, compareId, compareSections, compareSpecs, findCompareProduct, productLabels } from "@/data/compare";
import { categoryHref, productHref, rangeOf, type GamingProduct } from "@/data/gaming";
import { whereToBuyHref } from "@/data/pages";
import { COMPARE_MAX, removeFromCompare, useCompareReady, useCompareState } from "@/lib/compare";

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
  const { catalogue } = useChrome();
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
          className="cursor-pointer font-lexend-deca text-[12px] leading-[17px] font-medium whitespace-pre text-[#626466] hover:text-crimson lg:absolute lg:top-4 lg:left-[194px]"
        >
          ×{"  "}Remove
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
  onAdd: () => void;
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
            <AddSlot key={column} position={column} noun={noun} onAdd={onAdd} />
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
  onAdd: () => void;
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
                <AddSlot position={column} noun={noun} onAdd={onAdd} />
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

/** Compare page (Figma "Compare Keyboards · Two / Three Products"). */
export default function CompareView() {
  const router = useRouter();
  const ready = useCompareReady();
  const { ids, returnTo } = useCompareState();
  const [adding, setAdding] = useState(false);

  // API: dynamic data – selected products
  const { catalogue } = useChrome();
  const products = ids.map((id) => findCompareProduct(catalogue, id)).filter((p) => p !== undefined);
  const empty = ready && products.length === 0;

  // Removing the last product returns to the page the comparison was opened from
  useEffect(() => {
    if (empty) router.replace(returnTo ?? "/gaming/");
  }, [empty, returnTo, router]);

  if (products.length === 0) return <div className="min-h-[600px] bg-[#f7f8fa]" />;

  const first = products[0];
  const category = categoryOf(catalogue, first);
  const sameCategory = products.every((p) => p.category === first.category && p.range === first.range);
  const range = rangeOf(first);
  const label = sameCategory && category ? category.label : "Products";
  const noun = label.toLowerCase().replace("mice", "mouse").replace(/s$/, "");
  const sections = compareSections(catalogue, products);
  const count = `${products.length} PRODUCT${products.length > 1 ? "S" : ""} SELECTED`;
  const props = { products, sections, noun, onAdd: () => setAdding(true) };

  return (
    <section className="bg-[#f7f8fa]">
      <div className="page-frame px-4 pt-6 pb-10 lg:px-[120px] lg:pt-[38px] lg:pb-20">
        <nav aria-label="Breadcrumb" className="font-lexend-deca text-[13px] leading-[18px] font-semibold whitespace-pre text-crimson uppercase">
          <Link href={range.base}>{range.label}</Link>
          {"  /  "}
          {sameCategory && category && (
            <>
              <Link href={categoryHref(category)}>{category.label}</Link>
              {"  /  "}
            </>
          )}
          <span aria-current="page">Compare</span>
        </nav>
        <h1 className="mt-3 font-lexend-deca text-[32px] leading-10 font-semibold text-ink lg:mt-5 lg:text-[47px] lg:leading-[62px]">
          Compare {label}
        </h1>
        <p className="mt-3 font-lexend-deca text-[15px] leading-[23px] text-[#626466] lg:mt-[19px] lg:text-[16px] lg:leading-[25px]">
          Review the differences between selected {label.toLowerCase()} before choosing the right fit.
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 lg:mt-[38px]">
          <Link
            href={returnTo ?? (category ? categoryHref(category) : range.base)}
            className="font-lexend-deca text-[15px] leading-[21px] font-medium whitespace-pre text-crimson"
          >
            ←{"  "}Back to {label}
          </Link>
          <p className="font-lexend-deca text-[12px] leading-[18px] font-semibold text-[#626466] lg:w-[235px] lg:text-[13px]">
            {count}
          </p>
        </div>

        <DesktopTable {...props} />
        <MobileTable {...props} />
        <p className="mt-3 text-center font-lexend-deca text-[12px] leading-[18px] text-[#626466] lg:hidden">
          Swipe the table to see all three columns
        </p>
      </div>
      {adding && <AddProductModal onClose={() => setAdding(false)} />}
    </section>
  );
}
