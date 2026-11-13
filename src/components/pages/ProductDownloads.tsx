"use client";

import { useChrome } from "@/components/layout/ChromeProvider";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import SegmentedControl from "@/components/ui/SegmentedControl";
import {
  findSupportProduct,
  supportSearchHref,
  type DownloadGroup,
  type DownloadOs,
  type DownloadRelease,
  type SupportProduct,
} from "@/data/pages";

const OS_OPTIONS: { value: DownloadOs; label: string }[] = [
  { value: "windows", label: "Windows" },
  { value: "mac", label: "Mac" },
];

const SEARCH_HREF = "/support/";
const ALL_PRODUCTS_HREF = "/support/#products";

const textAction = "font-lexend-deca text-[16px] leading-5 font-medium text-crimson underline";
const primaryButton =
  "flex h-[50px] items-center justify-center rounded-[4px] bg-crimson px-6 font-lexend-deca text-[16px] leading-5 font-semibold tracking-[1px] text-white uppercase transition-colors hover:bg-[#bc1018]";

export const osNames = (os: DownloadOs[]) =>
  os.map((value) => OS_OPTIONS.find((option) => option.value === value)?.label).join(" / ");

const noSubscribe = () => () => {};
export const detectOs = (): DownloadOs => (/Macintosh/.test(navigator.userAgent) ? "mac" : "windows");

/** Breadcrumb and page title (Figma "Search results introduction"). */
function Intro({ showReturn }: { showReturn?: boolean }) {
  return (
    <section className="bg-white">
      <div className="page-frame flex flex-col gap-6 px-6 pt-6 pb-8 lg:gap-8 lg:px-20 lg:pt-8 lg:pb-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 font-lexend-deca text-[14px] leading-[18px]">
          <Link href={SEARCH_HREF} className="text-crimson">
            Support
          </Link>
          <span aria-hidden className="text-[#666666]">
            /
          </span>
          <span aria-current="page" className="text-ink">
            Search Results
          </span>
        </nav>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 lg:gap-3">
            <p className="font-lexend-deca text-[18px] leading-[23px] text-crimson lg:text-[22px] lg:leading-7">Support</p>
            <h1 className="font-lexend-exa text-[28px] leading-[35px] font-black tracking-[-2.24px] text-ink lg:text-[40px] lg:leading-[50px] lg:tracking-[-3.2px]">
              Product downloads
            </h1>
          </div>
          {showReturn && (
            <Link href={SEARCH_HREF} className={textAction}>
              Return to search
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/** Product render at the same crop as the Support download cards. */
function ProductArt({ product }: { product: SupportProduct }) {
  const { image, name } = product;
  return (
    <div
      className="relative w-full max-w-[360px] shrink-0 overflow-hidden lg:w-[280px] xl:w-[360px]"
      style={{ aspectRatio: `274 / ${image.box.h}` }}
    >
      {image.crop ? (
        <Image
          src={image.src}
          alt={name}
          width={image.width}
          height={image.height}
          sizes="360px"
          className="absolute max-w-none"
          style={{
            width: `${image.crop.w}%`,
            height: `${image.crop.h}%`,
            left: `${image.crop.left}%`,
            top: `${image.crop.top}%`,
          }}
        />
      ) : (
        <Image src={image.src} alt={name} fill sizes="360px" className={image.contain ? "object-contain" : "object-cover"} />
      )}
    </div>
  );
}

/** Selected product band (Figma "Selected product"). */
function ProductBand({ product, found }: { product: SupportProduct; found?: boolean }) {
  return (
    <section className="bg-silver">
      <div className="page-frame flex flex-col items-center gap-6 px-6 py-6 lg:h-[286.47px] lg:flex-row lg:gap-8 lg:px-20 xl:gap-16">
        <ProductArt product={product} />
        {/* API: dynamic data – product category, name and model */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-2 lg:gap-3">
          <p className="font-lexend-deca text-[14px] leading-[18px] text-crimson">{product.category}</p>
          <h2 className="font-lexend-exa text-[26px] leading-[33px] font-black tracking-[-1.3px] text-ink lg:text-[32px] lg:leading-10 lg:tracking-[-1.6px]">
            {product.name}
          </h2>
          <p className="font-lexend-deca text-[18px] leading-[23px] text-ink">{product.model}</p>
        </div>
        {found && (
          <div className="flex w-full shrink-0 flex-col gap-2 lg:w-[230px]">
            <p className="font-lexend-deca text-[16px] leading-5 font-medium text-ink">Product found</p>
            <p className="font-lexend-deca text-[14px] leading-[1.5] text-[#666666]">
              Choose an operating system to view product downloads.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/** Red Download button (Figma "Support/Download button"). */
export function DownloadLink({ release, full }: { release: DownloadRelease; full?: boolean }) {
  return (
    // API: dynamic data – file URL
    <a href={release.href} className={`${primaryButton} w-full shrink-0 ${full ? "" : "lg:w-[200px]"}`}>
      Download
    </a>
  );
}

/** One older release inside "Previous versions" (Figma "Older sample release"). */
function OlderRelease({ release }: { release: DownloadRelease }) {
  return (
    <div className="flex flex-col gap-4 p-5">
      <p className="font-lexend-deca text-[14px] leading-[18px] font-medium text-ink">
        {release.version} • {release.sample ? "Sample date" : "Date"}: {release.date}
      </p>
      <p className="font-lexend-deca text-[14px] leading-[1.5] text-[#666666]">
        What’s changed{release.sample && " (sample)"}: {release.notes} OS: {osNames(release.os)}.
      </p>
      {release.sample && (
        <p className="font-lexend-deca text-[12px] leading-[15px] text-crimson">
          Illustrative placeholders only — not release information.
        </p>
      )}
      <DownloadLink release={release} />
    </div>
  );
}

/** "Previous versions" toggle (Figma "Support/Previous versions"). */
export function PreviousVersions({ releases }: { releases: DownloadRelease[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-[52px] w-full cursor-pointer items-center justify-between border-t border-[#d6d6d6] font-lexend-deca text-[14px] leading-[18px] text-ink"
      >
        Previous versions
        <Image src={open ? "/icons/pages/chevron-up.svg" : "/icons/pages/chevron-down.svg"} alt="" width={18} height={18} />
      </button>
      {open && (
        // API: dynamic data – older releases for the chosen OS
        <div>
          {releases.map((release) => (
            <OlderRelease key={`${release.version}-${release.date}`} release={release} />
          ))}
        </div>
      )}
    </div>
  );
}

/** One download type with its latest release (Figma "Download group"). */
function Group({ group, releases }: { group: DownloadGroup; releases: DownloadRelease[] }) {
  const [latest, ...older] = releases;
  return (
    <div id={group.type} className="flex scroll-mt-6 flex-col gap-4 lg:flex-row lg:gap-10">
      <div className="flex shrink-0 flex-col gap-2 lg:w-[240px] lg:gap-3 lg:pt-6">
        <h3 className="font-lexend-deca text-[22px] leading-7 font-semibold text-ink lg:text-[24px] lg:leading-[30px]">
          {group.title}
        </h3>
        <p className="font-lexend-deca text-[14px] leading-[1.5] text-[#666666]">{group.description}</p>
      </div>
      <div className={`flex min-w-0 flex-1 flex-col gap-5 bg-[#f6f6f6] px-5 pt-5 lg:px-8 lg:pt-6 ${older.length ? "" : "pb-5 lg:pb-6"}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
          {/* API: dynamic data – version, release date, OS and "what changed" note */}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="font-lexend-deca text-[18px] leading-[23px] font-semibold text-ink">{latest.version}</p>
              <p className="font-lexend-deca text-[12px] leading-[15px] font-medium text-crimson">
                LATEST{latest.sample && " · SAMPLE"}
              </p>
            </div>
            <p className="font-lexend-deca text-[14px] leading-[18px] whitespace-pre-wrap text-[#666666]">
              Release date{latest.sample && " (sample)"}: {latest.date}
              <span className="hidden sm:inline">{"     •     "}</span>
              <span className="block sm:inline">OS: {osNames(latest.os)}</span>
            </p>
            <p className="font-lexend-deca text-[14px] leading-[1.5] text-ink">
              What’s changed{latest.sample && " (sample)"}: {latest.notes}
            </p>
          </div>
          <DownloadLink release={latest} />
        </div>
        {older.length > 0 && <PreviousVersions releases={older} />}
      </div>
    </div>
  );
}

/** Figma "Download results": OS switch, grouped downloads and the search prompt. */
function Results({ product }: { product: SupportProduct }) {
  // Pre-selected from the visitor's computer until they choose; the server render assumes Windows
  const detected = useSyncExternalStore(noSubscribe, detectOs, () => "windows" as DownloadOs);
  const [chosen, setChosen] = useState<DownloadOs | null>(null);
  const os = chosen ?? detected;

  // Card links such as #manual: the groups only exist after the client render, so scroll here
  useEffect(() => {
    if (window.location.hash) document.querySelector(window.location.hash)?.scrollIntoView();
  }, []);

  // API: dynamic data – downloads for this product, filtered by operating system
  const groups = product.downloads
    .map((group) => ({ group, releases: group.releases.filter((release) => release.os.includes(os)) }))
    .filter(({ releases }) => releases.length > 0);

  return (
    <section className="bg-white">
      <div className="page-frame flex flex-col gap-8 px-6 pt-10 pb-12 lg:px-20 lg:pt-12 lg:pb-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-lexend-deca text-[24px] leading-[30px] font-medium text-ink lg:text-[28px] lg:leading-[35px]">
              Downloads
            </h2>
            <p className="font-lexend-deca text-[14px] leading-[18px] text-[#666666]">Select your operating system</p>
          </div>
          <SegmentedControl
            label="Operating system"
            options={OS_OPTIONS}
            value={os}
            onChange={setChosen}
            className="w-full lg:w-[320px]"
          />
        </div>

        {groups.length > 0 ? (
          <div className="flex flex-col gap-8 lg:gap-7">
            {groups.map(({ group, releases }) => (
              <Group key={group.type} group={group} releases={releases} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center font-lexend-deca text-[16px] text-[#666666]">
            No downloads for this operating system.
          </p>
        )}

        <div aria-hidden className="h-px bg-[#d6d6d6]" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-lexend-deca text-[16px] leading-5 text-ink">Looking for a different product?</p>
          <Link href={ALL_PRODUCTS_HREF} className={textAction}>
            Browse all products
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Figma "No downloads message". */
function NoDownloads() {
  return (
    <section className="bg-white">
      <div className="page-frame flex flex-col items-center gap-6 px-6 pt-12 pb-14 text-center lg:px-20 lg:pt-16 lg:pb-20">
        <h3 className="font-lexend-exa text-[24px] leading-[30px] font-black tracking-[-1.2px] text-ink lg:text-[32px] lg:leading-10 lg:tracking-[-1.6px]">
          No downloads available
        </h3>
        <p className="w-full max-w-[660px] font-lexend-deca text-[16px] leading-[1.6] text-[#666666]">
          There are no drivers, firmware, software or manuals listed for this product. Check the product name and model,
          or return to search for another product.
        </p>
        <div className="flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:gap-8">
          <Link href={SEARCH_HREF} className={`${primaryButton} w-full sm:w-[260px]`}>
            Return to search
          </Link>
          <Link href={ALL_PRODUCTS_HREF} className={textAction}>
            Browse all products
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Figma "Product not found": illustration and a new search. */
function ProductNotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(supportSearchHref(query.trim()));
  };

  return (
    <section className="bg-silver">
      <div className="page-frame flex flex-col items-center gap-6 px-6 py-12 text-center lg:px-20 lg:py-16">
        <Image
          src="/images/pages/support/results/product-not-found.png"
          alt=""
          width={512}
          height={512}
          sizes="256px"
          className="size-[180px] lg:size-64"
        />
        <h2 className="font-lexend-exa text-[28px] leading-[35px] font-black tracking-[-2.24px] text-ink lg:text-[40px] lg:leading-[50px] lg:tracking-[-3.2px]">
          Product not found
        </h2>
        <p className="w-full max-w-[620px] font-lexend-deca text-[16px] leading-[1.6] text-[#666666]">
          We couldn’t find a matching product. Check the spelling or try the model number printed on your product label.
        </p>
        <form onSubmit={onSubmit} className="flex w-full max-w-[640px] flex-col gap-3 pt-3 pb-2 text-left">
          <label htmlFor="product-search" className="font-lexend-deca text-[14px] leading-[18px] font-medium text-ink">
            Product name or model
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[18px]">
            <div className="flex h-[50px] min-w-0 items-center gap-3 rounded-[4px] border border-ink px-5 sm:flex-1">
              <input
                id="product-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product name or model"
                className="w-full bg-transparent font-lexend-deca text-[16px] leading-5 text-ink outline-none placeholder:text-[#666666]"
              />
              <Image src="/icons/pages/search.svg" alt="" width={18} height={18} className="shrink-0" />
            </div>
            <button type="submit" className={`${primaryButton} w-full cursor-pointer sm:w-[200px]`}>
              Find
            </button>
          </div>
        </form>
        <Link href={ALL_PRODUCTS_HREF} className={textAction}>
          Browse all products
        </Link>
      </div>
    </section>
  );
}

/** Firmware & Software Finder: picks the results, no-downloads or not-found view from ?q=. */
export default function ProductDownloads() {
  const query = useSearchParams().get("q") ?? "";
  // API: dynamic data – product lookup by search term or slug
  const product = findSupportProduct(useChrome().catalogue, query);

  if (!product) {
    return (
      <>
        <Intro />
        <ProductNotFound key={query} />
      </>
    );
  }

  if (product.downloads.length === 0) {
    return (
      <>
        <Intro />
        <ProductBand product={product} />
        <NoDownloads />
      </>
    );
  }

  return (
    <>
      <Intro showReturn />
      <ProductBand product={product} found />
      <Results key={product.slug} product={product} />
    </>
  );
}
