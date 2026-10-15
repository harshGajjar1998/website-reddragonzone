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

type Rect = { x: number; y: number; w: number; h: number };

/** Where the product image lands inside an art box (stage px). */
function imageRect(art: Art): Rect {
  const { box } = art;
  const left = box.left ?? 0;
  const top = box.top ?? 0;
  if (art.crop) {
    return {
      x: left + (box.w * art.crop.left) / 100,
      y: top + (box.h * art.crop.top) / 100,
      w: (box.w * art.crop.w) / 100,
      h: (box.h * art.crop.h) / 100,
    };
  }
  if (art.fit === "contain") {
    const s = Math.min(box.w / art.width, box.h / art.height);
    const w = art.width * s;
    const h = art.height * s;
    return { x: left + (box.w - w) / 2, y: top + (box.h - h) / 2, w, h };
  }
  return { x: left, y: top, w: box.w, h: box.h };
}

/** The visible product inside the centre render (image rect trimmed by `centerBounds`). */
function productRect(item: LatestItem): Rect {
  const r = imageRect(item.center);
  const b = item.centerBounds ?? { l: 0, t: 0, r: 1, b: 1 };
  return { x: r.x + r.w * b.l, y: r.y + r.h * b.t, w: r.w * (b.r - b.l), h: r.h * (b.b - b.t) };
}

type Slot = "left" | "center" | "right";

const slotOf = (i: number, index: number, count: number): Slot => {
  const d = (i - index + count) % count;
  return d === 0 ? "center" : d === 1 ? "right" : "left";
};

/**
 * Each item is ONE image – its centre render – that moves and scales between slots, so the product
 * coming to the centre grows smoothly and the one leaving shrinks, with no double images. In a side
 * slot it is scaled to fit that slot's Figma box and softly blurred. An item wrapping from one side to
 * the other fades in at its new slot instead of flying across the stage.
 */
function StageItems({
  items,
  index,
  sideFor,
  glow,
  centerFit,
}: {
  items: LatestItem[];
  index: number;
  sideFor: (item: LatestItem, slot: "left" | "right") => Art;
  glow: StageLayer;
  /** Largest centre product (stage px) – mobile shows a narrower slice of the stage */
  centerFit?: { w: number; h: number };
}) {
  const count = items.length;
  // Remember the index we're animating from, to spot items wrapping round
  const [shownIndex, setShownIndex] = useState(index);
  const [fromIndex, setFromIndex] = useState(index);
  if (index !== shownIndex) {
    setFromIndex(shownIndex);
    setShownIndex(index);
  }

  return (
    <>
      {items.map((item, i) => {
        const slot = slotOf(i, index, count);
        const from = slotOf(i, fromIndex, count);
        const wraps = (from === "left" && slot === "right") || (from === "right" && slot === "left");

        let transform = "none";
        let filter = "none";
        if (slot === "center" && centerFit) {
          const p = productRect(item);
          const scale = Math.min(1, centerFit.w / p.w, centerFit.h / p.h);
          if (scale < 1) {
            const cx = p.x + p.w / 2;
            const cy = p.y + p.h / 2;
            transform = `translate(${cx * (1 - scale)}px, ${cy * (1 - scale)}px) scale(${scale})`;
          }
        } else if (slot !== "center") {
          const p = productRect(item);
          const { box } = sideFor(item, slot);
          const scale = 0.9 * Math.min(box.w / p.w, box.h / p.h);
          const tx = (box.left ?? 0) + box.w / 2 - (p.x + p.w / 2) * scale;
          const ty = (box.top ?? 0) + box.h / 2 - (p.y + p.h / 2) * scale;
          transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
          // blur is drawn before the scale, so divide to keep it ~1px on screen
          filter = `blur(${(slot === "left" ? 1 : 0.5) / scale}px)`;
        }

        return (
          <div
            key={i}
            className={`pointer-events-none absolute inset-0 origin-top-left ${slot === "center" ? "z-20" : "z-0"} ${
              wraps
                ? "motion-safe:animate-[fade-in_700ms_ease-out]"
                : "transition-[transform,filter] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
            }`}
            style={{ transform, filter }}
          >
            <ArtImage art={item.center} />
          </div>
        );
      })}
      <div className="pointer-events-none absolute inset-0 z-10">
        <Layer layer={glow} />
      </div>
    </>
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

/** Mobile centre product limit (stage px): wide products fit the phone, the tall mouse stays clear of its neighbours */
const MOBILE_CENTER_FIT = { w: 330, h: 340 };

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
            <StageItems
              items={items}
              index={index}
              glow={stage.glow}
              sideFor={(item, slot) => (slot === "left" ? sideArt(item, "left") : mobileRight(item))}
              centerFit={MOBILE_CENTER_FIT}
            />
          </div>
        </div>

        <CenteredHeading compact title="The Latest" subtitle="Explore our new collection gear!" className="relative pt-[72px]" />

        <div aria-live="polite" className="absolute inset-x-4 z-30 flex flex-col items-center" style={{ top: m.nameTop }}>
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

        <StageItems items={items} index={index} glow={stage.glow} sideFor={sideArt} />

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous product"
              onClick={() => go(-1)}
              className="absolute left-[266px] top-[402px] z-30 cursor-pointer transition-transform hover:-translate-x-1"
            >
              <Image src="/icons/arrow-long-red.svg" alt="" width={56} height={56} className="rotate-90" />
            </button>
            <button
              type="button"
              aria-label="Next product"
              onClick={() => go(1)}
              className="absolute left-[1174px] top-[402px] z-30 cursor-pointer transition-transform hover:translate-x-1"
            >
              <Image src="/icons/arrow-long-red.svg" alt="" width={56} height={56} className="rotate-90 -scale-y-100" />
            </button>
          </>
        )}

        <div aria-live="polite" className="absolute left-1/2 top-[690px] z-30 flex -translate-x-1/2 flex-col items-center">
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
