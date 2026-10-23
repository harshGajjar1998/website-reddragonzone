"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ChromeContent } from "@/data/navigation";

const Ctx = createContext<ChromeContent | null>(null);

/**
 * Site-wide CMS content (announcement bar, menus, search, footer, community block),
 * loaded once in the root layout and read by client components with `useChrome()`.
 */
export default function ChromeProvider({ value, children }: { value: ChromeContent; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChrome(): ChromeContent {
  const value = useContext(Ctx);
  if (!value) throw new Error("useChrome() must be used inside <ChromeProvider>");
  return value;
}
