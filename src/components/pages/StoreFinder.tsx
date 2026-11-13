"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import StillNeedHelp from "@/components/pages/StillNeedHelp";
import { Button } from "@/components/ui/Button";
import { storeCountries, storesForProduct, type CountryStores, type OfflineStore, type OnlineStore } from "@/data/pages";

type Mode = "online" | "offline";
type Coords = { lat: number; lng: number };

const ICONS = "/images/pages/where-to-buy";

/** Great-circle distance in km */
function distanceKm(a: Coords, b: Coords) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** Country name for the browser locale's region, if we list it */
export function localeCountry(countries: string[] = storeCountries) {
  try {
    const region = new Intl.Locale(navigator.language).maximize().region;
    const name = region ? new Intl.DisplayNames(["en"], { type: "region" }).of(region) : undefined;
    return countries.find((c) => c === name);
  } catch {
    return undefined;
  }
}

/**
 * Where to buy flow (Figma "Where to buy" frames 42:2694 / 42:2803 / 42:2944 / 42:3117):
 * country select + "Find stores near me" → Online / Offline toggle → store list, map, or "No stores found".
 * Also renders the "Still need help?" banner, whose gap above it differs per state in the design.
 */
// API: dynamic data – stores per country (CMS Stores, via props)
export default function StoreFinder({ storesByCountry }: { storesByCountry: Record<string, CountryStores> }) {
  // The selector lists every country we cover plus any the CMS adds
  const countries = [...new Set([...storeCountries, ...Object.keys(storesByCountry)])].sort();
  // Set when the visitor arrives from a product page's "Where to Buy" button
  const params = useSearchParams();
  const productSlug = params.get("product");
  const productName = params.get("name");
  const [country, setCountry] = useState("");
  const [mode, setMode] = useState<Mode>("online");
  const [userPos, setUserPos] = useState<Coords | null>(null);
  const [activeStore, setActiveStore] = useState(0);
  const [locating, setLocating] = useState(false);

  // API: dynamic data – stores for the chosen country, narrowed to the product when one is set
  const stores = country ? storesForProduct(storesByCountry, productSlug, country) : undefined;
  const online = stores?.online ?? [];
  const offline = withDistances(stores?.offline ?? [], userPos);
  const list = mode === "online" ? online : offline;
  const empty = !!country && list.length === 0;

  function pickCountry(c: string) {
    setCountry(c);
    setActiveStore(0);
  }

  function nearMe() {
    const fallback = () => {
      setLocating(false);
      const c = localeCountry(countries);
      if (c) pickCountry(c);
    };
    if (!("geolocation" in navigator)) return fallback();
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const here = { lat: coords.latitude, lng: coords.longitude };
        // Country of the closest physical store (within 500 km), else the locale's country
        let best: { country: string; km: number } | null = null;
        for (const [c, s] of Object.entries(storesByCountry)) {
          for (const st of s.offline) {
            const km = distanceKm(here, st);
            if (!best || km < best.km) best = { country: c, km };
          }
        }
        setLocating(false);
        setUserPos(here);
        if (best && best.km <= 500) {
          pickCountry(best.country);
          setMode("offline");
        } else {
          const c = localeCountry(countries);
          if (c) pickCountry(c);
        }
      },
      fallback,
      { timeout: 10000, maximumAge: 600000 },
    );
  }

  // Gap above the help banner, per Figma state (initial / online / offline / no stores)
  const helpGap = !country ? "lg:mt-[58px]" : empty ? "lg:mt-[25px]" : mode === "online" ? "lg:mt-[56px]" : "lg:mt-[38px]";

  return (
    <>
      <div className="w-full px-4 lg:px-[188px]">
        {productName && (
          <p className="mt-6 text-center font-lexend-deca text-[16px] leading-[1.6] text-[#626466]">
            {/* API: dynamic data – product name */}
            Showing stores for <span className="font-medium text-ink">{productName}</span>{" "}
            <Link href="/where-to-buy/" className="text-crimson underline">
              Show all
            </Link>
          </p>
        )}
        {/* Country select + Find stores near me */}
        <div className="mt-8 flex flex-col gap-3 lg:mt-[48px] lg:flex-row lg:gap-[24px]">
          <label className="relative block w-full lg:w-[704px]">
            <span className="sr-only">Country</span>
            <select
              value={country}
              onChange={(e) => pickCountry(e.target.value)}
              className={`h-[54px] w-full cursor-pointer appearance-none rounded-[4px] border border-ink bg-white pr-12 pl-[20px] font-lexend-deca text-[16px] leading-none text-ink outline-none focus-visible:border-crimson lg:text-[20px] ${country ? "uppercase" : ""}`}
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {/* Material keyboard_arrow_down */}
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="pointer-events-none absolute top-1/2 right-[20px] -translate-y-1/2">
              <path d="M6.18 7.16 10 10.97l3.82-3.81L15 8.33l-5 5-5-5z" fill="#1D1B20" />
            </svg>
          </label>
          <Button
            type="button"
            onClick={nearMe}
            disabled={locating}
            className="h-[54px] w-full shrink-0 gap-[8px] px-[32px] font-lexend-deca text-[16px] leading-[normal] font-semibold disabled:cursor-wait lg:w-[336px] lg:text-[20px]"
          >
            <Image src={`${ICONS}/icon-location.svg`} alt="" width={24} height={24} />
            {locating ? "Locating…" : "Find stores near me"}
          </Button>
        </div>

        {country && (
          <>
            {/* Online / Offline toggle between two hairlines */}
            <div className="mt-8 flex items-center justify-center gap-[16px] lg:mt-[48px]">
              <span aria-hidden className="hidden h-[1.5px] flex-1 rounded-full bg-[#e7e7e7] lg:block" />
              <div role="tablist" aria-label="Shopping type" className="flex w-full max-w-[344px] shrink-0 gap-[4px] overflow-clip rounded-[4px] border border-[#d6d6d6] bg-white p-[3px] lg:w-[344px]">
                {(["online", "offline"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => {
                      setMode(m);
                      setActiveStore(0);
                    }}
                    className={`flex h-[42px] min-w-px flex-1 cursor-pointer items-center justify-center rounded-[2px] font-lexend-deca text-[16px] leading-[normal] whitespace-nowrap transition-colors ${
                      mode === m ? "bg-crimson font-semibold text-white" : "bg-white text-ink hover:bg-[#f6f6f6]"
                    }`}
                  >
                    {m === "online" ? "Online Shopping" : "Offline Shopping"}
                  </button>
                ))}
              </div>
              <span aria-hidden className="hidden h-[1.5px] flex-1 rounded-full bg-[#e7e7e7] lg:block" />
            </div>

            <div aria-live="polite" className="mt-10 lg:mt-[48px]">
              {empty ? (
                <NoStores />
              ) : mode === "online" ? (
                <>
                  <ResultsHeading title={`Stores in ${country}`} uppercase subtitle="Find official stores and trusted retail partners in your country." />
                  <ul className="mt-6 flex flex-col gap-[16px] lg:mt-[32px]">
                    {online.map((s) => (
                      <OnlineCard key={s.name} store={s} />
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <ResultsHeading title="Find physical retailers" subtitle="Map and store listings for this product" />
                  <div className="mt-6 flex flex-col gap-[16px] lg:flex-row lg:items-start">
                    <ul className="flex flex-col gap-[13px] lg:w-[632px] lg:shrink-0">
                      {offline.map((s, i) => (
                        <OfflineCard key={s.name} store={s} index={i} active={i === activeStore} onSelect={() => setActiveStore(i)} />
                      ))}
                    </ul>
                    <StoreMap store={offline[activeStore] ?? offline[0]} />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <StillNeedHelp enquiry="Where to buy" className={`mx-4 mt-12 ${helpGap}`} />
    </>
  );
}

/** Fill in live distances once we have the shopper's position, nearest first */
function withDistances(stores: OfflineStore[], pos: Coords | null) {
  if (!pos) return stores;
  return stores
    .map((s) => ({ ...s, distanceKm: Math.round(distanceKm(pos, s) * 10) / 10 }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

function ResultsHeading({ title, subtitle, uppercase }: { title: string; subtitle: string; uppercase?: boolean }) {
  return (
    <div className="flex flex-col gap-[8px] lg:w-[418px]">
      <h3 className={`font-lexend-exa text-[22px] leading-[1.2] font-bold text-dragon lg:text-[27px] ${uppercase ? "uppercase" : ""}`}>{title}</h3>
      <p className="font-lexend text-[14px] leading-[1.13] text-[#6f7279]">{subtitle}</p>
    </div>
  );
}

/** Online retailer row (Figma "Frame 156/157", 1064×128) */
function OnlineCard({ store }: { store: OnlineStore }) {
  const official = store.type === "Official store";
  return (
    <li
      className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[8px] border border-[#e6e7ea] p-3 lg:h-[128px] lg:flex-nowrap lg:gap-0 lg:py-0 lg:pr-[47px] lg:pl-[15px] ${
        official ? "bg-[#f6f6f6]" : "bg-white"
      }`}
    >
      <div className={`flex h-[68px] w-[96px] shrink-0 items-center justify-center overflow-clip rounded-[4px] lg:h-[96px] lg:w-[136px] ${official ? "" : "bg-white"}`}>
        {store.logo ? (
          <Image
            src={store.logo.src}
            alt={store.name}
            width={store.logo.width}
            height={store.logo.height}
            sizes="105px"
            className="ml-px h-[50px] w-[73px] object-contain lg:h-[72px] lg:w-[105px]"
          />
        ) : (
          <span className="px-2 text-center font-lexend text-[14px] font-medium leading-[1.2] text-[#1b1b1f]">{store.name}</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-[12px] lg:ml-[24px] lg:w-[230px] lg:flex-none lg:translate-y-[0.5px]">
        <p className="font-lexend text-[18px] leading-[normal] font-medium text-[#1b1b1f] lg:text-[20px] lg:whitespace-nowrap">{store.name}</p>
        <Badge>{store.type}</Badge>
      </div>
      <a
        href={store.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[42px] w-full items-center justify-center gap-[8px] rounded-[2px] bg-crimson px-[24px] font-lexend-deca text-[16px] leading-[normal] font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#a3121a] lg:ml-auto lg:w-auto"
      >
        Shop Now
        <Image src={`${ICONS}/icon-arrow-up-right.svg`} alt="" width={24} height={24} />
        <span className="sr-only">(opens {store.name} in a new tab)</span>
      </a>
    </li>
  );
}

export function Badge({ children, tight, className = "" }: { children: string; tight?: boolean; className?: string }) {
  return (
    <span className={`inline-flex overflow-clip rounded-[5px] bg-[#fff0f1] px-[12px] ${tight ? "py-[5px]" : "py-[6px]"} font-lexend text-[12px] leading-[normal] font-medium whitespace-nowrap text-[#e01a2d] ${className}`}>
      {children}
    </span>
  );
}

/**
 * Physical store row (Figma "Nearby store", 632×112). Desktop pins every element at its
 * design offset; below lg the wrappers become a normal flex layout.
 */
function OfflineCard({ store, index, active, onSelect }: { store: OfflineStore; index: number; active: boolean; onSelect: () => void }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
  return (
    <li
      onClick={onSelect}
      className="relative flex cursor-pointer gap-3 rounded-[8px] border border-[#e4e5e8] bg-white p-3 transition-colors hover:border-crimson/40 lg:block lg:h-[112px] lg:p-0"
    >
      {/* Store logo placeholder + map number */}
      <div className="relative h-[82px] w-[95px] shrink-0 lg:absolute lg:top-[14px] lg:left-[15px]">
        <div className="size-full overflow-hidden rounded-[4px]">
          <Image src={store.image} alt="" width={516} height={387} sizes="95px" className="size-full object-cover" />
        </div>
      </div>
      <span className="absolute top-[5px] left-[7px] flex size-[28px] items-center justify-center rounded-full bg-[#e11a2b] font-lexend-deca text-[12px] leading-none font-semibold text-white">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 lg:contents">
        <div className="flex flex-col items-start gap-1 lg:contents">
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={active}
            className="cursor-pointer text-left font-lexend-deca text-[17px] leading-[normal] font-semibold text-[#17191c] lg:absolute lg:top-[17px] lg:left-[127px] lg:whitespace-nowrap"
          >
            {store.name}
          </button>
          <Badge tight className="lg:absolute lg:top-[14px] lg:left-[297px]">{store.type}</Badge>
        </div>
        <p className="font-lexend-deca text-[12px] leading-[18px] text-[#666b73] lg:absolute lg:top-[49.5px] lg:left-[127px] lg:whitespace-nowrap">
          {store.address[0]}
          <br />
          {store.address[1]}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 lg:contents">
          {store.distanceKm !== undefined && (
            <p className="font-lexend-deca text-[14px] leading-[normal] font-medium whitespace-nowrap text-[#17191c] lg:absolute lg:top-[29px] lg:left-[502px]">
              ⌖ {store.distanceKm} km
            </p>
          )}
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-[4px] font-lexend-deca text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#e11a2b] hover:underline lg:absolute lg:top-[61px] lg:left-[502px]"
          >
            Get directions
            <Image src={`${ICONS}/icon-external.svg`} alt="" width={20} height={20} />
          </a>
        </div>
      </div>
    </li>
  );
}

/** Google Maps embed of the selected store (Figma "Map placeholder / developer integration", 416×362, r9) */
export function StoreMap({
  store,
  className = "h-[300px] w-full lg:sticky lg:top-24 lg:h-[362px] lg:w-[416px] lg:shrink-0",
}: {
  store?: OfflineStore;
  className?: string;
}) {
  if (!store) return null;
  const q = encodeURIComponent(`${store.name}, ${store.address.join(", ")}`);
  return (
    <div className={`overflow-hidden rounded-[9px] bg-[#e5e3df] ${className}`}>
      <iframe
        key={`${store.lat},${store.lng}`}
        title={`Map showing ${store.name}`}
        src={`https://maps.google.com/maps?q=${q}&ll=${store.lat},${store.lng}&z=13&output=embed`}
        className="size-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

/** Figma "NO STORES FOUND" state (42:3117) */
function NoStores() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex flex-col items-center gap-[8px]">
        <h3 className="font-lexend-exa text-[22px] leading-[1.2] font-bold text-dragon uppercase lg:text-[27px]">No stores found</h3>
        <p className="font-lexend text-[14px] leading-[1.13] text-[#6f7279]">
          Search results when no retail partner is available for the selected country.
        </p>
      </div>
      <Image
        src="/images/pages/where-to-buy/no-stores.png"
        alt="Redragon dragon peeking out of an empty box"
        width={1254}
        height={1254}
        sizes="(min-width: 1024px) 376px, 260px"
        className="mt-6 size-[260px] lg:mt-[23px] lg:size-[376px]"
      />
    </div>
  );
}
