"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { storeCountries, storesForProduct, type CountryStores, type OfflineStore, type OnlineStore } from "@/data/pages";

type Mode = "online" | "offline";
type Coords = { lat: number; lng: number };

/** Placeholder photo the CMS mapping uses for stores without one – the card shows "STORE" instead */
const PLACEHOLDER_PHOTO = "/images/pages/where-to-buy/store-gamers-hub.png";

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

/** Flag emoji for an English country name ("India" → 🇮🇳), or "" when unknown */
let flagCodes: Map<string, string> | undefined;
function flagOf(country: string) {
  try {
    if (!flagCodes) {
      flagCodes = new Map();
      const names = new Intl.DisplayNames(["en"], { type: "region" });
      for (let a = 65; a <= 90; a++) {
        for (let b = 65; b <= 90; b++) {
          const code = String.fromCharCode(a, b);
          const name = names.of(code);
          if (name && name !== code) flagCodes.set(name, code);
        }
      }
    }
    const code = flagCodes.get(country);
    return code ? String.fromCodePoint(...[...code].map((ch) => 0x1f1a5 + ch.charCodeAt(0))) : "";
  } catch {
    return "";
  }
}

/** "Redragon India Official Store" → "RI" (logo placeholder) */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[a-z0-9]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/**
 * Where to buy (Figma "Where to buy — ONLINE selected / Retailer results" 3222:1643 and
 * "Online & Nearby tabs / Revised" 3222:1488): country picker with flag + "Use my location",
 * Online / Nearby switch, then shop-online cards or the nearby store list with a map.
 */
// API: dynamic data – stores per country (CMS Stores, via props)
export default function StoreFinder({
  storesByCountry,
  heading,
  subtitle,
}: {
  storesByCountry: Record<string, CountryStores>;
  heading: string;
  subtitle: string;
}) {
  // The selector lists every country we cover plus any the CMS adds
  const countries = [...new Set([...storeCountries, ...Object.keys(storesByCountry)])].sort();
  // Set when the visitor arrives from a product page's "Where to Buy" button
  const params = useSearchParams();
  const productSlug = params.get("product");
  const productName = params.get("name");
  const [picked, setPicked] = useState("");
  const [mode, setMode] = useState<Mode>("online");
  const [userPos, setUserPos] = useState<Coords | null>(null);
  const [activeStore, setActiveStore] = useState(0);
  const [locating, setLocating] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Until the visitor picks one, start on their own country when we list it (Figma shows results straight away).
  // Empty while prerendering; read from the browser locale after hydration.
  const detected = useSyncExternalStore(
    noSubscribe,
    () => localeCountry(countries) ?? "",
    () => "",
  );
  const country = picked || detected;

  // API: dynamic data – stores for the chosen country, narrowed to the product when one is set
  const stores = country ? storesForProduct(storesByCountry, productSlug, country) : undefined;
  const online = stores?.online ?? [];
  const offline = withDistances(stores?.offline ?? [], userPos);
  const list = mode === "online" ? online : offline;
  const empty = !!country && list.length === 0;

  function pickCountry(c: string) {
    setPicked(c);
    setActiveStore(0);
  }

  function useMyLocation() {
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

  function changeLocation() {
    setUserPos(null);
    selectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    selectRef.current?.focus();
  }

  const flag = country ? flagOf(country) : "";

  return (
    <div className="px-4 lg:px-[130px]">
      <h2 className="font-lexend-exa text-[24px] font-bold uppercase leading-[1.25] text-[#17191c] lg:text-[29px]">{heading}</h2>
      <p className="mt-3 font-lexend-deca text-[15px] leading-[19px] text-[#6a6e74]">{subtitle}</p>
      {productName && (
        <p className="mt-3 font-lexend-deca text-[15px] leading-[19px] text-[#6a6e74]">
          {/* API: dynamic data – product name */}
          Showing stores for <span className="font-medium text-[#17191c]">{productName}</span>{" "}
          <Link href="/where-to-buy/" className="font-semibold text-[#e11a2b] underline">
            Show all
          </Link>
        </p>
      )}

      {/* Country picker + Use my location */}
      <div className="mt-[29px] flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-[25px]">
        <label className="relative block w-full lg:w-[740px]">
          <span className="sr-only">Country</span>
          {flag && (
            <span aria-hidden className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 font-['Twemoji_Country_Flags',sans-serif] text-[17px] leading-none">
              {flag}
            </span>
          )}
          <select
            ref={selectRef}
            value={country}
            onChange={(e) => pickCountry(e.target.value)}
            className={`h-14 w-full cursor-pointer appearance-none rounded-[5px] border border-[#c8ccd2] bg-white pr-12 font-lexend-deca text-[17px] font-medium leading-none text-[#17191c] outline-none focus-visible:border-[#e11a2b] ${
              flag ? "pl-[52px]" : "pl-5"
            }`}
          >
            <option value="" disabled>
              Select your country
            </option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="pointer-events-none absolute top-1/2 right-[22px] -translate-y-1/2">
            <path d="M6.18 7.16 10 10.97l3.82-3.81L15 8.33l-5 5-5-5z" fill="#6a6e74" />
          </svg>
        </label>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="w-fit cursor-pointer font-lexend-deca text-[15px] font-semibold leading-[19px] whitespace-nowrap text-[#e11a2b] hover:underline disabled:cursor-wait"
        >
          <span aria-hidden>⌖&nbsp;&nbsp;</span>
          {locating ? "Locating…" : "Use my location"}
        </button>
      </div>

      {/* Online / Nearby switch */}
      <div role="tablist" aria-label="Shopping type" className="mt-9 flex h-[50px] w-full max-w-[386px] gap-[7px] rounded-[9px] bg-[#f6f7f9] p-[5px]">
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
            className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-[7px] font-lexend-deca text-[15px] leading-[19px] whitespace-nowrap transition-colors ${
              mode === m ? "bg-[#e11a2b] font-semibold text-white" : "font-medium text-[#17191c] hover:bg-white"
            }`}
          >
            <span aria-hidden>{m === "online" ? "◎" : "⌖"}&nbsp;&nbsp;&nbsp;</span>
            {m === "online" ? "Online" : "Nearby"}
          </button>
        ))}
      </div>

      {country && (
        <div aria-live="polite" className="mt-[34px]">
          {mode === "online" ? (
            <>
              <ResultsHeading title="Shop online" subtitle={`Verified online shopping partners for ${country}`} />
              {empty ? (
                <NoStores />
              ) : (
                <ul className="mt-[33px] grid gap-[23px] md:grid-cols-2 lg:grid-cols-3">
                  {online.map((s) => (
                    <OnlineCard key={s.name} store={s} />
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3 lg:mr-[62px]">
                <ResultsHeading title="Nearby stores" subtitle={`Showing stores near ${country}`} />
                <button
                  type="button"
                  onClick={changeLocation}
                  className="mb-5 cursor-pointer font-lexend-deca text-[13px] font-semibold leading-4 text-[#e11a2b] hover:underline"
                >
                  <span aria-hidden>✎&nbsp;&nbsp;</span>Change location
                </button>
              </div>
              {empty ? (
                <NoStores />
              ) : (
                <div className="mt-6 flex flex-col gap-[13px] lg:flex-row lg:items-start lg:gap-[22px]">
                  <ul className="flex flex-col gap-[13px] lg:w-[770px] lg:shrink-0">
                    {offline.map((s, i) => (
                      <OfflineCard key={s.name} store={s} index={i} active={i === activeStore} onSelect={() => setActiveStore(i)} />
                    ))}
                  </ul>
                  <StoreMap
                    store={offline[activeStore] ?? offline[0]}
                    className="h-[300px] w-full border border-[#e4e5e8] lg:sticky lg:top-24 lg:h-[362px] lg:w-[388px] lg:shrink-0"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

const noSubscribe = () => () => {};

/** Fill in live distances once we have the shopper's position, nearest first */
function withDistances(stores: OfflineStore[], pos: Coords | null) {
  if (!pos) return stores;
  return stores
    .map((s) => ({ ...s, distanceKm: Math.round(distanceKm(pos, s) * 10) / 10 }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

function ResultsHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-[7px]">
      <h3 className="font-lexend-exa text-[23px] font-bold uppercase leading-[1.25] text-[#17191c] lg:text-[24px]">{title}</h3>
      <p className="font-lexend-deca text-[14px] leading-[18px] text-[#6a6e74]">{subtitle}</p>
    </div>
  );
}

/** Shop-online card (Figma "RDZ / Online retailer card", 378×310) */
function OnlineCard({ store }: { store: OnlineStore }) {
  return (
    <li className="flex min-h-[310px] flex-col rounded-[9px] border border-[#e4e5e8] bg-white p-[22px] pt-6">
      <div className="flex items-start gap-4">
        <div className="flex h-[72px] w-[75px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#f6f7f9]">
          {store.logo ? (
            <Image
              src={store.logo.src}
              alt=""
              width={store.logo.width}
              height={store.logo.height}
              sizes="64px"
              className="h-[52px] w-[60px] object-contain"
            />
          ) : (
            <span aria-hidden className="font-lexend-deca text-[25px] font-semibold leading-[31px] text-[#e11a2b]">
              {initials(store.name)}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-col items-start gap-[11px] pt-[5px]">
          <p className="font-lexend-deca text-[17px] font-semibold leading-[21px] text-[#17191c]">{store.name}</p>
          <TypeBadge>{store.type === "Official store" ? "Official store" : "Online retailer"}</TypeBadge>
        </div>
      </div>
      {store.description && <p className="mt-7 font-lexend-deca text-[12px] leading-[15px] text-[#6a6e74]">{store.description}</p>}
      <div className="mt-auto pt-6">
        <hr className="border-0 border-t border-[#e4e5e8]" />
        <div className="mt-[18px] flex items-end justify-between gap-3">
          <div className="min-h-[37px]">
            {store.categories && (
              <>
                <p className="font-lexend-deca text-[10px] font-semibold uppercase leading-3 text-[#6a6e74]">Explore products</p>
                <p className="mt-2.5 font-lexend-deca text-[12px] font-medium leading-[15px] whitespace-pre text-[#17191c]">
                  {store.categories.join("  ·  ")}
                </p>
              </>
            )}
          </div>
          <a
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-[-1px] flex h-[43px] w-[163px] shrink-0 items-center justify-center rounded-[5px] bg-[#e11a2b] font-lexend-deca text-[12px] font-semibold uppercase leading-[15px] whitespace-pre text-white transition-colors hover:bg-[#a3121a]"
          >
            Visit store  ↗<span className="sr-only"> (opens {store.name} in a new tab)</span>
          </a>
        </div>
      </div>
    </li>
  );
}

/** Store type tag (product page Where to Buy panel) */
export function Badge({ children, tight, className = "" }: { children: string; tight?: boolean; className?: string }) {
  return (
    <span className={`inline-flex overflow-clip rounded-[5px] bg-[#fff0f1] px-[12px] ${tight ? "py-[5px]" : "py-[6px]"} font-lexend text-[12px] leading-[normal] font-medium whitespace-nowrap text-[#e01a2d] ${className}`}>
      {children}
    </span>
  );
}

/** Store type tag on the Where to Buy cards (Figma "Store type badge") */
function TypeBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex h-7 items-center rounded-[5px] bg-[#fff0f1] px-2.5 font-lexend-deca text-[11px] leading-[14px] font-medium whitespace-nowrap text-[#e11a2b]">
      {children}
    </span>
  );
}

/**
 * Nearby store row (Figma "Nearby store", 770×112). Desktop pins every element at its
 * design offset; below lg the wrappers become a normal flex layout.
 */
function OfflineCard({ store, index, active, onSelect }: { store: OfflineStore; index: number; active: boolean; onSelect: () => void }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
  const photo = store.image && store.image !== PLACEHOLDER_PHOTO ? store.image : "";
  return (
    <li
      onClick={onSelect}
      className={`relative flex cursor-pointer gap-3 rounded-[8px] border bg-white p-3 transition-colors lg:block lg:h-[112px] lg:p-0 ${
        active ? "border-[#e11a2b]/50" : "border-[#e4e5e8] hover:border-[#e11a2b]/30"
      }`}
    >
      <div className="relative flex h-[82px] w-[95px] shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#f6f7f9] lg:absolute lg:top-[15px] lg:left-4">
        {photo ? (
          <Image src={photo} alt="" width={516} height={387} sizes="95px" className="size-full object-cover" />
        ) : (
          <span aria-hidden className="font-lexend-deca text-[13px] font-semibold leading-4 text-[#e11a2b]">
            STORE
          </span>
        )}
      </div>
      <span className="absolute top-1.5 left-2 flex size-7 items-center justify-center rounded-full bg-[#e11a2b] font-lexend-deca text-[12px] leading-none font-semibold text-white">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 lg:contents">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 lg:contents">
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={active}
            className="cursor-pointer text-left font-lexend-deca text-[17px] leading-[21px] font-semibold text-[#17191c] lg:absolute lg:top-[18px] lg:left-[128px] lg:whitespace-nowrap"
          >
            {store.name}
          </button>
          <span className="font-lexend-deca text-[11px] leading-[14px] font-medium text-[#666b73] lg:absolute lg:top-5 lg:left-[298px]">{store.type}</span>
        </div>
        <p className="font-lexend-deca text-[12px] leading-[18px] text-[#666b73] lg:absolute lg:top-[49px] lg:left-[128px] lg:whitespace-nowrap">
          {store.address[0]}
          <br />
          {store.address[1]}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 lg:contents">
          {store.distanceKm !== undefined && (
            <p className="font-lexend-deca text-[14px] leading-[18px] font-medium whitespace-pre text-[#17191c] lg:absolute lg:top-[30px] lg:left-[602px]">
              ⌖  {store.distanceKm} km
            </p>
          )}
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-lexend-deca text-[12px] leading-[15px] font-semibold whitespace-nowrap text-[#e11a2b] hover:underline lg:absolute lg:top-[62px] lg:left-[602px]"
          >
            Get directions ↗
          </a>
        </div>
      </div>
    </li>
  );
}

/** Google Maps embed of the selected store (Figma "Map placeholder / developer integration", r9) */
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
    <div className={`overflow-hidden rounded-[9px] bg-[#eef1f0] ${className}`}>
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

/** "NO STORES FOUND" state (Figma 42:3117) */
function NoStores() {
  return (
    <div className="mt-8 flex flex-col items-center text-center">
      <p className="font-lexend-deca text-[14px] leading-[18px] text-[#6a6e74]">No stores in this country yet. Try another country or shop online.</p>
      <Image
        src="/images/pages/where-to-buy/no-stores.png"
        alt="Redragon dragon peeking out of an empty box"
        width={1254}
        height={1254}
        sizes="(min-width: 1024px) 300px, 220px"
        className="mt-4 size-[220px] lg:size-[300px]"
      />
    </div>
  );
}
