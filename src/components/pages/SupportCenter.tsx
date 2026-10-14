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
      <label className="flex h-12 w-full items-center justify-between rounded-[4px] border border-ink px-5 sm:w-[341px]">
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

/** Mobile tile: label over the product art, two per row (no Figma frame for this state). */
function MobileTile({ tile, active, onSelect }: { tile: SupportTile; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`relative flex h-[132px] cursor-pointer flex-col justify-between overflow-hidden bg-white p-3 text-left outline outline-1 ${
        active ? "outline-2 outline-dragon" : "outline-black"
      }`}
    >
      <span className="relative z-10 font-lexend-deca text-[16px] font-medium leading-[1.2] text-ink">{tile.label}</span>
      <span className="pointer-events-none absolute right-1 bottom-1 h-[88px] w-[60%]">
        <Image src={tile.art.src} alt="" fill sizes="30vw" className="object-contain object-right-bottom" />
      </span>
    </button>
  );
}

/** Mobile download card: name + keywords, the render, then Software / Manual links. */
function MobileDownloadCard({ item }: { item: Download }) {
  const link =
    "flex items-center gap-1 font-lexend-deca text-[12px] font-medium uppercase tracking-[0.5px] text-[#e60012]";
  return (
    <li className="flex flex-col bg-[#f6f6f6] p-3 lg:hidden">
      <p className="font-lexend text-[13px] font-medium uppercase leading-[1.2] text-ink">{item.name}</p>
      <div className="relative mt-2 aspect-[4/3] w-full">
        <Image src={item.image.src} alt={item.name} fill sizes="45vw" className="object-contain" />
      </div>
      <div className="mt-3 flex flex-col items-start gap-2">
        <a href={item.software} className={link}>
          <Image src="/icons/pages/download.svg" alt="" width={18} height={18} />
          Software
        </a>
        <a href={item.manual} className={link}>
          <Image src="/icons/pages/download.svg" alt="" width={18} height={18} />
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
        <div className="relative px-4 pt-14 pb-14 lg:hidden">
          {/* Wash over the photo so the copy stays legible on narrow screens */}
          <div aria-hidden className="absolute inset-0 bg-white/75" />
          <p className="relative font-lexend-deca text-[18px] text-[#e60012]">Support</p>
          <h1 className="relative mt-2 font-lexend-exa text-[32px] font-black tracking-[-2.4px] text-ink">Manuals &amp; Software&apos;s</h1>
          <p className="relative mt-3 font-lexend-deca text-[16px] font-light leading-[1.5] text-ink">
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
            className="relative mt-6"
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
        <div className="grid grid-cols-2 gap-3 px-4 py-8 lg:hidden">
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
        <div className="page-frame flex flex-col items-center px-4 pt-14 pb-10 lg:min-h-[1152px] lg:px-20 lg:pt-[72px]">
          <div className="flex flex-col items-center text-center lg:hidden">
            <h2 className="font-lexend-giga text-[28px] font-bold leading-[1.2] tracking-[-2px] text-[#e60012]/60">
              Manuals &amp; Software&apos;s
            </h2>
            <p className="font-lexend-exa text-[20px] font-medium leading-[1.2] text-ink">Features Products</p>
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

          <ul className="mt-7 grid w-full grid-cols-2 gap-3 lg:w-auto lg:grid-cols-[repeat(4,308px)] lg:gap-4">
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
              className="mt-10 h-12 cursor-pointer rounded-[28px] bg-crimson px-7 font-lato text-[16px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c]"
            >
              Load More
            </button>
          )}
        </div>
      </section>
    </>
  );
}
