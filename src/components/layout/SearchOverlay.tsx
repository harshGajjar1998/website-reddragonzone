"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useChrome } from "./ChromeProvider";

/** Dims the part of `text` that matches the query, as in the design ("wireless keyboard"). */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const at = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-white/70">{text.slice(at, at + q.length)}</span>
      {text.slice(at + q.length)}
    </>
  );
}

const heading = "absolute font-lexend-giga text-[24px] leading-[1.2] whitespace-nowrap text-white";
const fade =
  "transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
const listLink =
  "font-lexend-deca text-[20px] font-light leading-[1.2] whitespace-nowrap text-white transition-opacity hover:opacity-80";

/**
 * Search overlay – Figma frame "Search" (1440×720). Covers the hello bar and the
 * main navigation, then drops a 608px results panel below them.
 */
export default function SearchOverlay({
  open,
  onClose,
}: {
  /** false while the overlay fades out after closing */
  open: boolean;
  onClose: () => void;
}) {
  const { search } = useChrome();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (matchMedia("(min-width: 1024px)").matches ? inputRef : mobileInputRef).current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const searchHref = `/search?q=${encodeURIComponent(query.trim())}`;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(searchHref);
  };

  return (
    <>
      {/* Mobile: full-screen sheet, same content stacked in one column (no Figma frame for this state) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        inert={!open}
        className={`fixed inset-0 z-50 overflow-y-auto bg-graphite ${fade} starting:-translate-y-3 starting:opacity-0 lg:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <div className="sticky top-0 flex h-16 items-center gap-3 bg-charcoal px-4">
          <form role="search" onSubmit={submit} className="flex h-10 min-w-0 flex-1 items-center rounded-[10px] shadow-[inset_0_0_0_1px_#c5c5c7]">
            <input
              ref={mobileInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search products"
              className="h-full min-w-0 flex-1 bg-transparent pl-3 font-inter text-[16px] text-[#b7b7b7] outline-none placeholder:text-[#b7b7b7]/70 [&::-webkit-search-cancel-button]:hidden"
            />
            <button type="submit" aria-label="Search" className="relative h-[38px] w-12 shrink-0 cursor-pointer">
              <Image src="/icons/search-tag.svg" alt="" width={48} height={38} className="absolute inset-0" />
              <Image src="/icons/search-tag-icon.svg" alt="" width={19} height={19} className="absolute left-[19px] top-[10px]" />
            </button>
          </form>
          <button type="button" aria-label="Close search" onClick={onClose} className="flex shrink-0 cursor-pointer items-center">
            <Image src="/icons/close.svg" alt="" width={24} height={24} />
          </button>
        </div>

        <div className="flex flex-col gap-8 px-4 pt-6 pb-10">
          <section className="flex flex-col gap-4">
            <p className="font-lexend-giga text-[20px] leading-[1.2] text-white">Suggestions</p>
            <ul className="flex flex-col gap-4">
              {/* API: dynamic data – search suggestions */}
              {search.suggestions.map((s) => (
                <li key={s}>
                  <Link href={`/search?q=${encodeURIComponent(s)}`} onClick={onClose} className={`${listLink} text-[18px]`}>
                    <Highlight text={s} query={query} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4">
            <p className="font-lexend-giga text-[20px] leading-[1.2] text-white">Products</p>
            <ul className="flex flex-col gap-3">
              {/* API: dynamic data – search results – products */}
              {search.products.map((p, i) => (
                <li key={`${p.href}-${i}`}>
                  <Link
                    href={p.href}
                    onClick={onClose}
                    className="flex h-28 items-center justify-between gap-3 rounded-[16px] bg-charcoal py-3 pr-4 pl-3"
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={186}
                      height={p.imageHeight}
                      className="h-auto w-[45%] max-w-[186px] shrink-0 drop-search-product"
                    />
                    <span className="flex flex-col items-end gap-1.5 text-right">
                      <span className="font-lexend-deca text-[16px] leading-[1.2] text-white">{p.name}</span>
                      <span className="flex items-center gap-2 font-lexend text-[14px] font-light leading-[1.2]">
                        <span className="text-white/70">{p.category}</span>
                        <span aria-hidden className="h-4 w-px bg-white" />
                        <span className="text-dragon">{p.line}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4">
            <p className="font-lexend-giga text-[20px] leading-[1.2] text-white">Pages</p>
            <ul className="flex flex-col gap-4">
              {/* API: dynamic data – search results – pages */}
              {search.pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} onClick={onClose} className={`${listLink} text-[18px] whitespace-normal`}>
                    <Highlight text={p.label} query={query} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <Link href={searchHref} onClick={onClose} className="flex items-center justify-between border-t border-white/45 pt-5">
            <span className="font-lexend-deca text-[16px] font-light leading-[1.2] text-white/70">
              Search For “{query.trim() || "Keyboard"}”
            </span>
            <Image src="/icons/arrow-right-gray.svg" alt="" width={24} height={24} />
          </Link>
        </div>
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        inert={!open}
        className={`absolute inset-x-0 top-0 z-30 hidden ${fade} starting:opacity-0 lg:block ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Click-away layer */}
        <button
          type="button"
          aria-label="Close search"
          tabIndex={-1}
          onClick={onClose}
          className="fixed inset-0 cursor-default"
        />

        {/* Hello bar slot turns charcoal */}
        <div className="relative h-10 bg-charcoal" />

        {/* Navigation row: logo · search field · close */}
        <div className="relative z-10 bg-charcoal">
          <div className="page-frame flex items-center justify-between px-[120px] py-4">
            <Link href="/" aria-label="Redragon home" onClick={onClose} className="flex h-10 items-center">
              <Image
                src="/brand/redragon-logo.png"
                alt="Redragon"
                width={143}
                height={98}
                className="h-[98px] w-[143px] max-w-none object-contain"
              />
            </Link>

            <form
              role="search"
              onSubmit={submit}
              className="absolute left-[460px] top-4 h-10 w-[640px] rounded-[10px] shadow-[inset_0_0_0_1px_#c5c5c7]"
            >
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search products"
                className="h-full w-[580px] bg-transparent pl-3 font-inter text-[14px] leading-[17px] text-[#b7b7b7] outline-none placeholder:text-[#b7b7b7]/70 [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute left-[591px] top-px h-[38px] w-12 cursor-pointer transition-opacity hover:opacity-90"
              >
                <Image src="/icons/search-tag.svg" alt="" width={48} height={38} className="absolute inset-0" />
                <Image
                  src="/icons/search-tag-icon.svg"
                  alt=""
                  width={19}
                  height={19}
                  className="absolute left-[19px] top-[10px]"
                />
              </button>
            </form>

            <button type="button" aria-label="Close search" onClick={onClose} className="flex cursor-pointer items-center">
              <Image src="/icons/close.svg" alt="" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* Results panel */}
        <div
          className={`relative h-[608px] bg-graphite shadow-[0_20px_28px_rgba(0,0,0,0.25)] ${fade} starting:-translate-y-4 ${
            open ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <div className="page-frame h-full">
            {/* Suggestions */}
            <p className={`${heading} left-[120px] top-6`}>Suggestions</p>
            <ul className="absolute left-[120px] top-[84px] flex flex-col gap-6">
              {/* API: dynamic data – search suggestions */}
              {search.suggestions.map((s) => (
                <li key={s}>
                  <Link href={`/search?q=${encodeURIComponent(s)}`} onClick={onClose} className={listLink}>
                    <Highlight text={s} query={query} />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Pages */}
            <p className={`${heading} left-[120px] top-[300px]`}>Pages</p>
            <ul className="absolute left-[120px] top-[360px] flex flex-col gap-6">
              {/* API: dynamic data – search results – pages */}
              {search.pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} onClick={onClose} className={listLink}>
                    <Highlight text={p.label} query={query} />
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="absolute left-[120px] top-[480px] w-[389px] border-0 border-t border-white/45" />
            <Link
              href={searchHref}
              onClick={onClose}
              className="group absolute left-[120px] top-[510px] flex w-[388px] items-center justify-between"
            >
              <span className="font-lexend-deca text-[16px] font-light leading-[1.2] whitespace-nowrap text-white/70 group-hover:text-white">
                Search For “{query.trim() || "Keyboard"}”
              </span>
              <Image
                src="/icons/arrow-right-gray.svg"
                alt=""
                width={24}
                height={24}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            {/* Products */}
            <p className={`${heading} left-[525px] top-6`}>Products</p>
            <ul className="absolute left-[525px] top-[84px] grid grid-cols-[390px_390px] gap-4">
              {/* API: dynamic data – search results – products */}
              {search.products.map((p, i) => (
                <li key={`${p.href}-${i}`}>
                  <Link
                    href={p.href}
                    onClick={onClose}
                    className="flex h-[152px] items-center justify-between gap-5 rounded-[16px] bg-charcoal py-3 pr-4 pl-3 transition-colors hover:bg-[#2a2a2a]"
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={186}
                      height={p.imageHeight}
                      className="h-auto w-[186px] shrink-0 drop-search-product"
                    />
                    <span className="flex w-40 flex-col gap-1.5">
                      <span className="font-lexend-deca text-[20px] leading-[1.2] text-white text-right">{p.name}</span>
                      <span className="flex items-center justify-end gap-2 font-lexend text-[16px] font-light leading-[1.2]">
                        <span className="text-white/70">{p.category}</span>
                        <span aria-hidden className="h-[19px] w-px bg-white" />
                        <span className="text-dragon">{p.line}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
