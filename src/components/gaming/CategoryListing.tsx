"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { FilterGroup, GamingCategory, GamingProduct } from "@/data/gaming";
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
}: {
  group: FilterGroup;
  selected: Set<string>;
  onToggle: (option: string) => void;
  last: boolean;
  office: boolean;
}) {
  const [open, setOpen] = useState(!group.collapsed);
  const id = `filter-${group.title.toLowerCase().replace(/\W+/g, "-")}`;

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
}: {
  page: number;
  total: number;
  href: (p: number) => string;
  /** Office: 1px black/37% outline on the white buttons */
  outlined: boolean;
}) {
  const cell = `flex size-10 items-center justify-center rounded-[2px] font-lexend text-[16px] leading-[1.5] ${
    outlined ? "shadow-[inset_0_0_0_1px_rgb(0_0_0/0.37)]" : ""
  }`;
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
      <ul className="flex gap-4">
        <li>{arrow("prev")}</li>
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <Link
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              className={`${cell} ${p === page ? "bg-[#e60012] text-white" : "bg-white text-[#111] hover:bg-[#f0f0f0]"}`}
            >
              {p}
            </Link>
          </li>
        ))}
        <li>{arrow("next")}</li>
      </ul>
    </nav>
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

  return (
    <section className={office ? "bg-white" : "bg-silver"}>
      <div className="page-frame flex min-h-[1680px] items-start gap-4 px-20 pt-20 pb-12">
        {/* ---------- Filters ---------- */}
        <aside
          aria-label="Filters"
          className="flex w-[308px] shrink-0 flex-col gap-4 border border-ink/40 px-[14px] py-4"
        >
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
              group={group}
              selected={selected[group.title] ?? new Set()}
              office={office}
              onToggle={(o) => toggle(group.title, o)}
              last={i === category.filters.length - 1}
            />
          ))}
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
