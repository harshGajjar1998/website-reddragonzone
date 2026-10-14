"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { productHref, type FilterGroup, type GamingCategory, type GamingProduct } from "@/data/gaming";
import ProductCard from "./ProductCard";

/** Page 1 shows 2 large + 3 small cards under the banner; later pages a 3×3 grid */
const FIRST_PAGE = 5;
const OTHER_PAGES = 9;
const SHOW_OPTIONS = [5, 9, 18];

type Sort = "featured" | "az" | "za";

/* ------------------------------------------------------------------
   Sidebar filters (Figma "Frame 98")
   ------------------------------------------------------------------ */

function FilterGroupBlock({
  group,
  selected,
  onToggle,
  last,
  office,
  idPrefix = "filter",
}: {
  group: FilterGroup;
  selected: Set<string>;
  onToggle: (option: string) => void;
  last: boolean;
  office: boolean;
  /** Keeps ids unique when the mobile filter sheet renders a second copy */
  idPrefix?: string;
}) {
  const [open, setOpen] = useState(!group.collapsed);
  const id = `${idPrefix}-${group.title.toLowerCase().replace(/\W+/g, "-")}`;

  return (
    <div
      role="group"
      aria-label={group.title}
      className={`flex w-full flex-col ${open ? "gap-4" : ""} ${last ? "" : "border-b border-ink/20 pb-6"}`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between"
      >
        <span className="font-lexend text-[18px] leading-none whitespace-nowrap text-ink">{group.title}</span>
        <Image
          src="/icons/gaming/filter-chevron.svg"
          alt=""
          width={20}
          height={20}
          className={`transition-transform ${open ? "-rotate-90" : "rotate-90"}`}
        />
      </button>

      {open && (
        <div
          id={id}
          className={group.columns === 2 ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}
        >
          {group.options.map((option) => {
            const checked = selected.has(option);
            return (
              <label key={option} className="flex cursor-pointer items-center gap-4">
                <input type="checkbox" checked={checked} onChange={() => onToggle(option)} className="peer sr-only" />
                {checked ? (
                  <Image src="/icons/gaming/checkbox-checked.svg" alt="" width={16} height={16} className="shrink-0" />
                ) : (
                  <span aria-hidden className={`size-4 shrink-0 border ${office ? "border-[#474747] bg-white" : "border-ink/80"}`} />
                )}
                <span
                  className={`font-lexend text-[16px] leading-none tracking-[-0.16px] whitespace-nowrap peer-focus-visible:underline ${
                    checked ? "text-[rgba(230,0,18,0.8)]" : "text-ink/80"
                  }`}
                >
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Toolbar controls
   ------------------------------------------------------------------ */

function ArrowDown() {
  // Material "keyboard_arrow_down" (M3/sys/light/on-surface)
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="pointer-events-none shrink-0">
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" fill="#1D1B20" />
    </svg>
  );
}

const toolbarText = "font-lexend-deca text-[16px] font-light leading-[1.2]";

/* ------------------------------------------------------------------
   Pagination (Figma "Pagination")
   ------------------------------------------------------------------ */

function Pagination({
  page,
  total,
  href,
  outlined,
  compact,
}: {
  page: number;
  total: number;
  href: (p: number) => string;
  /** Office: 1px black/37% outline on the white buttons */
  outlined: boolean;
  /** Mobile: black outlines, 12px gaps and "…" for skipped pages (first, last and neighbours shown) */
  compact?: boolean;
}) {
  const cell = `flex size-10 items-center justify-center rounded-[2px] font-lexend text-[16px] leading-[1.5] ${
    compact ? "shadow-[inset_0_0_0_1px_#000]" : outlined ? "shadow-[inset_0_0_0_1px_rgb(0_0_0/0.37)]" : ""
  }`;
  const all = Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "gap")[] = compact
    ? all
        .filter((p) => p === 1 || p === total || Math.abs(p - page) <= 1)
        .flatMap((p, i, kept) => (i > 0 && p - kept[i - 1] > 1 ? ["gap" as const, p] : [p]))
    : all;
  const arrow = (dir: "prev" | "next") => {
    const target = dir === "prev" ? page - 1 : page + 1;
    const disabled = target < 1 || target > total;
    const icon = (
      <Image
        src="/icons/gaming/page-next.svg"
        alt=""
        width={16}
        height={16}
        className={dir === "prev" ? "-scale-x-100" : ""}
      />
    );
    const label = dir === "prev" ? "Previous page" : "Next page";
    return disabled ? (
      <span aria-disabled className={`${cell} bg-white opacity-50`} aria-label={label}>
        {icon}
      </span>
    ) : (
      <Link href={href(target)} aria-label={label} className={`${cell} bg-white hover:bg-[#f0f0f0]`}>
        {icon}
      </Link>
    );
  };

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <ul className={`flex items-center ${compact ? "gap-3" : "gap-4"}`}>
        <li>{arrow("prev")}</li>
        {pages.map((p, i) =>
          p === "gap" ? (
            <li key={`gap-${i}`} aria-hidden className="w-[19px] text-center font-lexend text-[24px] leading-none text-black">
              …
            </li>
          ) : (
          <li key={p}>
            <Link
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              className={`${cell} ${p === page ? "bg-[#e60012] text-white" : "bg-white text-[#111] hover:bg-[#f0f0f0]"}`}
            >
              {p}
            </Link>
          </li>
          ),
        )}
        <li>{arrow("next")}</li>
      </ul>
    </nav>
  );
}

/** 171×168 mobile card with the name and tagline underneath (Figma "Rectangle 28" … "31"). */
function MobileProductCard({ product }: { product: GamingProduct }) {
  const office = product.range === "office";
  return (
    <Link href={productHref(product)} className="group block">
      <div
        className={`relative aspect-[171/168] overflow-hidden border-[1.2px] border-white ${office ? "bg-[#f6f6f6]" : "bg-white"}`}
      >
        <Image
          src={product.image.src}
          alt={product.name}
          fill
          sizes="45vw"
          className="object-contain p-[9%] transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <p className="absolute right-4 top-3 font-lexend text-[12px] uppercase leading-[1.2] text-ink">{product.keywords}</p>
      </div>
      <h3 className="mt-4 font-lexend text-[16px] font-medium uppercase leading-[1.2] tracking-[-0.16px] text-ink">
        {product.name}
      </h3>
      <p className="mt-1 font-lexend text-[12px] font-light capitalize leading-[14px] tracking-[0.72px] text-ink/75">
        {product.tagline}
      </p>
    </Link>
  );
}

/* ------------------------------------------------------------------
   Listing
   ------------------------------------------------------------------ */

type CategoryListingProps = {
  category: GamingCategory;
  products: GamingProduct[];
  page: number;
};

/** Figma "Desktop - 15" (category page) – filters, toolbar, product grid and pagination. */
export default function CategoryListing({ category, products, page }: CategoryListingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [show, setShow] = useState<number | null>(null);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeCount = Object.values(selected).reduce((n, set) => n + set.size, 0);

  // Lock page scroll behind the mobile filter sheet
  useEffect(() => {
    if (!filtersOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [filtersOpen]);

  const firstSize = show ?? FIRST_PAGE;
  const otherSize = show ?? OTHER_PAGES;

  const resetPage = () => {
    if (page !== 1) router.replace(pathname, { scroll: false });
  };

  const toggle = (group: string, option: string) => {
    setSelected((prev) => {
      const next = new Set(prev[group]);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return { ...prev, [group]: next };
    });
    resetPage();
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const active = Object.values(selected).filter((s) => s.size > 0);
    const list = products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)) &&
        active.every((set) => p.tags?.some((t) => set.has(t))),
    );
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [products, query, selected, sort]);

  const total = visible.length <= firstSize ? 1 : 1 + Math.ceil((visible.length - firstSize) / otherSize);
  const current = Math.min(Math.max(page, 1), total);
  const start = current === 1 ? 0 : firstSize + (current - 2) * otherSize;
  const pageItems = visible.slice(start, start + (current === 1 ? firstSize : otherSize));
  const large = current === 1 ? pageItems.slice(0, 2) : [];
  const small = current === 1 ? pageItems.slice(2) : pageItems;

  const href = (p: number) => (p === 1 ? pathname : `${pathname}?page=${p}`);
  const { listing } = category;
  const office = category.range === "office";

  const filterControls = (idPrefix?: string) => (
    <>
      <div className="flex items-end justify-between border-b border-[rgba(230,0,18,0.8)] pb-6 leading-none whitespace-nowrap">
        <p className="font-lexend text-[24px] font-medium tracking-[-0.24px] text-ink">Category</p>
        <button
          type="button"
          onClick={() => {
            setSelected({});
            resetPage();
          }}
          className="cursor-pointer font-lexend text-[16px] font-light text-[rgba(230,0,18,0.8)] hover:underline"
        >
          Clear
        </button>
      </div>
      {category.filters.map((group, i) => (
        <FilterGroupBlock
          key={group.title}
          idPrefix={idPrefix}
          group={group}
          selected={selected[group.title] ?? new Set()}
          office={office}
          onToggle={(o) => toggle(group.title, o)}
          last={i === category.filters.length - 1}
        />
      ))}
    </>
  );

  const sortSelect = (className: string) => (
    <select
      aria-label="Sort by"
      value={sort}
      onChange={(e) => setSort(e.target.value as Sort)}
      className={`h-full w-full cursor-pointer appearance-none bg-transparent outline-none ${className}`}
    >
      <option value="featured">Feature</option>
      <option value="az">Name A–Z</option>
      <option value="za">Name Z–A</option>
    </select>
  );

  return (
    <section className={office ? "bg-white" : "bg-silver-mobile lg:bg-silver"}>
      {/* ---------- Mobile (Figma "Mice Category" screen 2) ---------- */}
      <div className="mobile-frame px-4 pt-[46px] pb-12 lg:hidden">
        <p className="font-lexend-exa text-[14px] leading-[1.2] tracking-[-0.42px] text-ink">
          <span className="text-ink/70">{listing.breadcrumb.split(" / ")[0]} /</span>{" "}
          {listing.breadcrumb.split(" / ").slice(1).join(" / ")}
        </p>
        <h2 className="mt-3 font-lexend-giga text-[32px] font-bold leading-[1.1] tracking-[-2.56px] text-[rgba(230,0,18,0.8)]">
          {listing.title}
        </h2>
        <p className="mt-2 font-lexend text-[16px] font-light leading-6 text-ink/80">{listing.description}</p>

        <div className="mt-[27px] flex h-10 items-center justify-between">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setFiltersOpen(true)}
            className="flex h-10 w-[100px] cursor-pointer items-center justify-center gap-2.5 rounded-[4px] bg-ink font-outfit text-[12px] font-bold tracking-[1px] text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 2v4m0 4v4M8 2v6m0 4v2m5-12v2m0 4v6M1.5 8h3M6.5 10h3M11.5 6h3"
                stroke="#fff"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            Filters
            {activeCount > 0 && <span className="text-[rgba(230,0,18,1)]">({activeCount})</span>}
          </button>
          <label className="relative flex h-10 w-[103px] items-center rounded-[4px] border border-[#9f9e9e]">
            {sortSelect("pr-8 pl-4 font-lexend-deca text-[12px] text-ink")}
            <span className="pointer-events-none absolute right-2">
              <ArrowDown />
            </span>
          </label>
        </div>

        {current === 1 && listing.banner && (
          <div className="relative mt-4 aspect-[1536/708] w-full border border-ink/50">
            <Image src={listing.banner} alt={listing.title} fill sizes="(max-width: 640px) 100vw, 640px" className="object-cover" />
          </div>
        )}

        <ul className="mt-4 grid grid-cols-2 gap-x-[17px] gap-y-4">
          {pageItems.map((p) => (
            <li key={p.slug}>
              <MobileProductCard product={p} />
            </li>
          ))}
        </ul>
        {visible.length === 0 && (
          <p className="py-16 text-center font-lexend text-[16px] font-light text-ink/70">No products match your filters.</p>
        )}

        {total > 1 && (
          <div className="mt-8">
            <Pagination page={current} total={total} href={href} outlined compact />
          </div>
        )}

        {filtersOpen && (
          <div role="dialog" aria-modal="true" aria-label="Filters" className="fixed inset-0 z-50 flex flex-col bg-white">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink/10 px-4">
              <p className="font-lexend-deca text-[20px] font-medium text-ink">Filters</p>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="flex size-8 cursor-pointer items-center justify-center"
              >
                <Image src="/icons/close.svg" alt="" width={24} height={24} className="invert" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">{filterControls("filter-mobile")}</div>
            <div className="shrink-0 border-t border-ink/10 p-4">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="h-12 w-full cursor-pointer rounded-[4px] bg-crimson font-lexend-deca text-[16px] font-semibold uppercase tracking-[1px] text-white"
              >
                Show {visible.length} {visible.length === 1 ? "product" : "products"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="page-frame hidden min-h-[1680px] items-start gap-4 px-20 pt-20 pb-12 lg:flex">
        {/* ---------- Filters ---------- */}
        <aside
          aria-label="Filters"
          className="flex w-[308px] shrink-0 flex-col gap-4 border border-ink/40 px-[14px] py-4"
        >
          {filterControls()}
        </aside>

        {/* ---------- Results ---------- */}
        <div className="flex w-[956px] shrink-0 flex-col">
          <p className="font-lexend-exa text-[16px] font-semibold leading-[1.2] tracking-[-0.48px] whitespace-nowrap text-ink">
            {listing.breadcrumb}
          </p>
          <h2 className="mt-[5px] font-lexend-giga text-[40px] font-bold leading-none tracking-[-3.2px] whitespace-nowrap text-[rgba(230,0,18,0.8)]">
            {listing.title}
          </h2>
          <p className="mt-[10px] font-lexend text-[16px] font-light leading-[1.5] text-ink/80">{listing.description}</p>

          {/* Toolbar */}
          <div className="mt-5 flex h-10 items-center">
            <label
              className={`flex h-10 w-[360px] items-center justify-between rounded-[4px] border px-3 py-2 ${
                office ? "border-[#9f9e9e]" : "border-ink"
              }`}
            >
              <span className="sr-only">Search {category.label.toLowerCase()}</span>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPage();
                }}
                placeholder="Search"
                className={`w-full bg-transparent font-lexend-deca text-[14px] font-light leading-none text-ink outline-none placeholder:text-ink/70 ${office ? "placeholder:text-ink/80" : ""}`}
              />
              <Image src="/icons/gaming/search.svg" alt="" width={18} height={18} className="shrink-0" />
            </label>

            <label className="relative ml-auto flex h-10 w-[144px] items-center rounded-[4px] border border-[#9f9e9e]">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className={`h-full w-full cursor-pointer appearance-none bg-transparent pr-8 pl-2 outline-none ${toolbarText} ${office ? "text-ink" : "text-ink/70"}`}
              >
                <option value="featured">Feature</option>
                <option value="az">Name A–Z</option>
                <option value="za">Name Z–A</option>
              </select>
              <span className="absolute right-2">
                <ArrowDown />
              </span>
            </label>

            <label className="relative ml-3 flex h-10 w-[120px] items-center justify-center gap-1.5 px-2">
              <span className={`${toolbarText} ${office ? "text-ink" : "text-ink/70"}`}>Show</span>
              <select
                value={show ?? FIRST_PAGE}
                onChange={(e) => {
                  setShow(Number(e.target.value));
                  resetPage();
                }}
                className={`ml-2.5 w-11 cursor-pointer appearance-none bg-transparent pr-5 outline-none ${toolbarText} ${office ? "text-ink" : "text-ink/70"}`}
              >
                {SHOW_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0">
                <ArrowDown />
              </span>
            </label>
          </div>

          {/* Products */}
          <div className={`flex min-h-[1290px] flex-col gap-4 ${current === 1 ? "pt-5" : "pt-10"}`}>
            {current === 1 && listing.banner && (
              <div
                className={`relative h-[439px] w-[956px] shrink-0 border ${office ? "border-ink/50" : "border-white/50"}`}
              >
                <Image
                  src={listing.banner}
                  alt={listing.title}
                  fill
                  sizes="956px"
                  preload
                  className="object-cover"
                />
              </div>
            )}

            {large.length > 0 && (
              <div className="flex gap-4">
                {large.map((p) => (
                  <ProductCard key={p.slug} product={p} size="large" />
                ))}
              </div>
            )}

            {small.length > 0 && (
              <div className="grid grid-cols-[repeat(3,308px)] gap-4">
                {small.map((p) => (
                  <ProductCard key={p.slug} product={p} size="small" />
                ))}
              </div>
            )}

            {visible.length === 0 && (
              <p className="py-20 text-center font-lexend text-[16px] font-light text-ink/70">
                No products match your filters.
              </p>
            )}
          </div>

          {total > 1 && (
            <div className="mt-10 -ml-[324px] w-[1280px]">
              <Pagination page={current} total={total} href={href} outlined={office} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Reads `?page=` in the browser (static export has no server-side searchParams). Wrap in <Suspense>. */
export function CategoryListingFromUrl(props: Omit<CategoryListingProps, "page">) {
  const page = Math.max(1, Number(useSearchParams().get("page")) || 1);
  return <CategoryListing {...props} page={page} />;
}
