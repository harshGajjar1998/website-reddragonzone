"use client";

import { compareId } from "@/data/compare";
import type { GamingProduct } from "@/data/gaming";
import { COMPARE_MAX, addToCompare, removeFromCompare, useCompareState } from "@/lib/compare";

/** "Compare" checkbox on product cards. Greyed out once the maximum is selected. */
export default function CompareToggle({ product, className = "" }: { product: GamingProduct; className?: string }) {
  const { ids } = useCompareState();
  const id = compareId(product);
  const checked = ids.includes(id);
  const disabled = !checked && ids.length >= COMPARE_MAX;

  return (
    <label
      title={disabled ? `You can compare up to ${COMPARE_MAX} products` : undefined}
      className={`flex items-center gap-2 font-lexend text-[12px] leading-4 text-ink ${
        disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={`Compare ${product.name}`}
        onChange={() => (checked ? removeFromCompare(id) : addToCompare(id))}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`flex size-4 shrink-0 items-center justify-center border peer-focus-visible:ring-2 peer-focus-visible:ring-crimson peer-focus-visible:ring-offset-2 ${
          checked ? "border-crimson bg-crimson" : "border-ink/80 bg-white"
        }`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      Compare
    </label>
  );
}
