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

/**
 * Mobile (Figma "Mice Category" screen 1): series + name, a swipeable row of 344×320
 * product cards (the next one peeking in) and the copy of the card in view.
 */
function MobileSpotlights({ slides }: { slides: Spotlight[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  return (
    <div className="mobile-frame pt-10 pb-11 lg:hidden">
      <div aria-live="polite" className="px-4">
        <p className="font-lexend-giga text-[16px] leading-5 text-ink/70">{slide.series}</p>
        <h1 className="mt-2 font-lexend-exa text-[32px] font-semibold leading-[1.2] text-ink">{slide.name}</h1>
      </div>

      <ul
        aria-label="Products"
        className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const el = e.currentTarget;
          const card = el.firstElementChild as HTMLElement | null;
          if (!card) return;
          const i = Math.round(el.scrollLeft / (card.offsetWidth + 20));
          if (i !== index) setIndex(Math.min(Math.max(i, 0), slides.length - 1));
        }}
      >
        {slides.map((s, i) => (
          <li key={i} className="relative h-[320px] w-[88%] max-w-[344px] shrink-0 snap-start bg-[#f6f6f6]">
            <Image
              src={s.art.src}
              alt={s.art.alt ?? s.name}
              fill
              sizes="(max-width: 640px) 88vw, 344px"
              preload={i === 0}
              className="object-cover"
            />
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-start px-4">
        <p className="mt-6 font-lexend-exa text-[20px] leading-6 text-[#383d42]">{slide.tagline}</p>
        <Image src="/icons/gaming/hero-rule.svg" alt="" width={87} height={2} className="mt-5 brightness-0" />
        <p className="mt-5 font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-[#626466]">
          {slide.description}
        </p>
        <Link
          href={slide.href}
          className="mt-8 flex h-12 items-center rounded-[4px] bg-crimson px-8 font-lexend-deca text-[16px] uppercase leading-normal tracking-[1px] text-white transition-colors hover:bg-[#c3151c]"
        >
          More details
        </Link>
      </div>
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
      className="overflow-hidden bg-white lg:bg-[#f5f5f6]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <MobileSpotlights slides={slides} />

      <div className="page-frame relative hidden h-[688px] lg:block">
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
