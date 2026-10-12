"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { GamingCategory } from "@/data/gaming";
import ArtImage from "./ArtImage";
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

/** Figma "Gaming categories" (1440×800) – 2×2 tiles per slide with a "1 / 3" pager. */
export default function CategorySlider({ categories }: { categories: GamingCategory[] }) {
  const slides: GamingCategory[][] = [];
  for (let i = 0; i < categories.length; i += PER_SLIDE) slides.push(categories.slice(i, i + PER_SLIDE));

  const count = slides.length;
  const [index, setIndex] = useState(0);
  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  return (
    <section className="bg-silver overflow-hidden" aria-roledescription="carousel" aria-label="Gaming categories">
      <div className="page-frame relative h-[800px]">
        <CenteredHeading
          title="Gaming Category"
          subtitle="Which gear type are you looking for?"
          className="absolute left-1/2 top-20 -translate-x-1/2"
        />

        {count > 1 && (
          <div className="shadow-inset-bevel absolute right-20 top-[88px] flex w-[140px] items-center gap-4 border-[1.5px] border-ink/50 bg-white/10 px-[5px] py-[10.5px]">
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
        )}

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
