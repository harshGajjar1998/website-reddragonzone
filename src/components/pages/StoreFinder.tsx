"use client";

import { useState, type FormEvent } from "react";
import { storesByCountry, type Store } from "@/data/pages";

const control = "flex h-[54px] items-center rounded-[4px] font-lexend-deca text-[16px] leading-none lg:text-[20px]";

/** Country select + "Find stores near me" + Submit (Figma "Desktop - 8" on Where to buy). */
export default function StoreFinder() {
  const [country, setCountry] = useState("");
  const [results, setResults] = useState<{ country: string; stores: Store[] } | null>(null);
  const [locating, setLocating] = useState(false);

  const show = (c: string) => setResults({ country: c, stores: storesByCountry[c] ?? [] });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (country) show(country);
  }

  function nearMe() {
    // Best effort: use the browser locale's region to pick a country we list
    setLocating(true);
    const region = new Intl.Locale(navigator.language).maximize().region;
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    const guess = region ? names.of(region) : undefined;
    const match = Object.keys(storesByCountry).find((c) => c === guess);
    setLocating(false);
    if (match) {
      setCountry(match);
      show(match);
    } else setResults({ country: guess ?? "your area", stores: [] });
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-10 flex w-full flex-col gap-3 lg:mt-14 lg:w-auto lg:flex-row lg:gap-4">
        <label className="relative w-full lg:w-[740px]">
          <span className="sr-only">Country</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className={`${control} w-full cursor-pointer appearance-none border border-ink px-5 text-ink outline-none focus:border-crimson`}
          >
            <option value="" disabled>
              Select Country
            </option>
            {Object.keys(storesByCountry).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {/* Material keyboard_arrow_down */}
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="pointer-events-none absolute right-5 top-[17px]">
            <path d="M6.18 7.16 10 10.97l3.82-3.81L15 8.33l-5 5-5-5z" fill="#1D1B20" />
          </svg>
        </label>
        <button
          type="button"
          onClick={nearMe}
          className={`${control} w-full cursor-pointer justify-center lg:w-[308px] border border-ink uppercase text-ink transition-colors hover:bg-ink hover:text-white`}
        >
          {locating ? "Locating…" : "FIND STORES NEAR ME"}
        </button>
        <button
          type="submit"
          className={`${control} w-full cursor-pointer justify-center lg:w-[200px] bg-crimson font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c]`}
        >
          Submit
        </button>
      </form>

      {results && (
        <div aria-live="polite" className="mt-10 w-full">
          {results.stores.length === 0 ? (
            <p className="text-center font-lexend-deca text-[16px] text-[#626466]">
              No authorised stores listed for {results.country} yet – try the official store at{" "}
              <a href="https://redragonshop.com" className="text-dragon underline" target="_blank" rel="noopener noreferrer">
                redragonshop.com
              </a>
              .
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {results.stores.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col gap-1 rounded-[4px] border border-ink/20 px-5 py-4 transition-colors hover:border-crimson"
                  >
                    <span className="font-lexend text-[12px] uppercase tracking-[1px] text-dragon">{s.type}</span>
                    <span className="font-lexend-deca text-[18px] font-medium text-ink">{s.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
