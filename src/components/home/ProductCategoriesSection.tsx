"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import BrowseLink from "@/components/ui/BrowseLink";
import SectionHeading from "@/components/ui/SectionHeading";
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

  return (
    <section className="bg-silver overflow-hidden">
      <div className="page-frame h-[800px] px-[120px] pt-20">
        <div className="flex items-end justify-between">
          <SectionHeading eyebrow="Discover Our Products" title="Choose Your Gears" />
          <div role="tablist" aria-label="Product line" className="flex gap-6">
            {tabButton("game", "Game")}
            {tabButton("office", "Office")}
          </div>
        </div>

        <div id="gears-panel" role="tabpanel" className="mt-[109px]">
          {tab === "game" ? <GameGears /> : <OfficeGears />}
        </div>
      </div>
    </section>
  );
}
