"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import TabSlider from "@/components/ui/TabSlider";
import type { GamingCategory } from "@/data/gaming";
import { piece } from "@/lib/motion";
import ArtImage, { type Art } from "./ArtImage";
import CenteredHeading from "./CenteredHeading";

const PER_SLIDE = 4;

function Chevron({ dir }: { dir: "left" | "right" }) {
  // Material "keyboard_arrow" glyph (M3/sys/light/on-surface)
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className={dir === "right" ? "-scale-x-100" : ""}>
      <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z" fill="#1D1B20" />
    </svg>
  );
}

/**
 * One 720×308 category tile. Left-column tiles inset their copy 96px, right-column
 * tiles 64px, and the right column's patterned background is mirrored vertically.
 */
function CategoryTile({
  category,
  column,
  delay,
}: {
  category: GamingCategory;
  column: "left" | "right";
  /** Start of this tile's entrance stagger (ms) */
  delay: number;
}) {
  const inset = column === "left" ? 96 : 64;
  const href = `/gaming/${category.slug}`;
  return (
    <div className="group/card relative h-[308px] w-[720px] overflow-clip">
      <div
        className={`piece absolute inset-0 border border-black ${column === "right" ? "-scale-y-100" : ""}`}
        style={piece("bottom", delay)}
      >
        <Image
          src="/images/gaming/categories/tile-bg.png"
          alt=""
          fill
          sizes="720px"
          className="object-cover opacity-40"
        />
      </div>

      <p
        aria-hidden
        className="piece absolute top-14 font-gotham text-[136px] font-black leading-[1.2] tracking-[4.08px] whitespace-nowrap text-[#bababa]"
        style={{ left: column === "left" ? -16 : -20, ...piece("left", delay + 100) }}
      >
        {category.ghost}
      </p>

      <ArtImage art={category.tileArt} className="piece card-art" style={piece("right", delay + 200)} />

      <h3
        className="piece absolute font-lexend-deca text-[32px] font-medium leading-[1.2] whitespace-nowrap text-black"
        style={{ left: inset, top: category.tileLabelTop ?? 119, ...piece("bottom", delay + 250) }}
      >
        {category.labelLines ? (
          <>
            {category.labelLines[0]}
            <br />
            {category.labelLines[1]}
          </>
        ) : (
          category.label
        )}
      </h3>

      <Link
        href={href}
        aria-label={`Browse ${category.label}`}
        className="piece group absolute top-[220px] flex items-center gap-4 font-lexend-deca text-[24px] font-medium uppercase leading-normal text-dragon"
        style={{ left: inset, ...piece("bottom", delay + 320) }}
      >
        Browse
        <Image
          src="/icons/arrow-circle-right.svg"
          alt=""
          width={48}
          height={48}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

/** 390×152 mobile tile (Figma "Game Product" screen 2); every other tile's pattern is turned 180°. */
function MobileTile({ category, flip, delay }: { category: GamingCategory; flip: boolean; delay: number }) {
  const art: Art = category.mobileTileArt ?? {
    ...category.tileArt,
    box: { right: 0, top: -10, w: 180, h: 172 },
    outer: undefined,
    rotate: undefined,
    crop: undefined,
    fit: "contain",
  };
  return (
    <li className="group/card relative h-[152px] overflow-clip border border-[#696969]">
      <div className={`piece absolute inset-0 bg-white ${flip ? "-scale-100" : ""}`} style={piece("bottom", delay)}>
        <Image src="/images/home/office-pattern-bg.png" alt="" fill sizes="100vw" className="object-cover opacity-40" />
      </div>
      <p
        aria-hidden
        className="piece absolute left-[-4px] top-1.5 font-gotham text-[72px] font-black leading-[1.2] tracking-[2.16px] whitespace-nowrap text-[#bababa]"
        style={piece("left", delay + 100)}
      >
        {category.ghost}
      </p>
      <ArtImage art={{ ...art, sizes: "50vw" }} className="piece card-art" style={piece("right", delay + 200)} />
      <h3
        className="piece absolute left-4 top-[35px] font-lexend-deca text-[20px] font-medium leading-[1.2] text-ink"
        style={piece("bottom", delay + 250)}
      >
        {category.label}
      </h3>
      <Link
        href={`/gaming/${category.slug}`}
        aria-label={`Browse ${category.label}`}
        className="piece group absolute left-4 top-[104px] flex items-center gap-4 font-lexend-deca text-[20px] font-semibold uppercase leading-[1.25] text-dragon"
        style={piece("bottom", delay + 320)}
      >
        Browse
        <Image
          src="/icons/arrow-circle-right.svg"
          alt=""
          width={32}
          height={32}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </li>
  );
}

// API: dynamic data – gaming categories (via props)
/**
 * Figma "Gaming categories" (1440×800) – 2×2 tiles per slide with a "1 / 3" pager. Tiles assemble like the
 * home page's "Choose Your Gears" cards (on first view and on every page change) and their art zooms on hover.
 */
export default function CategorySlider({ categories }: { categories: GamingCategory[] }) {
  const slides: GamingCategory[][] = [];
  for (let i = 0; i < categories.length; i += PER_SLIDE) slides.push(categories.slice(i, i + PER_SLIDE));

  const count = slides.length;
  const [index, setIndex] = useState(0);
  const go = (step: number) => setIndex((i) => (i + step + count) % count);
  const touchX = useRef<number | null>(null);

  const pager = (className: string) =>
    count > 1 && (
      <div className={`shadow-inset-bevel flex items-center bg-white/10 px-[5px] ${className}`}>
        <button type="button" aria-label="Previous categories" onClick={() => go(-1)} className="cursor-pointer">
          <Chevron dir="left" />
        </button>
        <p
          aria-live="polite"
          className="flex gap-1 font-lexend-deca text-[20px] font-light leading-[1.2] text-ink [text-box:trim-both_cap_alphabetic]"
        >
          <span>{index + 1}</span>
          <span>/</span>
          <span>{count}</span>
        </p>
        <button type="button" aria-label="Next categories" onClick={() => go(1)} className="cursor-pointer">
          <Chevron dir="right" />
        </button>
      </div>
    );

  return (
    <section className="bg-silver-mobile overflow-hidden lg:bg-silver" aria-roledescription="carousel" aria-label="Gaming categories">
      {/* Mobile – Figma "Game Product" screen 2: four stacked tiles per page */}
      <div className="mobile-frame pt-10 lg:hidden">
        <CenteredHeading compact title="Gaming Category" subtitle="Which gear type are you looking for?" />
        <div className="mt-4 flex justify-center">{pager("h-11 w-[120px] justify-between border-[1.5px] border-ink")}</div>
        <div
          className="mt-3 touch-pan-y"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <TabSlider
            role="group"
            active={String(index)}
            panels={slides.map((slide, i) => ({
              key: String(i),
              content: (
                <ul role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`}>
                  {slide.map((category, j) => (
                    <MobileTile key={category.slug} category={category} flip={j % 2 === 1} delay={j * 100} />
                  ))}
                </ul>
              ),
            }))}
          />
        </div>
      </div>

      <div className="page-frame relative hidden h-[800px] lg:block">
        <CenteredHeading
          title="Gaming Category"
          subtitle="Which gear type are you looking for?"
          className="absolute left-1/2 top-20 -translate-x-1/2"
        />

        {pager("absolute right-20 top-[88px] w-[140px] gap-4 border-[1.5px] border-ink/50 py-[10.5px]")}

        <div className="absolute inset-x-0 top-[184px] h-[616px] overflow-hidden">
          <TabSlider
            role="group"
            active={String(index)}
            panels={slides.map((slide, i) => ({
              key: String(i),
              content: (
                <div
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  className="grid grid-cols-[720px_720px] grid-rows-[308px_308px]"
                >
                  {slide.map((category, j) => (
                    <CategoryTile
                      key={category.slug}
                      category={category}
                      column={j % 2 === 0 ? "left" : "right"}
                      delay={j * 120}
                    />
                  ))}
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
