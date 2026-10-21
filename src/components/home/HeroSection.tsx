"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import MobileProductHero from "@/components/ui/MobileProductHero";
import { heroSlides, type HeroSlide } from "@/data/home";

const AUTOPLAY_MS = 5000;
/** Horizontal drag distance (px) that counts as a swipe */
const SWIPE_THRESHOLD = 60;
/** How far the content follows the pointer while dragging (fraction of the drag) */
const DRAG_FOLLOW = 0.35;

/** `.slide-reveal` timing for one element: how far it travels and when it starts (globals.css) */
const reveal = (shift: number, delay: number) =>
  ({ "--shift": `${shift}px`, "--reveal-delay": `${delay}ms` }) as CSSProperties;

/**
 * One hero slide's content – Figma "Desktop - 1" (1440×800 incl. 112px header → 688px section).
 * All y-coordinates below are Figma values minus 112. The backdrop lives in `HeroSection`, so only
 * the copy, button, outlined type and renders change between slides.
 */
function Slide({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  // Only the first slide carries the page's h1
  const Title = priority ? "h1" : "h2";
  return (
    <div className="page-frame hidden h-[688px] lg:block">
      {/* Outlined display type */}
      <div
        className="slide-reveal absolute left-[788px] top-[161px] flex h-[344px] w-[166px] items-center justify-center"
        style={reveal(90, 80)}
      >
        <p className="-rotate-90 font-lato text-[128px] font-bold leading-[1.3] whitespace-nowrap text-outline-white">
          {slide.model}
        </p>
      </div>
      <p
        aria-hidden
        className="slide-reveal absolute left-[120px] top-[443px] w-[679px] font-lato text-[140px] font-bold leading-none tracking-[-5.6px] text-outline-faint [text-box:trim-both_cap_alphabetic]"
        style={reveal(160, 0)}
      >
        {slide.ghostLines[0]}
      </p>
      <p
        aria-hidden
        className="slide-reveal absolute left-[120px] top-[585px] w-[679px] font-lato text-[142.947px] font-bold leading-none tracking-[-5.7179px] text-outline-faint [text-box:trim-both_cap_alphabetic]"
        style={reveal(200, 60)}
      >
        {slide.ghostLines[1]}
      </p>

      {/* Main product shot (cropped from a square render) */}
      <div
        className="slide-reveal absolute left-[849px] top-[50px] h-[589px] w-[343px] overflow-hidden drop-hero-main"
        style={reveal(140, 160)}
      >
        <Image
          src={slide.image.src}
          alt={slide.image.alt}
          width={1600}
          height={1600}
          sizes="600px"
          preload={priority}
          draggable={false}
          className="absolute left-0 top-[0.05%] h-full w-[171.5%] max-w-none"
        />
      </div>

      {/* Thumbnails */}
      <ul className="absolute left-[1201px] top-[119px] flex h-[451px] w-[150px] flex-col">
        {slide.thumbnails.map((t, i) => (
          <li
            key={t.src}
            className="slide-reveal relative aspect-square w-full shrink-0 drop-thumb"
            style={reveal(60, 260 + i * 80)}
          >
            <Image src={t.src} alt={t.alt} fill sizes="150px" draggable={false} className="object-cover" />
          </li>
        ))}
      </ul>

      {/* Copy */}
      <div className="absolute left-[120px] top-[173px] flex flex-col items-start text-white">
        <p className="slide-reveal font-lato text-[20px] leading-normal text-white/80" style={reveal(40, 120)}>
          {slide.eyebrow}
        </p>
        <Title
          className="slide-reveal mt-2 font-lato text-[40px] font-black leading-normal whitespace-nowrap"
          style={reveal(40, 190)}
        >
          {slide.title}
        </Title>
        <p
          className="slide-reveal mt-2 w-[592px] font-lato text-[16px] font-light leading-[1.5] text-white/80"
          style={reveal(40, 260)}
        >
          {slide.description}
        </p>
        {/* Wrapped so the reveal transition doesn't clash with the button's own colour transition */}
        <div className="slide-reveal mt-[33px]" style={reveal(40, 330)}>
          <ButtonLink
            href={slide.href}
            chevron
            className="px-7 py-[14.5px] font-lato text-[16px] font-semibold leading-normal"
          >
            More details
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/**
 * Hero carousel: autoplays every 5s, dot/arrow-key navigation, swipe/drag.
 * The background stays fixed; slides are stacked and swap their content in place.
 */
export default function HeroSection() {
  const count = heroSlides.length;
  // `prev` is the slide currently animating out; `dir` is the direction of travel (1 next, -1 previous)
  const [{ index, prev, dir }, setNav] = useState({ index: 0, prev: -1, dir: 1 });
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [drag, setDrag] = useState<{ startX: number; pointerId: number } | null>(null);

  const goTo = useCallback(
    (i: number, direction: 1 | -1) =>
      setNav((s) => {
        const next = ((i % count) + count) % count;
        return next === s.index ? s : { index: next, prev: s.index, dir: direction };
      }),
    [count],
  );
  const step = (d: 1 | -1) => goTo(index + d, d);

  // Advance every AUTOPLAY_MS; the timer restarts after any manual navigation.
  // (Reduced motion only drops the animations – see globals.css – not the rotation.)
  useEffect(() => {
    if (paused || drag || count < 2) return;
    const id = window.setTimeout(() => goTo(index + 1, 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, drag, count, goTo]);

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
    if (dragX <= -SWIPE_THRESHOLD) step(1);
    else if (dragX >= SWIPE_THRESHOLD) step(-1);
    setDrag(null);
    setDragX(0);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="relative overflow-hidden bg-gradient-to-r from-[#454344] to-[#727071] to-[78.646%]"
      style={{ "--dir": dir } as CSSProperties}
      // Pause only while a keyboard user is tabbing through it (a clicked dot keeps focus, so plain :focus would stop it for good)
      onFocus={(e) => setPaused(e.target.matches(":focus-visible"))}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
      }}
    >
      {/* Right-hand spotlight panel – part of the fixed backdrop; bleeds to the viewport edge above 1440px */}
      <div className="page-frame pointer-events-none absolute inset-x-0 top-0 hidden h-[688px] lg:block">
        <div className="bg-hero-panel absolute left-[1025px] right-[min(0px,calc(720px-50vw))] top-0 h-[688px]" />
      </div>

      <div
        className="relative grid touch-pan-y select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* API: dynamic data – hero slides */}
        {heroSlides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
              data-active={active}
              data-leaving={i === prev ? "" : undefined}
              className={`relative col-start-1 row-start-1 w-full overflow-hidden ${
                active ? "z-10" : "pointer-events-none"
              } ${drag ? "" : "transition-[translate] duration-500 ease-out motion-reduce:transition-none"}`}
              style={{ translate: active && dragX ? `${dragX * DRAG_FOLLOW}px 0` : undefined }}
            >
              <MobileProductHero
                {...slide}
                as={i === 0 ? "h1" : "h2"}
                title={slide.title}
                priority={i === 0}
              />
              <Slide slide={slide} priority={i === 0} />
            </div>
          );
        })}
      </div>

      {/* Slide indicator – 12px dots on a 28px pitch (Figma "Frame 2") */}
      <div className="page-frame pointer-events-none absolute inset-x-0 top-0 hidden h-[688px] lg:block">
        <div className="pointer-events-auto absolute left-1/2 top-[646px] z-20 flex -translate-x-1/2 gap-4">
          {/* API: dynamic data – hero slides (one dot each) */}
          {heroSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i, i > index ? 1 : -1)}
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
