"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { downloads, supportTiles, type Download, type SupportTile } from "@/data/pages";

const PAGE = 8;
const TILE_BG = "/images/gaming/categories/tile-bg.png";

function SearchBox({
  value,
  onChange,
  onSubmit,
  placeholder,
  button,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  button: string;
  className?: string;
}) {
  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
      className={`flex flex-col gap-3 sm:flex-row sm:items-center lg:gap-[18px] ${className ?? ""}`}
    >
      <label className="flex h-[50px] w-full items-center justify-between rounded-[4px] border border-ink px-4 sm:w-[341px] lg:h-12 lg:px-5">
        <span className="sr-only">Search products</span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent font-lexend-deca text-[16px] leading-none text-ink outline-none placeholder:text-ink"
        />
        <Image src="/icons/pages/search.svg" alt="" width={18} height={18} className="shrink-0" />
      </label>
      <button
        type="submit"
        className="h-[50px] w-full cursor-pointer rounded-[4px] bg-crimson sm:w-[200px] font-lexend-deca text-[16px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c]"
      >
        {button}
      </button>
    </form>
  );
}

function Tile({ tile, active, onSelect }: { tile: SupportTile; active: boolean; onSelect: () => void }) {
  const { art } = tile;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className="group relative h-[250px] shrink-0 cursor-pointer overflow-clip bg-white text-left outline outline-1 outline-black transition-shadow hover:shadow-card-hover"
      style={{ width: tile.width }}
    >
      {!tile.plain && (
        <Image
          src={TILE_BG}
          alt=""
          width={3000}
          height={2000}
          sizes="720px"
          className="absolute left-0 top-[-50px] h-[300px] max-w-none object-cover opacity-20"
          style={{ width: tile.width + 16 }}
        />
      )}
      <span
        aria-hidden
        className={`absolute left-[-16px] font-gotham text-[80px] font-black tracking-[2.4px] text-[#bababa]/60 ${
          tile.lines ? "top-[53px] leading-[0.9]" : "top-[77px] leading-[1.2] whitespace-nowrap"
        }`}
      >
        {tile.lines ? (
          <>
            {tile.lines[0]}
            <br />
            {tile.lines[1]}
          </>
        ) : (
          tile.ghost
        )}
      </span>
      <span
        className="absolute font-lexend-deca text-[30px] font-medium leading-[1.2] text-ink"
        style={{ left: tile.inset, top: tile.lines ? 89 : 107 }}
      >
        {tile.lines ? (
          <>
            {tile.lines[0]}
            <br />
            {tile.lines[1]}
          </>
        ) : (
          tile.label
        )}
      </span>
      <Image
        src={art.src}
        alt=""
        width={art.width}
        height={art.height}
        className="pointer-events-none absolute max-w-none"
        style={{ left: art.left, top: art.top, width: art.width / 2, height: art.height / 2 }}
      />
      {/* 20% dim, lifted on hover / when selected (Figma hover state on "Keyboards") */}
      <span
        aria-hidden
        className={`absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-0 ${active ? "opacity-0" : ""}`}
      />
    </button>
  );
}

/** Mobile tile – Figma "Support — Mobile" categories: 173×154, pattern, watermark, art bottom-right. */
function MobileTile({ tile, active, onSelect }: { tile: SupportTile; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`group relative h-[154px] cursor-pointer overflow-hidden bg-white text-left outline outline-1 ${
        active ? "outline-2 outline-dragon" : "outline-[#6f6f6f]"
      }`}
    >
      <Image
        src={TILE_BG}
        alt=""
        width={3000}
        height={2000}
        sizes="342px"
        className="absolute left-0 top-0 h-[154px] w-[342px] max-w-none object-cover opacity-20"
      />
      <span
        aria-hidden
        className="absolute left-[-6px] top-2 font-gotham text-[29px] font-black uppercase leading-[35px] whitespace-nowrap text-[#bababa]/60"
      >
        {tile.ghost.replace(/s+/g, " ")}
      </span>
      <span className="absolute left-3 top-3.5 z-10 font-lexend-deca text-[18px] font-medium leading-[22px] whitespace-nowrap text-ink">
        {tile.label}
      </span>
      {/* Art is drawn 108px tall from the bottom-right corner; the tile clips any overflow */}
      <Image
        src={tile.art.src}
        alt=""
        width={tile.art.width}
        height={tile.art.height}
        sizes="180px"
        className="pointer-events-none absolute right-0 bottom-0 h-[108px] w-auto max-w-none"
      />
      {/* Same 20% dim as the desktop tiles, lifted when selected */}
      <span aria-hidden className={`absolute inset-0 bg-black/20 transition-opacity ${active ? "opacity-0" : ""}`} />
    </button>
  );
}

/** Mobile download card – Figma "Download product" (342×362): name + model, keywords, render, two outlined actions. */
function MobileDownloadCard({ item }: { item: Download }) {
  const split = item.name.lastIndexOf(" ");
  const action =
    "flex h-12 flex-1 items-center justify-center gap-1.5 rounded-[4px] border border-[#e60012]/25 font-lexend-deca text-[15px] font-semibold uppercase tracking-[0.5px] text-[#e60012]";
  return (
    <li className="flex flex-col bg-[#f6f6f6] p-5 lg:hidden">
      <div className="flex items-start justify-between gap-4">
        <p className="font-lexend uppercase text-ink">
          <span className="block text-[16px] font-semibold leading-5">{item.name.slice(0, split)}</span>
          <span className="mt-1 block text-[14px] font-medium leading-[18px]">{item.name.slice(split + 1)}</span>
        </p>
        <p className="font-lexend text-[11px] uppercase leading-[13px] text-ink">{item.keywords}</p>
      </div>
      <div className="relative mt-4 h-[200px] w-full">
        <Image src={item.image.src} alt={item.name} fill sizes="(max-width: 640px) 80vw, 302px" className="object-contain" />
      </div>
      <div className="mt-4 flex gap-3">
        <a href={item.software} className={action}>
          <Image src="/icons/pages/download.svg" alt="" width={20} height={20} />
          Software
        </a>
        <a href={item.manual} className={action}>
          <Image src="/icons/pages/download.svg" alt="" width={20} height={20} />
          Manual
        </a>
      </div>
    </li>
  );
}

function DownloadCard({ item }: { item: Download }) {
  const { image } = item;
  const link = "flex items-center gap-1 font-lexend-deca text-[14px] font-medium uppercase tracking-[1px] text-[#e60012] hover:underline";
  return (
    <li className="relative hidden h-[384px] w-[308px] bg-[#f6f6f6] outline outline-[1.2px] outline-offset-[-1.2px] outline-white/50 lg:block">
      <p className="absolute left-4 top-6 w-32 font-lexend text-[16px] font-medium uppercase leading-[1.2] tracking-[-0.16px] whitespace-pre-wrap text-ink">
        {item.name}
      </p>
      <p className="absolute right-4 top-6 font-lexend text-[12px] uppercase leading-[1.2] text-ink">{item.keywords}</p>
      <div className="absolute left-[17px] w-[274px] overflow-hidden" style={{ top: image.box.top, height: image.box.h }}>
        {image.crop ? (
          <Image
            src={image.src}
            alt={item.name}
            width={image.width}
            height={image.height}
            className="absolute max-w-none"
            style={{ width: `${image.crop.w}%`, height: `${image.crop.h}%`, left: `${image.crop.left}%`, top: `${image.crop.top}%` }}
          />
        ) : (
          <Image src={image.src} alt={item.name} fill sizes="274px" className="object-cover" />
        )}
      </div>
      <a href={item.software} className={`${link} absolute left-6 top-[336px]`}>
        <Image src="/icons/pages/download.svg" alt="" width={24} height={24} />
        Software
      </a>
      <a href={item.manual} className={`${link} absolute left-[194px] top-[336px]`}>
        <Image src="/icons/pages/download.svg" alt="" width={24} height={24} />
        Manual
      </a>
    </li>
  );
}

/** Support page body: hero search, category tiles and the manuals/software grid. */
export default function SupportCenter() {
  const [heroQuery, setHeroQuery] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  const listRef = useRef<HTMLDivElement>(null);

  // API: dynamic data – support downloads
  const results = downloads.filter(
    (d) =>
      (!category || d.category === category) &&
      (!applied || d.name.toLowerCase().includes(applied.trim().toLowerCase())),
  );

  const toList = () => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      {/* Hero (Figma "Desktop - 23") */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#454344] to-[#727071] lg:h-[544px]">
        <Image
          src="/images/pages/support/hero.png"
          alt=""
          width={2880}
          height={1088}
          preload
          className="absolute left-1/2 top-0 h-[544px] w-[1440px] max-w-none -translate-x-1/2"
        />
        {/* Mobile – Figma "Support hero" (390×386) */}
        <div className="relative px-6 pt-10 pb-10 lg:hidden">
          {/* Light wash keeps the copy legible while the photo still shows through */}
          <div aria-hidden className="absolute inset-0 bg-white/35" />
          <p className="relative font-lexend-deca text-[18px] leading-5 text-[#e60012]">Support</p>
          <h1 className="relative mt-[18px] font-lexend-exa text-[32px] font-black leading-[36px] tracking-[-2.4px] text-ink">
            Manuals &amp; Software&apos;s
          </h1>
          <p className="relative mt-[18px] font-lexend-deca text-[16px] leading-6 text-ink">
            Get the latest software, drivers and manuals for your redragon products
          </p>
          <SearchBox
            value={heroQuery}
            onChange={setHeroQuery}
            onSubmit={() => {
              setQuery(heroQuery);
              setApplied(heroQuery);
              setShown(PAGE);
              toList();
            }}
            placeholder="Search"
            button="Find"
            className="relative mt-[18px]"
          />
        </div>
        <div className="page-frame relative hidden h-full lg:block">
          <p className="absolute left-20 top-[163px] font-lexend-deca text-[22px] text-[#e60012]">Support</p>
          <h1 className="absolute left-20 top-[203px] font-lexend-exa text-[40px] font-black tracking-[-3.2px] text-ink">
            Manuals &amp; Software&apos;s
          </h1>
          <p className="absolute left-20 top-[265px] w-[497px] font-lexend-deca text-[18px] font-light leading-[1.5] text-ink">
            Get the latest software, drivers and manuals for your redragon products
          </p>
          <SearchBox
            value={heroQuery}
            onChange={setHeroQuery}
            onSubmit={() => {
              setQuery(heroQuery);
              setApplied(heroQuery);
              setShown(PAGE);
              toList();
            }}
            placeholder="Search"
            button="Find"
            className="absolute left-20 top-[331px]"
          />
        </div>
      </section>

      {/* Category tiles */}
      <section className="bg-white">
        <div className="grid grid-cols-2 gap-3 px-4 py-6 lg:hidden">
          {/* API: dynamic data – support topics */}
          {supportTiles.flat().map((tile) => (
            <MobileTile
              key={tile.slug}
              tile={tile}
              active={category === tile.slug}
              onSelect={() => {
                setCategory(category === tile.slug ? null : tile.slug);
                setShown(PAGE);
                toList();
              }}
            />
          ))}
        </div>
        <div className="page-frame hidden h-[800px] flex-col gap-6 lg:flex">
          {/* API: dynamic data – support topics */}
          {supportTiles.map((row, i) => (
            <div key={i} className="flex justify-between">
              {row.map((tile) => (
                <Tile
                  key={tile.slug}
                  tile={tile}
                  active={category === tile.slug}
                  onSelect={() => {
                    setCategory(category === tile.slug ? null : tile.slug);
                    setShown(PAGE);
                    toList();
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Manuals & software list (Figma "Section 12") */}
      <section ref={listRef} className="bg-silver scroll-mt-4">
        <div className="page-frame flex flex-col items-center px-6 pt-12 pb-12 lg:min-h-[1152px] lg:px-20 lg:pt-[72px] lg:pb-10">
          <div className="flex w-full flex-col gap-3 lg:hidden">
            <h2 className="font-lexend-giga text-[22px] font-bold leading-7 tracking-[-1px] text-[#e60012]">
              Manuals &amp; Software&apos;s
            </h2>
            <p className="font-lexend-exa text-[26px] font-medium leading-[31px] text-ink">Features Products</p>
          </div>
          <div className="relative hidden h-[77px] w-[624px] lg:block">
            <h2 className="absolute left-0 top-0 font-lexend-giga text-[48px] font-bold leading-[1.2] tracking-[-3.84px] whitespace-nowrap text-[#e60012]/50 [text-shadow:0_4px_4px_rgb(0_0_0/0.15)]">
              Manuals &amp; Software&apos;s
            </h2>
            <p className="absolute left-[132px] top-[37px] font-lexend-exa text-[32px] font-medium leading-[1.2] whitespace-nowrap text-ink">
              Features Products
            </p>
          </div>

          <SearchBox
            value={query}
            onChange={setQuery}
            onSubmit={() => {
              setApplied(query);
              setShown(PAGE);
            }}
            placeholder="Search...."
            button="Search"
            className="mt-6 w-full sm:w-auto lg:mt-[14px]"
          />

          {category && (
            <button
              type="button"
              onClick={() => setCategory(null)}
              className="mt-4 cursor-pointer font-lexend text-[14px] text-dragon underline"
            >
              Showing {supportTiles.flat().find((t) => t.slug === category)?.label} – clear filter
            </button>
          )}

          <ul className="mt-6 grid w-full grid-cols-1 gap-4 lg:mt-7 lg:w-auto lg:grid-cols-[repeat(4,308px)]">
            {results.slice(0, shown).map((item, i) => (
              <DownloadCard key={item.name + i} item={item} />
            ))}
            {results.slice(0, shown).map((item, i) => (
              <MobileDownloadCard key={`m-${item.name}${i}`} item={item} />
            ))}
          </ul>
          {results.length === 0 && (
            <p className="py-16 font-lexend text-[16px] text-ink/60">No manuals or software found.</p>
          )}

          {shown < results.length && (
            <button
              type="button"
              onClick={() => setShown((n) => n + PAGE)}
              className="mt-6 h-[50px] w-full cursor-pointer rounded-[4px] bg-crimson px-7 font-lato lg:mt-10 lg:h-12 lg:w-auto lg:rounded-[28px] text-[16px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c]"
            >
              Load More
            </button>
          )}
        </div>
      </section>
    </>
  );
}
