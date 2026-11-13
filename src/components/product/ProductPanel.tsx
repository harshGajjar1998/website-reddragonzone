"use client";

import Image from "next/image";
import { useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { DownloadLink, PreviousVersions, detectOs, osNames } from "@/components/pages/ProductDownloads";
import { useChrome } from "@/components/layout/ChromeProvider";
import { Badge, StoreMap, localeCountry } from "@/components/pages/StoreFinder";
import SegmentedControl from "@/components/ui/SegmentedControl";
import type { GamingProduct } from "@/data/gaming";
import {
  findSupportProduct,
  storeCountries,
  storesForProduct,
  type DownloadGroup,
  type DownloadOs,
  type DownloadRelease,
  type OfflineStore,
  type OnlineStore,
} from "@/data/pages";
import { productBoxContents, productMaterials, productSpecs } from "@/data/productInfo";
import { useModalLock } from "@/lib/useModalLock";

export type PanelId = "specifications" | "materials" | "box" | "manuals" | "buy";
type Mode = "online" | "offline";

const ICONS = "/images/pages/where-to-buy";
const DEFAULT_COUNTRY = "India";

const MODES: { value: Mode; label: string }[] = [
  { value: "online", label: "Online Shopping" },
  { value: "offline", label: "Offline Shopping" },
];

// API: dynamic data – operating systems offered for downloads
const OS_CHOICES: { label: string; os: DownloadOs }[] = [
  { label: "Windows 11 (64-bit)", os: "windows" },
  { label: "Windows 10 (64-bit)", os: "windows" },
  { label: "macOS", os: "mac" },
];

const title = "pr-10 font-lexend-exa text-[24px] leading-[1.2] font-semibold text-ink md:text-[32px]";
const subtitle = "mt-2 font-lexend-deca text-[16px] leading-[1.6] text-[#626466]";
const sectionTitle = "font-lexend-deca text-[20px] leading-none text-ink md:text-[24px]";
const rule = "h-px bg-[#e7e7e7]";

/** Product render, name and a detail row (Figma "Frame 162"); the render overhangs the card. */
function ProductCard({ product, tall, children }: { product: GamingProduct; tall?: boolean; children: ReactNode }) {
  return (
    <div
      className={`relative flex flex-col justify-center gap-2 rounded-[12px] border border-[#e6e7ea] bg-white py-3 pr-3 pl-[104px] md:py-0 md:pr-0 md:pl-[225px] ${
        tall ? "min-h-[136px]" : "min-h-[120px]"
      }`}
    >
      <span aria-hidden className="absolute inset-y-0 left-[96px] w-px bg-[#e6e7ea] md:left-[201px]" />
      {/* API: dynamic data – product render */}
      <Image
        src={product.image.src}
        alt=""
        width={product.image.width}
        height={product.image.height}
        sizes="150px"
        className={`drop-thumb absolute left-2 size-[90px] object-contain md:left-[25px] md:size-[150px] ${
          tall ? "top-[23px] md:top-[-7px]" : "top-[15px] md:top-[-15px]"
        }`}
      />
      <p className="flex items-center gap-2 font-lexend-deca text-[16px] leading-[1.6] text-[#626466]">
        For :
        {/* API: dynamic data – product name */}
        <span className="min-w-0 truncate text-ink">{product.name}</span>
      </p>
      {children}
    </div>
  );
}

/* ---------------- Specifications ---------------- */

function Specifications({ product, titleId }: { product: GamingProduct; titleId: string }) {
  // API: dynamic data – specifications
  const { dimensions, technical } = productSpecs(product);
  const body = "font-lexend-deca text-[16px] leading-[26px] text-[#626466]";
  return (
    <>
      <h2 id={titleId} className={title}>
        Specifications
      </h2>
      {dimensions.length > 0 && (
        <>
          <h3 className={`mt-6 ${sectionTitle}`}>Dimensions</h3>
          <ul className={`mt-3 ${body}`}>
            {dimensions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div aria-hidden className={`mt-6 ${rule}`} />
        </>
      )}
      <h3 className={`mt-6 ${sectionTitle}`}>Technical Specifications</h3>
      <div className="mt-4 flex flex-col gap-2.5">
        {technical.map((group) => (
          <div key={group.title}>
            <h4 className={`${body} font-semibold`}>{group.title}</h4>
            <ul className={`mt-2 ${body}`}>
              {group.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

/** Materials & Sustainability / In the Box: no Figma frame, so they follow the Specifications layout. */
function TextPanel({ heading, text, titleId }: { heading: string; text: string; titleId: string }) {
  return (
    <>
      <h2 id={titleId} className={title}>
        {heading}
      </h2>
      <p className="mt-6 font-lexend-deca text-[16px] leading-[1.6] text-[#626466]">{text}</p>
    </>
  );
}

/* ---------------- Manuals & Software ---------------- */

function ManualGroup({ group, releases }: { group: DownloadGroup; releases: DownloadRelease[] }) {
  const [latest, ...older] = releases;
  return (
    <section>
      <h3 className="font-lexend-deca text-[22px] leading-7 font-semibold text-ink md:text-[24px] md:leading-[30px]">
        {group.title}
      </h3>
      <p className="mt-3 font-lexend-deca text-[14px] leading-[1.5] text-[#666666]">{group.description}</p>
      {/* API: dynamic data – version, date, OS, "what changed" note, file size and type */}
      <div className={`mt-6 flex flex-col gap-5 bg-[#f6f6f6] px-5 pt-6 md:px-8 ${older.length ? "" : "pb-6"}`}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="font-lexend-deca text-[18px] leading-[23px] font-semibold text-ink">{latest.version}</p>
            <p className="font-lexend-deca text-[12px] leading-[15px] font-medium text-crimson">
              LATEST{latest.sample && " · SAMPLE"}
            </p>
          </div>
          <p className="font-lexend-deca text-[14px] leading-[18px] whitespace-pre-wrap text-[#666666]">
            Release date{latest.sample && " (sample)"}: {latest.date}
            <span className="hidden md:inline">{"     •     "}</span>
            <span className="block md:inline">OS: {osNames(latest.os)}</span>
          </p>
          <p className="font-lexend-deca text-[14px] leading-[1.5] text-ink">
            What’s changed{latest.sample && " (sample)"}: {latest.notes}
          </p>
          {latest.file && (
            <p className="font-lexend-deca text-[14px] leading-[18px] whitespace-pre-wrap text-[#666666]">
              File size : {latest.file.size}
              {"  |  "}
              {latest.file.format}
            </p>
          )}
        </div>
        <DownloadLink release={latest} full />
        {older.length > 0 && <PreviousVersions releases={older} />}
      </div>
    </section>
  );
}

function Manuals({ product, titleId }: { product: GamingProduct; titleId: string }) {
  // Pre-selected from the visitor's computer
  const [choice, setChoice] = useState(() => OS_CHOICES.findIndex((c) => c.os === detectOs()));
  const { os, label } = OS_CHOICES[choice];

  // API: dynamic data – this product's software and manuals for the chosen OS
  const { catalogue } = useChrome();
  const groups = (findSupportProduct(catalogue, product.slug)?.downloads ?? [])
    .filter((group) => group.type === "software" || group.type === "manual")
    .map((group) => ({ group, releases: group.releases.filter((release) => release.os.includes(os)) }))
    .filter(({ releases }) => releases.length > 0);

  return (
    <>
      <h2 id={titleId} className={title}>
        Manuals &amp; Software
      </h2>
      <p className={subtitle}>Find the latest manuals and software for your {product.name}.</p>
      <div className="mt-10">
        <ProductCard product={product} tall>
          <label className="block">
            <span className="font-lexend-deca text-[16px] leading-[1.6] text-[#626466]">Choose your OS</span>
            <span className="relative mt-2 flex h-11 items-center gap-1 rounded-[4px] border border-ink pr-3 pl-3 md:w-[346px]">
              {os === "windows" && <Image src="/icons/pages/windows.svg" alt="" width={24} height={24} className="shrink-0" />}
              <select
                aria-label={`Operating system, ${label}`}
                value={choice}
                onChange={(e) => setChoice(Number(e.target.value))}
                className="h-full min-w-0 flex-1 cursor-pointer appearance-none bg-transparent font-lexend-deca text-[14px] leading-none font-light text-ink outline-none"
              >
                {OS_CHOICES.map((c, i) => (
                  <option key={c.label} value={i}>
                    {c.label}
                  </option>
                ))}
              </select>
              <Image src="/icons/pages/arrow-drop.svg" alt="" width={20} height={20} className="pointer-events-none shrink-0" />
            </span>
          </label>
        </ProductCard>
      </div>
      <div aria-hidden className={`mt-6 ${rule}`} />
      {groups.length > 0 ? (
        <div className="mt-6 flex flex-col gap-8">
          {groups.map(({ group, releases }) => (
            <ManualGroup key={group.type} group={group} releases={releases} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center font-lexend-deca text-[16px] leading-[1.6] text-[#666666]">
          No manuals or software available for this operating system.
        </p>
      )}
    </>
  );
}

/* ---------------- Where to buy ---------------- */

function CountryRow({ country, onChange }: { country: string; onChange: (country: string) => void }) {
  return (
    <label className="flex items-center gap-2 font-lexend-deca text-[16px] leading-[1.6] text-[#626466]">
      Country :
      <span className="relative flex min-w-0 items-center">
        {/* API: dynamic data – countries */}
        <select
          value={country}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 cursor-pointer appearance-none bg-transparent pr-5 text-ink outline-none [field-sizing:content]"
        >
          {storeCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Image
          src="/icons/pages/arrow-drop.svg"
          alt=""
          width={20}
          height={20}
          className="pointer-events-none absolute right-0"
        />
      </span>
    </label>
  );
}

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="hidden h-[1.5px] flex-1 bg-[#e7e7e7] md:block" />
      <SegmentedControl
        label="Shopping type"
        options={MODES}
        value={mode}
        onChange={onChange}
        className="w-full md:w-[344px]"
      />
      <span aria-hidden className="hidden h-[1.5px] flex-1 bg-[#e7e7e7] md:block" />
    </div>
  );
}

/** Online retailer row (Figma "Frame 156", 587×128) */
function OnlineRow({ store }: { store: OnlineStore }) {
  return (
    <li
      className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[8px] border border-[#e6e7ea] p-3 md:h-32 md:flex-nowrap md:gap-0 md:py-0 md:pr-4 md:pl-2 ${
        store.type === "Official store" ? "bg-[#f6f6f6]" : "bg-white"
      }`}
    >
      <div className="flex h-[68px] w-[96px] shrink-0 items-center justify-center md:h-[88px] md:w-[125px]">
        {store.logo ? (
          <Image
            src={store.logo.src}
            alt=""
            width={store.logo.width}
            height={store.logo.height}
            sizes="105px"
            className="h-[50px] w-[73px] object-contain md:h-[72px] md:w-[105px]"
          />
        ) : (
          <span className="px-2 text-center font-lexend text-[14px] font-medium leading-[1.2] text-[#1b1b1f]">{store.name}</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3 md:ml-4">
        <p className="font-lexend text-[16px] leading-5 font-medium text-[#1b1b1f]">{store.name}</p>
        <Badge>{store.type}</Badge>
      </div>
      <a
        href={store.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-[2px] bg-crimson px-4 font-lexend-deca text-[16px] leading-5 font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#a3121a] md:w-[146px]"
      >
        Shop Now
        <Image src={`${ICONS}/icon-arrow-up-right.svg`} alt="" width={24} height={24} />
        <span className="sr-only">(opens {store.name} in a new tab)</span>
      </a>
    </li>
  );
}

/** Physical store row (Figma "Nearby store", 596×112); selecting it moves the map. */
function OfflineRow({ store, index, onSelect }: { store: OfflineStore; index: number; onSelect: () => void }) {
  return (
    <li className="relative rounded-[8px] border border-[#e4e5e8] bg-white">
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full cursor-pointer gap-3 p-3 pb-10 text-left md:h-[110px] md:gap-[17px] md:py-[14px] md:pr-[150px] md:pl-[15px]"
      >
        <Image
          src={store.image}
          alt=""
          width={516}
          height={387}
          sizes="95px"
          className="h-[82px] w-[95px] shrink-0 rounded-[6px] object-cover"
        />
        <span className="flex min-w-0 flex-col items-start gap-1 md:gap-2">
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 md:mt-[2px]">
            <span className="font-lexend-deca text-[17px] leading-[21px] font-semibold text-[#17191c] md:min-w-[154px]">{store.name}</span>
            <Badge tight>{store.type}</Badge>
          </span>
          <span className="font-lexend-deca text-[12px] leading-[18px] text-[#666b73]">
            {store.address[0]}
            <br />
            {store.address[1]}
          </span>
        </span>
      </button>
      <span className="pointer-events-none absolute top-[5px] left-[7px] flex size-7 items-center justify-center rounded-full bg-[#e11a2b] font-lexend-deca text-[12px] leading-none font-semibold text-white">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-3 md:top-[29px] md:right-auto md:bottom-auto md:left-[470px] md:flex-col md:items-start md:gap-[10px]">
        {store.distanceKm !== undefined && (
          <p className="font-lexend-deca text-[14px] leading-[18px] font-medium whitespace-nowrap text-[#17191c]">
            ⌖ {store.distanceKm} km
          </p>
        )}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-lexend-deca text-[12px] leading-[15px] font-semibold whitespace-nowrap text-[#e11a2b] hover:underline"
        >
          Get directions
          <Image src={`${ICONS}/icon-external.svg`} alt="" width={20} height={20} />
        </a>
      </div>
    </li>
  );
}

function WhereToBuy({ product, titleId }: { product: GamingProduct; titleId: string }) {
  const [country, setCountry] = useState(() => localeCountry() ?? DEFAULT_COUNTRY);
  const [mode, setMode] = useState<Mode>("online");
  const [activeStore, setActiveStore] = useState(0);

  // API: dynamic data – stores selling this product in the chosen country
  const { storesByCountry } = useChrome();
  const stores = storesForProduct(storesByCountry, product.slug, country);
  const online = stores?.online ?? [];
  const offline = stores?.offline ?? [];
  const available = (mode === "online" ? online : offline).length > 0;

  const changeMode = (next: Mode) => {
    setMode(next);
    setActiveStore(0);
  };
  const changeCountry = (next: string) => {
    setCountry(next);
    setActiveStore(0);
  };

  const card = (
    <ProductCard product={product}>
      <CountryRow country={country} onChange={changeCountry} />
    </ProductCard>
  );

  return (
    <>
      <h2 id={titleId} className={title}>
        WHERE TO BUY
      </h2>
      <p className={subtitle}>Find the {product.name} at our trusted partners.</p>

      {!available ? (
        // Figma Variant4 / Variant5: the product card moves above the switch
        <>
          <div className="mt-10">{card}</div>
          <div className="mt-4">
            <ModeSwitch mode={mode} onChange={changeMode} />
          </div>
          <Image
            src="/images/pages/support/results/product-not-found.png"
            alt=""
            width={512}
            height={512}
            sizes="310px"
            className="mx-auto -mt-[18px] size-[240px] md:size-[310px]"
          />
          <p className="mx-auto -mt-[26px] max-w-[419px] text-center font-lexend-deca text-[20px] leading-[1.4] font-medium text-black md:-mt-[34px] md:text-[24px]">
            This product is not currently available in your country
          </p>
        </>
      ) : (
        <>
          <div className="mt-6">
            <ModeSwitch mode={mode} onChange={changeMode} />
          </div>
          <div className="mt-6">{card}</div>

          {mode === "online" ? (
            <ul className="mt-12 flex flex-col gap-4">
              {online.map((store) => (
                <OnlineRow key={store.name} store={store} />
              ))}
            </ul>
          ) : (
            <>
              <div aria-hidden className={`mt-6 ${rule}`} />
              <h3 className="mt-6 font-lexend-deca text-[22px] leading-7 font-semibold text-ink md:text-[24px] md:leading-[30px]">
                Find physical retailers
              </h3>
              <p className="mt-3 font-lexend-deca text-[14px] leading-[1.5] text-[#666666]">
                Map and store listings for this product
              </p>
              {/* API: dynamic data – Google Maps embed of the selected store */}
              <StoreMap
                store={offline[activeStore]}
                className="mt-6 h-[300px] w-full border border-[#e4e5e8] md:h-[511px]"
              />
              <ul className="mt-6 flex flex-col gap-[13px] md:-ml-2 md:w-[596px]">
                {offline.map((store, i) => (
                  <OfflineRow key={store.name} store={store} index={i} onSelect={() => setActiveStore(i)} />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </>
  );
}

/* ---------------- Panel shell ---------------- */

/**
 * Side panel (Figma "TECHNICAL SPECIFICATIONS" variants): 667px sheet on the right edge
 * that slides in leftwards. Content scrolls inside it with the scrollbar hidden.
 * Portalled to <body> because `mobile-frame` containment would trap a fixed element.
 */
export default function ProductPanel({
  panel,
  product,
  onClose,
}: {
  panel: PanelId;
  product: GamingProduct;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  const close = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) onClose();
    else setClosing(true);
  };

  useModalLock(dialogRef);

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <div
        aria-hidden
        onClick={close}
        className={`absolute inset-0 bg-black/35 transition-opacity duration-200 ${closing ? "opacity-0" : "animate-[fade-in_300ms_ease-out]"}`}
      />
      <div
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={titleId}
        onAnimationEnd={() => {
          if (closing) onClose();
        }}
        className={`absolute inset-y-0 right-0 w-full max-w-[667px] overflow-hidden bg-white outline-none shadow-[-8px_0_17px_rgb(0_0_0/0.1),-30px_0_30px_rgb(0_0_0/0.09),-68px_0_41px_rgb(0_0_0/0.05),-121px_0_49px_rgb(0_0_0/0.01)] md:rounded-l-[20px] ${
          closing ? "animate-panel-out" : "animate-panel-in"
        }`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute top-5 right-4 z-10 cursor-pointer rounded-full bg-white md:top-[34px] md:right-10"
        >
          <Image src="/icons/pages/close.svg" alt="" width={32} height={32} />
        </button>
        <div className="h-full overflow-y-auto overscroll-contain px-4 pt-6 pb-8 [scrollbar-width:none] md:px-10 md:pt-8 [&::-webkit-scrollbar]:hidden">
          {panel === "specifications" && <Specifications product={product} titleId={titleId} />}
          {panel === "materials" && (
            <TextPanel heading="Materials & Sustainability" text={productMaterials(product)} titleId={titleId} />
          )}
          {panel === "box" && <TextPanel heading="In the Box" text={productBoxContents(product)} titleId={titleId} />}
          {panel === "manuals" && <Manuals product={product} titleId={titleId} />}
          {panel === "buy" && <WhereToBuy product={product} titleId={titleId} />}
        </div>
      </div>
    </div>,
    document.body,
  );
}
