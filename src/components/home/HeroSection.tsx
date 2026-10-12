"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { heroSlides, type HeroSlide } from "@/data/home";

const AUTOPLAY_MS = 5000;
/** Horizontal drag distance (px) that counts as a swipe */
const SWIPE_THRESHOLD = 60;

/**
 * One hero slide – Figma "Desktop - 1" (1440×800 incl. 112px header → 688px section).
 * All y-coordinates below are Figma values minus 112.
 */
function Slide({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  // Only the first slide carries the page's h1
  const Title = priority ? "h1" : "h2";
  return (
    <div className="page-frame h-[688px]">
      {/* Right-hand spotlight panel – bleeds to the viewport edge above 1440px */}
      <div className="bg-hero-panel absolute left-[1025px] right-[min(0px,calc(720px-50vw))] top-0 h-[688px]" />

      {/* Outlined display type */}
      <div className="absolute left-[788px] top-[161px] flex h-[344px] w-[166px] items-center justify-center">
        <p className="-rotate-90 font-lato text-[128px] font-bold leading-[1.3] whitespace-nowrap text-outline-white">
          {slide.model}
        </p>
      </div>
      <p
        aria-hidden
        className="absolute left-[120px] top-[443px] w-[679px] font-lato text-[140px] font-bold leading-none tracking-[-5.6px] text-outline-faint [text-box:trim-both_cap_alphabetic]"
      >
        {slide.ghostLines[0]}
      </p>
      <p
        aria-hidden
        className="absolute left-[120px] top-[585px] w-[679px] font-lato text-[142.947px] font-bold leading-none tracking-[-5.7179px] text-outline-faint [text-box:trim-both_cap_alphabetic]"
      >
        {slide.ghostLines[1]}
      </p>

      {/* Main product shot (cropped from a square render) */}
      <div className="absolute left-[849px] top-[50px] h-[589px] w-[343px] overflow-hidden drop-hero-main">
        <Image
          src={slide.image.src}
          alt={slide.image.alt}
          width={1600}
          height={1600}
          preload={priority}
          draggable={false}
          className="absolute left-0 top-[0.05%] h-full w-[171.5%] max-w-none"
        />
      </div>

      {/* Thumbnails */}
      <ul className="absolute left-[1201px] top-[119px] flex h-[451px] w-[150px] flex-col">
        {slide.thumbnails.map((t) => (
          <li key={t.src} className="relative aspect-square w-full shrink-0 drop-thumb">
            <Image src={t.src} alt={t.alt} fill sizes="150px" draggable={false} className="object-cover" />
          </li>
        ))}
      </ul>

      {/* Copy */}
      <div className="absolute left-[120px] top-[173px] flex flex-col items-start text-white">
        <p className="font-lato text-[20px] leading-normal text-white/80">{slide.eyebrow}</p>
        <Title className="mt-2 font-lato text-[40px] font-black leading-normal whitespace-nowrap">{slide.title}</Title>
        <p className="mt-2 w-[592px] font-lato text-[16px] font-light leading-[1.5] text-white/80">
          {slide.description}
        </p>
        <ButtonLink
          href={slide.href}
          chevron
          className="mt-[33px] px-7 py-[14.5px] font-lato text-[16px] font-semibold leading-normal"
        >
          More details
        </ButtonLink>
      </div>
    </div>
  );
}

/** Hero carousel: autoplay, dot navigation, swipe/drag, pauses on hover/focus. */
export default function HeroSection() {
  const count = heroSlides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [drag, setDrag] = useState<{ startX: number; pointerId: number } | null>(null);

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, count, goTo]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Let links/buttons inside the slide receive their clicks
    if ((e.target as HTMLElement).closest("a,button")) return;
    setDrag({ startX: e.clientX, pointerId: e.pointerId });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (drag?.pointerId === e.pointerId) setDragX(e.clientX - drag.startX);
  };
  const endDrag = (e: React.PointerEvent) => {
    if (drag?.pointerId !== e.pointerId) return;
    if (dragX <= -SWIPE_THRESHOLD) goTo(index + 1);
    else if (dragX >= SWIPE_THRESHOLD) goTo(index - 1);
    setDrag(null);
    setDragX(0);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="relative overflow-hidden bg-gradient-to-r from-[#454344] to-[#727071] to-[78.646%]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goTo(index - 1);
        if (e.key === "ArrowRight") goTo(index + 1);
      }}
    >
      <div
        className={`flex touch-pan-y select-none ${drag ? "" : "transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"}`}
        style={{ transform: `translateX(calc(${-index * 100}% + ${dragX}px))` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className="relative w-full shrink-0 overflow-hidden"
          >
            <Slide slide={slide} priority={i === 0} />
          </div>
        ))}
      </div>

      {/* Slide indicator – 12px dots on a 28px pitch (Figma "Frame 2") */}
      <div className="page-frame pointer-events-none absolute inset-x-0 top-0 h-[688px]">
        <div className="pointer-events-auto absolute left-1/2 top-[646px] flex -translate-x-1/2 gap-4">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={`size-3 cursor-pointer rounded-full transition-colors ${
                i === index ? "bg-[#151c21]" : "border border-[#151c21]/80 hover:bg-[#151c21]/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
