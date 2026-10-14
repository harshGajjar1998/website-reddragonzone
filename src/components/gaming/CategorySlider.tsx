"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { GamingCategory } from "@/data/gaming";
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
function CategoryTile({ category, column }: { category: GamingCategory; column: "left" | "right" }) {
  const inset = column === "left" ? 96 : 64;
  const href = `/gaming/${category.slug}`;
  return (
    <div className="relative h-[308px] w-[720px] overflow-clip">
      <div className={`absolute inset-0 border border-black ${column === "right" ? "-scale-y-100" : ""}`}>
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
        className="absolute top-14 font-gotham text-[136px] font-black leading-[1.2] tracking-[4.08px] whitespace-nowrap text-[#bababa]"
        style={{ left: column === "left" ? -16 : -20 }}
      >
        {category.ghost}
      </p>

      <ArtImage art={category.tileArt} />

      <h3
        className="absolute font-lexend-deca text-[32px] font-medium leading-[1.2] whitespace-nowrap text-black"
        style={{ left: inset, top: category.tileLabelTop ?? 119 }}
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
        className="group absolute top-[220px] flex items-center gap-4 font-lexend-deca text-[24px] font-medium uppercase leading-normal text-dragon"
        style={{ left: inset }}
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
function MobileTile({ category, flip }: { category: GamingCategory; flip: boolean }) {
  const art: Art = category.mobileTileArt ?? {
    ...category.tileArt,
    box: { right: 0, top: -10, w: 180, h: 172 },
    outer: undefined,
    rotate: undefined,
    crop: undefined,
    fit: "contain",
  };
  return (
    <li className="relative h-[152px] overflow-clip border border-[#696969]">
      <div className={`absolute inset-0 bg-white ${flip ? "-scale-100" : ""}`}>
        <Image src="/images/home/office-pattern-bg.png" alt="" fill sizes="100vw" className="object-cover opacity-40" />
      </div>
      <p
        aria-hidden
        className="absolute left-[-4px] top-1.5 font-gotham text-[72px] font-black leading-[1.2] tracking-[2.16px] whitespace-nowrap text-[#bababa]"
      >
        {category.ghost}
      </p>
      <ArtImage art={{ ...art, sizes: "50vw" }} />
      <h3 className="absolute left-4 top-[35px] font-lexend-deca text-[20px] font-medium leading-[1.2] text-ink">
        {category.label}
      </h3>
      <Link
        href={`/gaming/${category.slug}`}
        aria-label={`Browse ${category.label}`}
        className="group absolute left-4 top-[104px] flex items-center gap-4 font-lexend-deca text-[20px] font-semibold uppercase leading-[1.25] text-dragon"
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

/** Figma "Gaming categories" (1440×800) – 2×2 tiles per slide with a "1 / 3" pager. */
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
        <ul
          key={index}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}`}
          className="mt-3 touch-pan-y motion-safe:animate-[fade-in_400ms_ease-out]"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {slides[index].map((category, j) => (
            <MobileTile key={category.slug} category={category} flip={j % 2 === 1} />
          ))}
        </ul>
      </div>

      <div className="page-frame relative hidden h-[800px] lg:block">
        <CenteredHeading
          title="Gaming Category"
          subtitle="Which gear type are you looking for?"
          className="absolute left-1/2 top-20 -translate-x-1/2"
        />

        {pager("absolute right-20 top-[88px] w-[140px] gap-4 border-[1.5px] border-ink/50 py-[10.5px]")}

        <div className="absolute inset-x-0 top-[184px] h-[616px] overflow-hidden">
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${-index * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i !== index}
                inert={i !== index}
                className="grid w-full shrink-0 grid-cols-[720px_720px] grid-rows-[308px_308px]"
              >
                {slide.map((category, j) => (
                  <CategoryTile key={category.slug} category={category} column={j % 2 === 0 ? "left" : "right"} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
