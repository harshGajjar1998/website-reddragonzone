"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { LatestItem } from "@/data/gaming";
import ArtImage, { type Art } from "./ArtImage";
import CenteredHeading from "./CenteredHeading";

/** A static stage layer, positioned in the 1440×800 section */
export type StageLayer = { src: string; left: number; top: number; w: number; h: number; opacity?: number };

export type LatestStage = {
  /** Panels + outlines drawn behind the products */
  back: StageLayer[];
  /** Glow drawn between the side products and the centre product */
  glow: StageLayer;
};

const G = "/images/gaming/latest";

/** Gaming stage – gridded panels with red outlines and a blurred red glow */
const gamingStage: LatestStage = {
  back: [
    { src: `${G}/stage-left.png`, left: 115.33, top: 167.69, w: 558.84, h: 524.58, opacity: 0.7 },
    { src: `${G}/stage-right.png`, left: 765.81, top: 167.69, w: 558.84, h: 524.58, opacity: 0.7 },
    { src: `${G}/frame-left.svg`, left: 139.25, top: 198.43, w: 541.644, h: 463.1 },
    { src: `${G}/frame-right.svg`, left: 759.08, top: 198.43, w: 541.644, h: 463.1 },
  ],
  glow: { src: `${G}/glow.svg`, left: 471, top: 181, w: 498, h: 498 },
};

/** Generic side slots: 231×194 at x 335 (left, 1px blur) / 874 (right, 0.5px blur) */
const sideArt = (item: LatestItem, slot: "left" | "right"): Art =>
  item.slots?.[slot] ?? {
    ...item.side,
    box: { ...item.side.box, left: slot === "left" ? 335 : 874, right: undefined },
    blur: slot === "left" ? 1 : 0.5,
  };

function Layer({ layer }: { layer: StageLayer }) {
  return (
    <Image
      src={layer.src}
      alt=""
      width={layer.w}
      height={layer.h}
      className="absolute max-w-none"
      style={{ left: layer.left, top: layer.top, width: layer.w, height: layer.h, opacity: layer.opacity }}
    />
  );
}

/**
 * Mobile (Figma "Game Product" / "Office Produce" screen 3): the desktop stage drawn at
 * `scale` inside the 394px frame, offset so the centre product lands where the design has
 * it. The right-hand neighbour sits closer in on the gaming frame (`rightSlot`, desktop px).
 */
const MOBILE_STAGE = {
  gaming: { scale: 0.833, x: -405.6, y: 39.4, rightSlot: 819, back: false, height: 800, nameTop: 638, dotsTop: 736 },
  office: { scale: 0.8, x: -379.8, y: 29.2, rightSlot: 874, back: true, height: 760, nameTop: 615, dotsTop: 704 },
};

type LatestGearSectionProps = {
  items: LatestItem[];
  stage?: LatestStage;
  /** Office: white section with dark product name */
  light?: boolean;
};

/** Figma "The Latest gaming" (1440×800) – centre stage carousel with the neighbours peeking. */
export default function LatestGearSection({ items, stage = gamingStage, light }: LatestGearSectionProps) {
  const count = items.length;
  const [index, setIndex] = useState(0);
  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  const current = items[index];
  const prev = items[(index - 1 + count) % count];
  const next = items[(index + 1) % count];

  const m = light ? MOBILE_STAGE.office : MOBILE_STAGE.gaming;
  const mobileRight = (item: LatestItem): Art =>
    item.slots?.right ?? { ...sideArt(item, "right"), box: { ...sideArt(item, "right").box, left: m.rightSlot } };
  const touchX = useRef<number | null>(null);

  return (
    <section
      className={`overflow-hidden ${light ? "bg-white" : "bg-silver-mobile lg:bg-silver"}`}
      aria-roledescription="carousel"
      aria-label="The latest gear"
    >
      {/* Mobile */}
      <div
        className="mobile-frame touch-pan-y lg:hidden"
        style={{ height: m.height }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div className="absolute left-1/2 top-0 h-full w-[394px] -translate-x-1/2">
          <div
            className="absolute left-0 top-0 h-[800px] w-[1440px] origin-top-left"
            style={{ transform: `translate(${m.x}px, ${m.y}px) scale(${m.scale})` }}
          >
            {m.back && stage.back.map((layer) => <Layer key={layer.src} layer={layer} />)}
            {count > 1 && (
              <>
                <ArtImage key={`p-${prev.name}`} art={sideArt(prev, "left")} />
                <ArtImage key={`n-${next.name}`} art={mobileRight(next)} />
              </>
            )}
            <Layer layer={stage.glow} />
            <ArtImage key={current.name} art={current.center} className="animate-[fade-in_400ms_ease-out]" />
          </div>
        </div>

        <CenteredHeading compact title="The Latest" subtitle="Explore our new collection gear!" className="relative pt-[72px]" />

        <div aria-live="polite" className="absolute inset-x-4 flex flex-col items-center" style={{ top: m.nameTop }}>
          <h3 className="text-center font-lexend-deca text-[24px] font-medium leading-[1.2] tracking-[-0.48px] whitespace-pre text-ink">
            {current.name.trim()}
          </h3>
          <Link
            href={current.href}
            className="mt-2 font-lexend-deca text-[16px] font-medium uppercase leading-normal tracking-[1px] text-dragon"
          >
            Learn more
          </Link>
        </div>

        {count > 1 && (
          <div className="absolute inset-x-0 flex justify-center gap-3" style={{ top: m.dotsTop }}>
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show ${item.name.trim()}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`size-4 cursor-pointer rounded-full ${i === index ? "bg-dragon" : "border border-[#151c21]"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="page-frame relative hidden h-[800px] lg:block">
        <CenteredHeading
          title="The Latest"
          subtitle="Explore our new collection gear!"
          className="absolute left-1/2 top-[72px] -translate-x-1/2"
        />

        {stage.back.map((layer) => (
          <Layer key={layer.src} layer={layer} />
        ))}

        {count > 1 && (
          <>
            <ArtImage key={`p-${prev.name}`} art={sideArt(prev, "left")} />
            <ArtImage key={`n-${next.name}`} art={sideArt(next, "right")} />
          </>
        )}

        <Layer layer={stage.glow} />

        <ArtImage key={current.name} art={current.center} className="animate-[fade-in_400ms_ease-out]" />

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous product"
              onClick={() => go(-1)}
              className="absolute left-[266px] top-[402px] cursor-pointer transition-transform hover:-translate-x-1"
            >
              <Image src="/icons/arrow-long-red.svg" alt="" width={56} height={56} className="rotate-90" />
            </button>
            <button
              type="button"
              aria-label="Next product"
              onClick={() => go(1)}
              className="absolute left-[1174px] top-[402px] cursor-pointer transition-transform hover:translate-x-1"
            >
              <Image src="/icons/arrow-long-red.svg" alt="" width={56} height={56} className="rotate-90 -scale-y-100" />
            </button>
          </>
        )}

        <div aria-live="polite" className="absolute left-1/2 top-[690px] flex -translate-x-1/2 flex-col items-center">
          <h3
            className={`font-lexend-deca text-[24px] font-medium leading-[1.2] tracking-[-0.48px] whitespace-pre ${
              light ? "text-ink" : "text-white"
            }`}
          >
            {current.name}
          </h3>
          <Link
            href={current.href}
            className="mt-2 font-lexend-deca text-[16px] font-medium uppercase leading-normal tracking-[1px] text-dragon hover:underline"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
