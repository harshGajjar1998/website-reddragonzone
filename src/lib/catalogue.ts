"use client";

import { useEffect, useState } from "react";
import { useChrome } from "@/components/layout/ChromeProvider";
import type { Catalogue } from "@/data/gaming";

/*
 * Every product and category, for Compare and the Firmware & Software Finder. The static site
 * serves it as /catalogue.json (src/app/catalogue.json/route.ts) and loads it only where it's used,
 * so the 650+ products aren't built into every page. The CMS draft preview passes it inline
 * (useChrome().catalogue), because a preview must show unpublished edits.
 */

const EMPTY: Catalogue = { products: [], categories: [] };
let loaded: Catalogue | null = null;
let pending: Promise<Catalogue> | null = null;

function load(): Promise<Catalogue> {
  pending ??= fetch("/catalogue.json")
    .then((res) => {
      if (!res.ok) throw new Error(`catalogue.json: HTTP ${res.status}`);
      return res.json() as Promise<Catalogue>;
    })
    .then((c) => (loaded = c))
    .catch((e) => {
      pending = null; // try again next time
      throw e;
    });
  return pending;
}

/** The catalogue (empty until it has loaded). Pass `enabled = false` to skip loading, e.g. while nothing is being compared. */
export function useCatalogue(enabled = true): { catalogue: Catalogue; loaded: boolean } {
  const inline = useChrome().catalogue;
  const [data, setData] = useState<Catalogue | null>(loaded);

  useEffect(() => {
    if (inline || !enabled || data) return;
    let live = true;
    load()
      .then((c) => live && setData(c))
      .catch((e) => console.error(e));
    return () => {
      live = false;
    };
  }, [inline, enabled, data]);

  const catalogue = inline ?? data;
  return { catalogue: catalogue ?? EMPTY, loaded: catalogue !== null };
}
