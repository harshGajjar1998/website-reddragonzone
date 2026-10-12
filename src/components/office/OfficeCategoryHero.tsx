"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ArtImage from "@/components/gaming/ArtImage";
import type { Spotlight } from "@/data/office";

const AUTOPLAY_MS = 6000;
const pad = (n: number) => String(n).padStart(2, "0");

function Dots({
  count,
  index,
  onSelect,
  vertical,
}: {
  count: number;
  index: number;
  onSelect: (i: number) => void;
  vertical?: boolean;
}) {
  return (
    <div className={`flex gap-4 ${vertical ? "flex-col" : ""}`}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index}
          onClick={() => onSelect(i)}
          className={`size-3 cursor-pointer rounded-full transition-colors ${
            i === index ? "bg-[#151c21]" : "border border-[#151c21]/80 hover:bg-[#151c21]/30"
          }`}
        />
      ))}
    </div>
  );
}

/** Figma "Frame 4" (office category page) – product spotlight carousel, 688px. */
export default function OfficeCategoryHero({ slides }: { slides: Spotlight[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="overflow-hidden bg-[#f5f5f6]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="page-frame relative h-[688px]">
        {/* Re-keyed by image so only a different product fades in */}
        <ArtImage key={slide.art.src} art={slide.art} className="animate-[fade-in_500ms_ease-out]" />

        <div aria-live="polite">
          <p className="absolute left-[120px] top-[161px] font-lexend-giga text-[28px] leading-[1.2] whitespace-nowrap text-ink">
            {slide.series}
          </p>
          <h1 className="absolute left-[120px] top-[203px] font-lexend-exa text-[64px] font-semibold leading-[1.2] whitespace-nowrap text-ink">
            {slide.name}
          </h1>
          <div className="absolute left-[120px] top-[312px] flex w-[556px] flex-col gap-5">
            <p className="font-lexend-exa text-[22px] leading-normal text-[#383d42]">{slide.tagline}</p>
            <Image src="/icons/gaming/hero-rule.svg" alt="" width={87} height={2} className="-mx-px -my-px brightness-0" />
            <p className="font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-[#626466]">
              {slide.description}
            </p>
          </div>
          <Link
            href={slide.href}
            className="absolute left-[120px] top-[500px] flex h-12 items-center rounded-[4px] bg-crimson px-8 font-lexend-deca text-[16px] uppercase leading-normal tracking-[1px] text-white transition-colors hover:bg-[#c3151c]"
          >
            More details
          </Link>
        </div>

        {count > 1 && (
          <>
            <div className="absolute left-[1308px] top-[282px]">
              <Dots count={count} index={index} onSelect={setIndex} vertical />
            </div>
            <p className="absolute left-[1229px] top-[594px] flex items-baseline font-lexend-deca font-light tracking-[0.03em]">
              <span className="text-[36px] leading-[1.4] text-ink">{pad(index + 1)}/</span>
              <span className="text-[20px] leading-[1.4] text-[#626466]">{pad(count)}</span>
            </p>
            <div className="absolute left-1/2 top-[646px] -translate-x-1/2">
              <Dots count={count} index={index} onSelect={setIndex} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
