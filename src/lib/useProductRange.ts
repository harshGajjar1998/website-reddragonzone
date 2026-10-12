"use client";

import { usePathname } from "next/navigation";

export type ProductRange = "gaming" | "office";

/** "gaming" / "office" on that range's landing page and every page below it, else null. */
export function useProductRange(): ProductRange | null {
  const pathname = usePathname();
  for (const range of ["gaming", "office"] as const) {
    if (pathname === `/${range}` || pathname.startsWith(`/${range}/`)) return range;
  }
  return null;
}
