"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import BrowseLink from "@/components/ui/BrowseLink";
import SectionHeading from "@/components/ui/SectionHeading";
import TabFade from "@/components/ui/TabFade";
import CategoryCard from "./CategoryCard";

type Tab = "game" | "office";

const dropShadow = "drop-card";
const tabText = "px-8 py-[14px] font-lexend-deca text-[14px] font-bold leading-normal";

/** Blurred floor shadow under a product (SVG includes its 25.6px blur bleed). */
function FloorShadow({
  src,
  w,
  h,
  x,
  y,
  rotate,
}: {
  src: string;
  w: number;
  h: number;
  x: number;
  y: number;
  rotate?: number;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={w}
      height={h}
      className="pointer-events-none absolute max-w-none"
      style={{ left: x, top: y, transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    />
  );
}

/** Game tab – 2×2 grid of 592×176 cards. */
function GameGears() {
  return (
    <div className="grid grid-cols-[592px_592px] gap-x-4 gap-y-[104px]">
      {/* Mice */}
      <CategoryCard title="Mice" ghost="Mice" href="/gaming/mice" ghostLeft={-7}>
        <FloorShadow src="/images/home/shadow-ellipse-1.svg" w={223.2} h={81.2} x={343.4} y={101.4} />
        <Image
          src="/images/home/mouse-m919.png"
          alt="Redragon M919 gaming mouse"
          width={257}
          height={257}
          className={`absolute left-[335px] top-[-117px] size-[257px] ${dropShadow}`}
        />
      </CategoryCard>

      {/* Headsets */}
      <CategoryCard title="Headsets" ghost="Headset" href="/gaming/headsets">
        <FloorShadow src="/images/home/shadow-ellipse-2.svg" w={175.2} h={73.2} x={405.4} y={109.4} />
        <Image
          src="/images/home/headset-h894.png"
          alt="Redragon H894 gaming headset"
          width={236}
          height={236}
          className={`absolute left-[371px] top-[-89px] size-[236px] ${dropShadow}`}
        />
      </CategoryCard>

      {/* Keyboards – one copy clipped inside the card, one rounded copy breaking out */}
      <CategoryCard
        title="Keyboards"
        ghost="Keyboard"
        href="/gaming/keyboards"
        ghostLeft={-7}
        titleTop={69}
        browseTop={132}
        clippedArt={
          <Image
            src="/images/home/keyboard-k754.png"
            alt=""
            width={262}
            height={262}
            className="absolute left-[330px] top-[-86px] size-[262px] -scale-x-100"
          />
        }
      >
        <div className="absolute left-[334px] top-[-83px] h-[262px] w-[258px] -scale-x-100 overflow-hidden rounded-[50px]">
          <Image
            src="/images/home/keyboard-k754.png"
            alt="Redragon K754 mechanical keyboard"
            width={264}
            height={263}
            className="absolute left-[-2.05%] top-[-0.2%] h-[100.41%] w-[102.05%] max-w-none"
          />
        </div>
      </CategoryCard>

      {/* Gamepads */}
      <CategoryCard title="Gamepads" ghost="Gamepads" href="/gaming/gamepads" titleTop={65}>
        <Image
          src="/images/home/gamepad-ig09.png"
          alt="Redragon gamepad"
          width={390}
          height={270}
          className={`absolute left-[277px] top-[-102px] h-[270px] w-[390px] object-cover ${dropShadow}`}
        />
        <FloorShadow
          src="/images/home/shadow-ellipse-3.svg"
          w={245.2}
          h={73.2}
          x={334.72}
          y={104.1}
          rotate={4.58}
        />
      </CategoryCard>
    </div>
  );
}

const ghostWord = "absolute font-gotham leading-[1.2] whitespace-nowrap text-ghost";
const cardTitle = "absolute font-lexend-deca font-medium leading-[1.2] whitespace-nowrap text-white";

/**
 * Office tab – Figma "Section 4" (node 2529:6739): one tall Mice card on the left,
 * Keyboards + Combo cards stacked on the right. Coordinates are relative to the
 * 1200×456 card area (Figma section x − 120, y − 264).
 */
function OfficeGears() {
  return (
    <div className="relative h-[456px] w-[1200px]">
      {/* ---------- Mice (tall card) ---------- */}
      <div className="absolute left-0 top-0 h-[456px] w-[592px] rounded-[40px] bg-graphite" />
      <FloorShadow src="/images/home/shadow-ellipse-1.svg" w={223.2} h={81.2} x={313.4} y={365.4} />

      {/* ---------- Keyboards (clipped card) ---------- */}
      <div className="absolute left-[608px] top-0 h-[176px] w-[592px] overflow-clip rounded-[40px] bg-graphite">
        <div className="absolute left-[254px] top-[-80px] flex h-[301.05px] w-[385.63px] items-center justify-center">
          <div className="relative h-[144.073px] w-[361.05px] flex-none rotate-[29deg] overflow-hidden drop-office-gear">
            <Image
              src="/images/home/office/keyboard.png"
              alt=""
              width={482}
              height={320}
              className="absolute left-[-7.93%] top-[-46.39%] h-[192.77%] w-[115.87%] max-w-none"
            />
          </div>
        </div>
        <p aria-hidden className={`${ghostWord} left-[-8px] top-[27px] text-[88px] font-medium uppercase`}>
          keyboards
        </p>
        <h3 className={`${cardTitle} left-8 top-[66px] text-[24px]`}>keyboards</h3>
        <BrowseLink href="/office/keyboards" size="sm" className="absolute left-8 top-[129px]" />
      </div>

      {/* Keyboard top edge breaking out of the card */}
      <div className="pointer-events-none absolute left-[862px] top-[-80px] flex h-[259.793px] w-[311.201px] items-center justify-center">
        <div className="relative h-[144.073px] w-[275.952px] flex-none rotate-[29deg] overflow-hidden">
          <Image
            src="/images/home/office/keyboard.png"
            alt="Redragon office keyboard"
            width={482}
            height={320}
            className="absolute left-[-10.38%] top-[-46.39%] h-[192.77%] w-[151.6%] max-w-none"
          />
        </div>
      </div>

      <p aria-hidden className={`${ghostWord} left-[-7px] top-[48px] text-[96px] font-bold`}>
        MICE
      </p>

      {/* ---------- Combo ---------- */}
      <div className="absolute left-[608px] top-[280px] h-[176px] w-[592px] rounded-[40px] bg-graphite" />
      <p aria-hidden className={`${ghostWord} left-[600px] top-[307px] text-[88px] font-medium`}>
        COMBO
      </p>
      <h3 className={`${cardTitle} left-[640px] top-[345px] text-[24px]`}>Combo</h3>
      <div className="absolute left-[811px] top-[240px] flex h-[214.6px] w-[397.838px] items-center justify-center">
        <div className="relative h-[173.781px] w-[381.05px] flex-none rotate-[6.31deg] overflow-hidden drop-office-gear">
          <Image
            src="/images/home/office/combo.png"
            alt="Redragon office keyboard and mouse combo"
            width={1600}
            height={1600}
            className="absolute left-[-1.9%] top-[-65.63%] h-[231.25%] w-[105.46%] max-w-none"
          />
        </div>
      </div>
      <BrowseLink href="/office/combo" size="sm" className="absolute left-[640px] top-[409px]" />

      {/* ---------- Mice copy + product ---------- */}
      <h3 className={`${cardTitle} left-10 top-[86px] text-[32px]`}>Mice</h3>
      <BrowseLink href="/office/mice" size="sm" className="absolute left-10 top-[396px]" />
      <div className="pointer-events-none absolute left-[229px] top-[-72px] h-[473px] w-[358px] overflow-hidden drop-office-gear">
        <Image
          src="/images/home/office/mouse.png"
          alt="Redragon office mouse"
          width={1600}
          height={1600}
          className="absolute left-0 top-0 h-full w-[132.12%] max-w-none"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Mobile (Figma "Home Mobile version" screen 4): 358×122 cards, 32px apart.
   Art is anchored to the card's right edge so it stays put on wider phones.
   ------------------------------------------------------------------ */

function MobileGearCard({
  title,
  ghost,
  href,
  clippedArt,
  children,
}: {
  title: string;
  ghost: string;
  href: string;
  clippedArt?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className="relative h-[122px]">
      <div className="absolute inset-0 overflow-clip rounded-[24px] bg-graphite">
        <p
          aria-hidden
          className="absolute left-[-10px] top-2 font-gotham text-[64px] font-medium leading-[1.2] whitespace-nowrap text-ghost"
        >
          {ghost}
        </p>
        {clippedArt}
      </div>
      {children}
      <h3 className="absolute left-6 top-[35px] font-lexend-deca text-[20px] font-medium leading-[1.2] text-white">{title}</h3>
      <BrowseLink href={href} size="sm" className="absolute left-6 top-[86px] font-semibold!" />
    </li>
  );
}

/** Soft floor shadow under a product (Figma ellipse, #242424 + blur). */
function MobileShadow({ right, top, w, h }: { right: number; top: number; w: number; h: number }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute rounded-[50%] bg-[#242424] blur-[6px]"
      style={{ right, top, width: w, height: h }}
    />
  );
}

function MobileGameGears() {
  return (
    <ul className="flex flex-col gap-8">
      <MobileGearCard title="Mice" ghost="MICE" href="/gaming/mice">
        <MobileShadow right={61} top={99} w={80} h={14} />
        <Image
          src="/images/home/mouse-m919.png"
          alt="Redragon M919 gaming mouse"
          width={159}
          height={159}
          className={`absolute right-0 top-[-51px] size-[159px] ${dropShadow}`}
        />
      </MobileGearCard>
      <MobileGearCard title="Headsets" ghost="Headsets" href="/gaming/headsets">
        <MobileShadow right={29} top={103} w={70} h={12} />
        <Image
          src="/images/home/headset-h894.png"
          alt="Redragon H894 gaming headset"
          width={131}
          height={131}
          className={`absolute right-0 top-[-32px] size-[131px] ${dropShadow}`}
        />
      </MobileGearCard>
      <MobileGearCard
        title="Keyboards"
        ghost="Keyboards"
        href="/gaming/keyboards"
        clippedArt={
          <Image
            src="/images/home/keyboard-k754.png"
            alt=""
            width={170}
            height={170}
            className="absolute right-0 top-[-47px] size-[170px] -scale-x-100"
          />
        }
      >
        {/* Rounded copy breaking out of the card top */}
        <div className="absolute right-[15px] top-[-47px] h-[170px] w-[155px] -scale-x-100 overflow-hidden rounded-[32px]">
          <Image
            src="/images/home/keyboard-k754.png"
            alt="Redragon K754 mechanical keyboard"
            width={170}
            height={170}
            className="absolute left-[-15px] top-0 size-[170px] max-w-none"
          />
        </div>
      </MobileGearCard>
      <MobileGearCard title="Gamepads" ghost="Gamepads" href="/gaming/gamepads">
        <Image
          src="/images/home/gamepad-ig09.png"
          alt="Redragon gamepad"
          width={244}
          height={170}
          className={`absolute right-[-51px] top-[-48px] h-[170px] w-[244px] max-w-none object-cover ${dropShadow}`}
        />
        <MobileShadow right={24} top={96} w={122} h={17} />
      </MobileGearCard>
    </ul>
  );
}

/** Office tab has no mobile frame – same card pattern with the office renders. */
function MobileOfficeGears() {
  return (
    <ul className="flex flex-col gap-8">
      <MobileGearCard title="Mice" ghost="MICE" href="/office/mice">
        <MobileShadow right={45} top={101} w={80} h={14} />
        <div className="pointer-events-none absolute right-0 top-[-60px] h-[174px] w-[150px] overflow-hidden drop-office-gear">
          <Image
            src="/images/home/office/mouse.png"
            alt="Redragon office mouse"
            width={1600}
            height={1600}
            className="absolute left-0 top-0 h-full w-[132.12%] max-w-none"
          />
        </div>
      </MobileGearCard>
      <MobileGearCard
        title="Keyboards"
        ghost="Keyboards"
        href="/office/keyboards"
        clippedArt={
          <div className="absolute right-[-40px] top-[-30px] h-[90px] w-[226px] rotate-[29deg] overflow-hidden drop-office-gear">
            <Image
              src="/images/home/office/keyboard.png"
              alt="Redragon office keyboard"
              width={482}
              height={320}
              className="absolute left-[-7.93%] top-[-46.39%] h-[192.77%] w-[115.87%] max-w-none"
            />
          </div>
        }
      />
      <MobileGearCard title="Combo" ghost="COMBO" href="/office/combo">
        <div className="pointer-events-none absolute right-[-12px] top-[-40px] h-[108px] w-[238px] rotate-[6.31deg] overflow-hidden drop-office-gear">
          <Image
            src="/images/home/office/combo.png"
            alt="Redragon office keyboard and mouse combo"
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
export default function ProductCategoriesSection() {
  const [tab, setTab] = useState<Tab>("game");

  const tabButton = (value: Tab, label: string) => (
    <Button
      role="tab"
      aria-selected={tab === value}
      aria-controls="gears-panel"
      variant={tab === value ? "solid" : "outline"}
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
      variant={tab === value ? "solid" : "outline"}
      onClick={() => setTab(value)}
      className="h-8 px-5 font-lexend-deca text-[12px] font-bold leading-normal"
    >
      {label}
    </Button>
  );

  return (
    <section className="bg-silver-mobile overflow-hidden lg:bg-silver">
      <div className="mobile-frame px-4 pt-8 pb-6 lg:hidden">
        <p className="font-lexend-giga text-[20px] font-semibold leading-[1.2] text-dragon">Discover Our Products</p>
        <h2 className="mt-1.5 font-lexend-exa text-[28px] font-medium leading-[1.2] text-ink">Choose Your Gears</h2>
        <div role="tablist" aria-label="Product line" className="mt-[14px] flex gap-3">
          {mobileTab("game", "Game")}
          {mobileTab("office", "Office")}
        </div>
        <TabFade
          id="gears-panel-mobile"
          active={tab}
          className="mt-[50px]"
          panels={[
            { key: "game", content: <MobileGameGears /> },
            { key: "office", content: <MobileOfficeGears /> },
          ]}
        />
      </div>

      <div className="page-frame hidden h-[800px] px-[120px] pt-20 lg:block">
        <div className="flex items-end justify-between">
          <SectionHeading eyebrow="Discover Our Products" title="Choose Your Gears" />
          <div role="tablist" aria-label="Product line" className="flex gap-6">
            {tabButton("game", "Game")}
            {tabButton("office", "Office")}
          </div>
        </div>

        <TabFade
          id="gears-panel"
          active={tab}
          className="mt-[109px]"
          panels={[
            { key: "game", content: <GameGears /> },
            { key: "office", content: <OfficeGears /> },
          ]}
        />
      </div>
    </section>
  );
}
