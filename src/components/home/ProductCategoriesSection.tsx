"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import BrowseLink from "@/components/ui/BrowseLink";
import SectionHeading from "@/components/ui/SectionHeading";
import TabSlider from "@/components/ui/TabSlider";
import { piece } from "@/lib/motion";
import type { GearCard, HomeGears } from "@/data/home";
import CategoryCard from "./CategoryCard";

type Tab = "game" | "office";

const dropShadow = "drop-card";
const tabText = "px-8 py-[14px] font-lexend-deca text-[14px] font-bold leading-normal";
/** Mirrored art: `.card-art` folds the flip into its hover zoom (a scale utility would clash with it) */
const flip = { "--flip": -1 } as CSSProperties;

/*
  Motion (globals.css): every element is a `.piece` that assembles when its tab panel turns active –
  cards rise from the bottom, ghost words slide in from the left, products from the right – staggered
  card by card. Products are `.card-art`, zooming while their card (`group/card`) is hovered.
*/

/** Blurred floor shadow under a product (SVG includes its 25.6px blur bleed); rises in with the card. */
function FloorShadow({
  src,
  w,
  h,
  x,
  y,
  rotate,
  delay = 0,
}: {
  src: string;
  w: number;
  h: number;
  x: number;
  y: number;
  rotate?: number;
  delay?: number;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={w}
      height={h}
      className="piece pointer-events-none absolute max-w-none"
      style={{ left: x, top: y, rotate: rotate ? `${rotate}deg` : undefined, ...piece("bottom", delay) }}
    />
  );
}

// API: dynamic data – gaming category cards (CMS homepage "Category cards" section; art placement is per slot)
/** Game tab – 2×2 grid of 592×176 cards. */
function GameGears({ cards }: { cards: GearCard[] }) {
  return (
    <div className="grid grid-cols-[592px_592px] gap-x-4 gap-y-[104px]">
      {/* Mice */}
      <CategoryCard title={cards[0].title} ghost={cards[0].ghost} href={cards[0].href} ghostLeft={-7}>
        <FloorShadow src="/images/home/shadow-ellipse-1.svg" w={223.2} h={81.2} x={343.4} y={101.4} delay={200} />
        <Image
          src={cards[0].image.src}
          alt={cards[0].image.alt}
          width={257}
          height={257}
          className={`piece card-art absolute left-[335px] top-[-117px] size-[257px] ${dropShadow}`}
          style={piece("right", 200)}
        />
      </CategoryCard>

      {/* Headsets */}
      <CategoryCard title={cards[1].title} ghost={cards[1].ghost} href={cards[1].href} delay={120}>
        <FloorShadow src="/images/home/shadow-ellipse-2.svg" w={175.2} h={73.2} x={405.4} y={109.4} delay={320} />
        <Image
          src={cards[1].image.src}
          alt={cards[1].image.alt}
          width={236}
          height={236}
          className={`piece card-art absolute left-[371px] top-[-89px] size-[236px] ${dropShadow}`}
          style={piece("right", 320)}
        />
      </CategoryCard>

      {/* Keyboards – one copy clipped inside the card, one rounded copy breaking out */}
      <CategoryCard
        title={cards[2].title}
        ghost={cards[2].ghost}
        href={cards[2].href}
        ghostLeft={-7}
        titleTop={69}
        browseTop={132}
        delay={240}
        clippedArt={
          <Image
            src={cards[2].image.src}
            alt=""
            width={262}
            height={262}
            className="piece card-art absolute left-[330px] top-[-86px] size-[262px]"
            style={{ ...flip, ...piece("right", 440) }}
          />
        }
      >
        <div
          className="piece card-art absolute left-[334px] top-[-83px] h-[262px] w-[258px] overflow-hidden rounded-[50px]"
          style={{ ...flip, ...piece("right", 440) }}
        >
          <Image
            src={cards[2].image.src}
            alt={cards[2].image.alt}
            width={264}
            height={263}
            className="absolute left-[-2.05%] top-[-0.2%] h-[100.41%] w-[102.05%] max-w-none"
          />
        </div>
      </CategoryCard>

      {/* Gamepads */}
      <CategoryCard title={cards[3].title} ghost={cards[3].ghost} href={cards[3].href} titleTop={65} delay={360}>
        <Image
          src={cards[3].image.src}
          alt={cards[3].image.alt}
          width={390}
          height={270}
          className={`piece card-art absolute left-[277px] top-[-102px] h-[270px] w-[390px] object-cover ${dropShadow}`}
          style={piece("right", 560)}
        />
        <FloorShadow
          src="/images/home/shadow-ellipse-3.svg"
          w={245.2}
          h={73.2}
          x={334.72}
          y={104.1}
          rotate={4.58}
          delay={560}
        />
      </CategoryCard>
    </div>
  );
}

const ghostWord = "piece absolute font-gotham leading-[1.2] whitespace-nowrap text-ghost";
const cardTitle = "piece absolute font-lexend-deca font-medium leading-[1.2] whitespace-nowrap text-white";
/**
 * One office card's pieces share a full-size layer so hovering the card zooms its own art.
 * The layer ignores the pointer; the card face and links opt back in.
 */
const cardLayer = "group/card pointer-events-none absolute inset-0";

// API: dynamic data – office category cards (CMS homepage "Category cards" section; art placement is per slot)
/**
 * Office tab – Figma "Section 4" (node 2529:6739): one tall Mice card on the left,
 * Keyboards + Combo cards stacked on the right. Coordinates are relative to the
 * 1200×456 card area (Figma section x − 120, y − 264).
 */
function OfficeGears({ cards }: { cards: GearCard[] }) {
  return (
    <div className="relative h-[456px] w-[1200px]">
      {/* ---------- Mice (tall card) ---------- */}
      <div className={cardLayer}>
        <div
          className="piece pointer-events-auto absolute left-0 top-0 h-[456px] w-[592px] rounded-[40px] bg-graphite"
          style={piece("bottom", 0)}
        />
        <FloorShadow src="/images/home/shadow-ellipse-1.svg" w={223.2} h={81.2} x={313.4} y={365.4} delay={200} />
        <p aria-hidden className={`${ghostWord} left-[-7px] top-[48px] text-[96px] font-bold`} style={piece("left", 100)}>
          {cards[0].ghost}
        </p>
        <h3 className={`${cardTitle} left-10 top-[86px] text-[32px]`} style={piece("bottom", 250)}>
          {cards[0].title}
        </h3>
        <div className="piece pointer-events-auto absolute left-10 top-[396px]" style={piece("bottom", 320)}>
          <BrowseLink href={cards[0].href} size="sm" />
        </div>
        <div
          className="piece card-art absolute left-[229px] top-[-72px] h-[473px] w-[358px] overflow-hidden drop-office-gear"
          style={piece("right", 200)}
        >
          <Image
            src={cards[0].image.src}
            alt={cards[0].image.alt}
            width={1600}
            height={1600}
            className="absolute left-0 top-0 h-full w-[132.12%] max-w-none"
          />
        </div>
      </div>

      {/* ---------- Keyboards (clipped card) ---------- */}
      <div className={cardLayer}>
        <div
          className="piece pointer-events-auto absolute left-[608px] top-0 h-[176px] w-[592px] overflow-clip rounded-[40px] bg-graphite"
          style={piece("bottom", 120)}
        >
          <div
            className="piece card-art absolute left-[254px] top-[-80px] flex h-[301.05px] w-[385.63px] items-center justify-center"
            style={piece("right", 320)}
          >
            <div className="relative h-[144.073px] w-[361.05px] flex-none rotate-[29deg] overflow-hidden drop-office-gear">
              <Image
                src={cards[1].image.src}
                alt=""
                width={482}
                height={320}
                className="absolute left-[-7.93%] top-[-46.39%] h-[192.77%] w-[115.87%] max-w-none"
              />
            </div>
          </div>
          <p
            aria-hidden
            className={`${ghostWord} left-[-8px] top-[27px] text-[88px] font-medium uppercase`}
            style={piece("left", 220)}
          >
            {cards[1].ghost}
          </p>
          <h3 className={`${cardTitle} left-8 top-[66px] text-[24px]`} style={piece("bottom", 370)}>
            {cards[1].title}
          </h3>
          <div className="piece absolute left-8 top-[129px]" style={piece("bottom", 440)}>
            <BrowseLink href={cards[1].href} size="sm" />
          </div>
        </div>

        {/* Keyboard top edge breaking out of the card */}
        <div
          className="piece card-art absolute left-[862px] top-[-80px] flex h-[259.793px] w-[311.201px] items-center justify-center"
          style={piece("right", 320)}
        >
          <div className="relative h-[144.073px] w-[275.952px] flex-none rotate-[29deg] overflow-hidden">
            <Image
              src={cards[1].image.src}
              alt={cards[1].image.alt}
              width={482}
              height={320}
              className="absolute left-[-10.38%] top-[-46.39%] h-[192.77%] w-[151.6%] max-w-none"
            />
          </div>
        </div>
      </div>

      {/* ---------- Combo ---------- */}
      <div className={cardLayer}>
        <div
          className="piece pointer-events-auto absolute left-[608px] top-[280px] h-[176px] w-[592px] rounded-[40px] bg-graphite"
          style={piece("bottom", 240)}
        />
        <p aria-hidden className={`${ghostWord} left-[600px] top-[307px] text-[88px] font-medium`} style={piece("left", 340)}>
          {cards[2].ghost}
        </p>
        <h3 className={`${cardTitle} left-[640px] top-[345px] text-[24px]`} style={piece("bottom", 490)}>
          {cards[2].title}
        </h3>
        <div
          className="piece card-art absolute left-[811px] top-[240px] flex h-[214.6px] w-[397.838px] items-center justify-center"
          style={piece("right", 440)}
        >
          <div className="relative h-[173.781px] w-[381.05px] flex-none rotate-[6.31deg] overflow-hidden drop-office-gear">
            <Image
              src={cards[2].image.src}
              alt={cards[2].image.alt}
              width={1600}
              height={1600}
              className="absolute left-[-1.9%] top-[-65.63%] h-[231.25%] w-[105.46%] max-w-none"
            />
          </div>
        </div>
        <div className="piece pointer-events-auto absolute left-[640px] top-[409px]" style={piece("bottom", 560)}>
          <BrowseLink href={cards[2].href} size="sm" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Mobile (Figma "Home Mobile version" screen 4): 358×122 cards, 32px apart.
   Art is anchored to the card's right edge so it stays put on wider phones.
   ------------------------------------------------------------------ */

/** Stagger between mobile cards (ms) */
const MOBILE_STEP = 100;

function MobileGearCard({
  title,
  ghost,
  href,
  index,
  clippedArt,
  children,
}: {
  title: string;
  ghost: string;
  href: string;
  /** Position in the list, for the entrance stagger */
  index: number;
  clippedArt?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const d = index * MOBILE_STEP;
  return (
    <li className="group/card relative h-[122px]">
      <div className="piece absolute inset-0 overflow-clip rounded-[24px] bg-graphite" style={piece("bottom", d)}>
        <p
          aria-hidden
          className="piece absolute left-[-10px] top-2 font-gotham text-[64px] font-medium leading-[1.2] whitespace-nowrap text-ghost"
          style={piece("left", d + 100)}
        >
          {ghost}
        </p>
        {clippedArt}
      </div>
      {children}
      <h3
        className="piece absolute left-6 top-[35px] font-lexend-deca text-[20px] font-medium leading-[1.2] text-white"
        style={piece("bottom", d + 250)}
      >
        {title}
      </h3>
      <div className="piece absolute left-6 top-[86px]" style={piece("bottom", d + 320)}>
        <BrowseLink href={href} size="sm" className="font-semibold!" />
      </div>
    </li>
  );
}

/** Soft floor shadow under a product (Figma ellipse, #242424 + blur). */
function MobileShadow({ right, top, w, h, delay }: { right: number; top: number; w: number; h: number; delay: number }) {
  return (
    <span
      aria-hidden
      className="piece pointer-events-none absolute rounded-[50%] bg-[#242424] blur-[6px]"
      style={{ right, top, width: w, height: h, ...piece("bottom", delay) }}
    />
  );
}

/** Mobile product art: slides in from the right after its card, zooms on hover */
const mobileArt = (index: number) => piece("right", index * MOBILE_STEP + 200);

// API: dynamic data – gaming category cards, mobile (via props)
function MobileGameGears({ cards }: { cards: GearCard[] }) {
  return (
    <ul className="flex flex-col gap-8">
      <MobileGearCard title={cards[0].title} ghost={cards[0].ghost} href={cards[0].href} index={0}>
        <MobileShadow right={61} top={99} w={80} h={14} delay={200} />
        <Image
          src={cards[0].image.src}
          alt={cards[0].image.alt}
          width={159}
          height={159}
          className={`piece card-art absolute right-0 top-[-51px] size-[159px] ${dropShadow}`}
          style={mobileArt(0)}
        />
      </MobileGearCard>
      <MobileGearCard title={cards[1].title} ghost={cards[1].ghost} href={cards[1].href} index={1}>
        <MobileShadow right={29} top={103} w={70} h={12} delay={300} />
        <Image
          src={cards[1].image.src}
          alt={cards[1].image.alt}
          width={131}
          height={131}
          className={`piece card-art absolute right-0 top-[-32px] size-[131px] ${dropShadow}`}
          style={mobileArt(1)}
        />
      </MobileGearCard>
      <MobileGearCard
        title={cards[2].title}
        ghost={cards[2].ghost}
        href={cards[2].href}
        index={2}
        clippedArt={
          <Image
            src={cards[2].image.src}
            alt=""
            width={170}
            height={170}
            className="piece card-art absolute right-0 top-[-47px] size-[170px]"
            style={{ ...flip, ...mobileArt(2) }}
          />
        }
      >
        {/* Rounded copy breaking out of the card top */}
        <div
          className="piece card-art absolute right-[15px] top-[-47px] h-[170px] w-[155px] overflow-hidden rounded-[32px]"
          style={{ ...flip, ...mobileArt(2) }}
        >
          <Image
            src={cards[2].image.src}
            alt={cards[2].image.alt}
            width={170}
            height={170}
            className="absolute left-[-15px] top-0 size-[170px] max-w-none"
          />
        </div>
      </MobileGearCard>
      <MobileGearCard title={cards[3].title} ghost={cards[3].ghost} href={cards[3].href} index={3}>
        <Image
          src={cards[3].image.src}
          alt={cards[3].image.alt}
          width={244}
          height={170}
          className={`piece card-art absolute right-[-51px] top-[-48px] h-[170px] w-[244px] max-w-none object-cover ${dropShadow}`}
          style={mobileArt(3)}
        />
        <MobileShadow right={24} top={96} w={122} h={17} delay={500} />
      </MobileGearCard>
    </ul>
  );
}

// API: dynamic data – office category cards, mobile (via props)
/** Office tab has no mobile frame – same card pattern with the office renders. */
function MobileOfficeGears({ cards }: { cards: GearCard[] }) {
  return (
    <ul className="flex flex-col gap-8">
      <MobileGearCard title={cards[0].title} ghost={cards[0].ghost} href={cards[0].href} index={0}>
        <MobileShadow right={45} top={101} w={80} h={14} delay={200} />
        <div
          className="piece card-art pointer-events-none absolute right-0 top-[-60px] h-[174px] w-[150px] overflow-hidden drop-office-gear"
          style={mobileArt(0)}
        >
          <Image
            src={cards[0].image.src}
            alt={cards[0].image.alt}
            width={1600}
            height={1600}
            className="absolute left-0 top-0 h-full w-[132.12%] max-w-none"
          />
        </div>
      </MobileGearCard>
      <MobileGearCard
        title={cards[1].title}
        ghost={cards[1].ghost}
        href={cards[1].href}
        index={1}
        clippedArt={
          <div
            className="piece card-art absolute right-[-40px] top-[-30px] h-[90px] w-[226px] rotate-[29deg] overflow-hidden drop-office-gear"
            style={mobileArt(1)}
          >
            <Image
              src={cards[1].image.src}
              alt={cards[1].image.alt}
              width={482}
              height={320}
              className="absolute left-[-7.93%] top-[-46.39%] h-[192.77%] w-[115.87%] max-w-none"
            />
          </div>
        }
      />
      <MobileGearCard title={cards[2].title} ghost={cards[2].ghost} href={cards[2].href} index={2}>
        <div
          className="piece card-art pointer-events-none absolute right-[-12px] top-[-40px] h-[108px] w-[238px] rotate-[6.31deg] overflow-hidden drop-office-gear"
          style={mobileArt(2)}
        >
          <Image
            src={cards[2].image.src}
            alt={cards[2].image.alt}
            width={1600}
            height={1600}
            className="absolute left-[-1.9%] top-[-65.63%] h-[231.25%] w-[105.46%] max-w-none"
          />
        </div>
      </MobileGearCard>
    </ul>
  );
}

/** Figma "Section 4" – Discover Our Products / Choose Your Gears (1440×800). */
// API: dynamic data – headings and cards (via props)
export default function ProductCategoriesSection({ gears }: { gears: HomeGears }) {
  const [tab, setTab] = useState<Tab>("game");

  const tabButton = (value: Tab, label: string) => (
    <Button
      role="tab"
      aria-selected={tab === value}
      aria-controls="gears-panel"
      variant="outline"
      onClick={() => setTab(value)}
      className={tabText}
    >
      {label}
    </Button>
  );

  const mobileTab = (value: Tab, label: string) => (
    <Button
      role="tab"
      aria-selected={tab === value}
      aria-controls="gears-panel-mobile"
      variant="outline"
      onClick={() => setTab(value)}
      className="h-8 px-5 font-lexend-deca text-[12px] font-bold leading-normal"
    >
      {label}
    </Button>
  );

  return (
    <section className="bg-silver-mobile overflow-hidden lg:bg-silver">
      <div className="mobile-frame px-4 pt-8 pb-6 lg:hidden">
        <p className="font-lexend-giga text-[20px] font-semibold leading-[1.2] text-dragon">{gears.eyebrow}</p>
        <h2 className="mt-1.5 font-lexend-exa text-[28px] font-medium leading-[1.2] text-ink">{gears.title}</h2>
        <div role="tablist" aria-label="Product line" className="mt-[14px] flex gap-3">
          {mobileTab("game", "Game")}
          {mobileTab("office", "Office")}
        </div>
        <TabSlider
          id="gears-panel-mobile"
          active={tab}
          className="mt-[50px]"
          panels={[
            { key: "game", content: <MobileGameGears cards={gears.gaming} /> },
            { key: "office", content: <MobileOfficeGears cards={gears.office} /> },
          ]}
        />
      </div>

      <div className="page-frame hidden h-[800px] px-[120px] pt-20 lg:block">
        <div className="flex items-end justify-between">
          <SectionHeading eyebrow={gears.eyebrow} title={gears.title} />
          <div role="tablist" aria-label="Product line" className="flex gap-6">
            {tabButton("game", "Game")}
            {tabButton("office", "Office")}
          </div>
        </div>

        <TabSlider
          id="gears-panel"
          active={tab}
          className="mt-[109px]"
          panels={[
            { key: "game", content: <GameGears cards={gears.gaming} /> },
            { key: "office", content: <OfficeGears cards={gears.office} /> },
          ]}
        />
      </div>
    </section>
  );
}
